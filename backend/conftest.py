"""
Shared pytest fixtures for Petal backend test suite.

MongoDB strategy
────────────────
• Reads MONGO_URI from .env (same variable the app uses).
• Stubs connect_to_mongo / close_mongo_connection BEFORE the app's ASGI
  lifespan fires, so the lifespan can't overwrite our Motor client.
• All routes/services call get_db() which returns our test Motor client.
• Uses an isolated database (TEST_DB_NAME, default: "petal_test").
• Every collection in that DB is dropped at end of session.

.env required keys
──────────────────
  MONGO_URI=mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/
  TEST_DB_NAME=petal_test          ← created automatically if absent

Install test deps (inside the venv, one-time)
  pip install pytest pytest-asyncio httpx
"""

# ── Load .env BEFORE any app module is imported ─────────────────────────────
import os
from dotenv import load_dotenv
load_dotenv()

import uuid
import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from motor.motor_asyncio import AsyncIOMotorClient
import asyncio

# @pytest.fixture(scope="session")
# def event_loop():
#     """
#     Force all async fixtures and tests to share a single event loop
#     for the entire test session. This prevents the RuntimeError raised
#     when a Motor client created in one loop is used in another.
#     """
#     policy = asyncio.get_event_loop_policy()
#     loop = policy.new_event_loop()
#     yield loop
#     loop.close()

# ── Atlas / test-DB config ───────────────────────────────────────────────────
MONGO_URI = os.getenv("MONGO_URI")
assert MONGO_URI, (
    "MONGO_URI is not set in .env.\n"
    "Add: MONGO_URI=mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/"
)
TEST_DB_NAME = os.getenv("TEST_DB_NAME", "petal_test")

# ── Import app AFTER load_dotenv ─────────────────────────────────────────────
import database as _db_module   # patched below — no source changes needed
from main import app


# ── DB lifecycle ─────────────────────────────────────────────────────────────
@pytest_asyncio.fixture(scope="session", autouse=True)
async def db_lifecycle():
    """
    Order of operations
    ───────────────────
    1. Create Atlas-compatible Motor client pointed at TEST_DB_NAME.
    2. Patch db_config so every get_db() call returns the test DB.
    3. **Stub connect_to_mongo / close_mongo_connection to no-ops** so the
       FastAPI ASGI lifespan (triggered by async_client) cannot overwrite
       our patch.
    4. Yield (tests run here).
    5. Restore original functions, drop all test collections, close client.
    """
    is_atlas = bool(MONGO_URI) and ("mongodb+srv://" in MONGO_URI or "ssl=true" in MONGO_URI.lower())
    client_kwargs: dict = dict(
        serverSelectionTimeoutMS=10_000,
        connectTimeoutMS=10_000,
    )
    if is_atlas:
        client_kwargs["tls"] = True

    test_client = AsyncIOMotorClient(MONGO_URI, **client_kwargs)
    test_db = test_client[TEST_DB_NAME]

    # ── Patch the app's singleton ────────────────────────────────────────────
    _db_module.db_config.client = test_client
    _db_module.db_config.db = test_db

    # ── Stub lifespan DB functions so the ASGI lifespan is a harmless no-op ─
    async def _noop_connect():
        pass   # db_config already wired above

    async def _noop_close():
        pass   # we'll close in teardown below

    orig_connect = _db_module.connect_to_mongo
    orig_close   = _db_module.close_mongo_connection
    _db_module.connect_to_mongo      = _noop_connect
    _db_module.close_mongo_connection = _noop_close

    print(f"\n[conftest] Using test DB: {TEST_DB_NAME} (Atlas={is_atlas})")

    yield                            # ← all tests run here

    # ── Teardown ─────────────────────────────────────────────────────────────
    _db_module.connect_to_mongo      = orig_connect
    _db_module.close_mongo_connection = orig_close

    try:
        collections = await test_db.list_collection_names()
        for col in collections:
            await test_db.drop_collection(col)
        print(f"\n[conftest] Dropped {len(collections)} test collection(s).")
    finally:
        test_client.close()


# ── HTTP client (uses ASGI transport — no live server needed) ────────────────
@pytest_asyncio.fixture(scope="session")
async def async_client():
    """
    Drives the FastAPI app directly via ASGI.
    The app's lifespan fires here, but connect_to_mongo has been stubbed
    by db_lifecycle (which runs first as autouse=True) so it's harmless.
    """
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://testserver",
    ) as client:
        yield client


# ── Helper: register a fresh user and return its JWT ─────────────────────────
async def _register_and_login(client: AsyncClient, suffix: str) -> str:
    email = f"test_{suffix}_{uuid.uuid4().hex[:6]}@example.com"
    payload = {
        "name": f"Test User {suffix}",
        "email": email,
        "password": "TestPass123!",
        "gender": "female",
        "age": 25,
        "is_menstruating": True,
    }
    resp = await client.post("/api/auth/register", json=payload)
    assert resp.status_code == 201, f"Register failed for {suffix}: {resp.text}"
    return resp.json()["access_token"]


# ── Three independent user tokens (module-scoped) ────────────────────────────
@pytest_asyncio.fixture(scope="module")
async def user_a_token(async_client):
    return await _register_and_login(async_client, "A")


@pytest_asyncio.fixture(scope="module")
async def user_b_token(async_client):
    return await _register_and_login(async_client, "B")


@pytest_asyncio.fixture(scope="module")
async def user_c_token(async_client):
    return await _register_and_login(async_client, "C")


# ── Fresh community post with teardown ────────────────────────────────────────
@pytest_asyncio.fixture(scope="module")
async def test_post_id(async_client, user_a_token):
    """
    Creates a post as user_a and yields its id.
    The session db_lifecycle drops the whole collection at the end, but
    this fixture also does a targeted delete for safety.
    """
    resp = await async_client.post(
        "/api/community/",
        json={
            "title": "Flag-abuse test post",
            "content": "This post exists only for automated flag tests.",
            "category": "general",
            "is_anonymous": False,
        },
        headers={"Authorization": f"Bearer {user_a_token}"},
    )
    assert resp.status_code == 201, f"Create post failed: {resp.text}"
    post_id = resp.json()["id"]

    yield post_id

    from bson import ObjectId
    db = _db_module.get_db()
    await db["community_posts"].delete_one({"_id": ObjectId(post_id)})
