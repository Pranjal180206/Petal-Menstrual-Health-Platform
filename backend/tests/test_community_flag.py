"""
Test Suite — T1: Community flag abuse fix
=========================================

Covers every case in the spec:

  T1.1  First unique flag → 200, flag_count=1, is_flagged=False
  T1.2  Second unique flag → 200, flag_count=2, is_flagged=False
  T1.3  Duplicate flag (same user) → 409
  T1.4  Third unique flag tips threshold → 200, flag_count=3, is_flagged=True
  T1.5  Flagged post disappears from public feed (GET /api/community/)
  T1.6  Unauthenticated request → 401

Edge cases:
  E1    Non-existent post_id → 404
  E2    flagged_by array exists in MongoDB document after first flag

Run from backend/ directory:
  pytest tests/test_community_flag.py -v

Note: tests within this module are intentionally ordered (they share state
on the same post_id document). pytest-ordering is NOT required — the natural
declaration order is sufficient with pytest's default top-down execution.
"""

import pytest
import pytest_asyncio
from bson import ObjectId
from httpx import AsyncClient

from database import get_db

# Declare the module as async-mode for pytest-asyncio
pytestmark = pytest.mark.asyncio


# ═══════════════════════════════════════════════════════════════════════════════
# Helpers
# ═══════════════════════════════════════════════════════════════════════════════

def _auth(token: str) -> dict:
    """Return an Authorization header dict for a given JWT string."""
    return {"Authorization": f"Bearer {token}"}


async def _flag(client: AsyncClient, post_id: str, token: str):
    """PATCH /api/community/{post_id}/flag with the given token."""
    return await client.patch(
        f"/api/community/{post_id}/flag",
        headers=_auth(token),
    )


# ═══════════════════════════════════════════════════════════════════════════════
# T1.1 — First unique flag succeeds; threshold not reached
# ═══════════════════════════════════════════════════════════════════════════════
async def test_t1_1_first_flag(async_client, test_post_id, user_a_token):
    resp = await _flag(async_client, test_post_id, user_a_token)

    assert resp.status_code == 200, resp.text
    body = resp.json()
    assert body["flag_count"] == 1,   f"Expected flag_count=1, got {body['flag_count']}"
    assert body["is_flagged"] is False, "is_flagged must be False after 1 flag"
    assert body["message"] == "Post flagged"


# ═══════════════════════════════════════════════════════════════════════════════
# T1.2 — Second unique user flags; still below threshold
# ═══════════════════════════════════════════════════════════════════════════════
async def test_t1_2_second_flag(async_client, test_post_id, user_b_token):
    resp = await _flag(async_client, test_post_id, user_b_token)

    assert resp.status_code == 200, resp.text
    body = resp.json()
    assert body["flag_count"] == 2,   f"Expected flag_count=2, got {body['flag_count']}"
    assert body["is_flagged"] is False, "is_flagged must remain False after 2 flags"


# ═══════════════════════════════════════════════════════════════════════════════
# T1.3 — Duplicate flag from user_a → 409
# ═══════════════════════════════════════════════════════════════════════════════
async def test_t1_3_duplicate_flag_rejected(async_client, test_post_id, user_a_token):
    resp = await _flag(async_client, test_post_id, user_a_token)

    assert resp.status_code == 409, (
        f"Expected 409 for duplicate flag, got {resp.status_code}: {resp.text}"
    )
    assert resp.json()["detail"] == "already flagged by this user"


# ═══════════════════════════════════════════════════════════════════════════════
# T1.4 — Third unique user tips the threshold → is_flagged becomes True
# ═══════════════════════════════════════════════════════════════════════════════
async def test_t1_4_threshold_reached(async_client, test_post_id, user_c_token):
    resp = await _flag(async_client, test_post_id, user_c_token)

    assert resp.status_code == 200, resp.text
    body = resp.json()
    assert body["flag_count"] == 3,  f"Expected flag_count=3, got {body['flag_count']}"
    assert body["is_flagged"] is True, "is_flagged must be True once threshold (3) is reached"


# ═══════════════════════════════════════════════════════════════════════════════
# T1.5 — Flagged post is hidden from the public feed
# ═══════════════════════════════════════════════════════════════════════════════
async def test_t1_5_post_hidden_from_feed(async_client, test_post_id):
    resp = await async_client.get("/api/community/")

    assert resp.status_code == 200, resp.text
    posts = resp.json()
    ids_in_feed = {p["id"] for p in posts}
    assert test_post_id not in ids_in_feed, (
        f"Flagged post {test_post_id} should be absent from the public feed "
        f"but was found. Feed IDs: {ids_in_feed}"
    )


# ═══════════════════════════════════════════════════════════════════════════════
# T1.6 — Unauthenticated flag attempt → 401
# ═══════════════════════════════════════════════════════════════════════════════
async def test_t1_6_unauthenticated_flag(async_client, test_post_id):
    resp = await async_client.patch(f"/api/community/{test_post_id}/flag")
    # FastAPI OAuth2PasswordBearer returns 401 for missing/bad token
    assert resp.status_code == 401, (
        f"Expected 401 for unauthenticated request, got {resp.status_code}"
    )


# ═══════════════════════════════════════════════════════════════════════════════
# Edge case E1 — Non-existent post_id → 404
# ═══════════════════════════════════════════════════════════════════════════════
async def test_e1_nonexistent_post(async_client, user_a_token):
    fake_id = str(ObjectId())  # valid ObjectId format but not in DB
    resp = await _flag(async_client, fake_id, user_a_token)

    assert resp.status_code == 404, (
        f"Expected 404 for non-existent post, got {resp.status_code}: {resp.text}"
    )
    assert resp.json()["detail"] == "Post not found"


# ═══════════════════════════════════════════════════════════════════════════════
# Edge case E2 — MongoDB document has a flagged_by array after the first flag
#               (verifies $addToSet persisted correctly)
# ═══════════════════════════════════════════════════════════════════════════════
async def test_e2_flagged_by_exists_in_db(test_post_id):
    """
    Direct DB assertion — bypasses the API layer to confirm $addToSet
    wrote `flagged_by` into the document.

    This test intentionally has no async_client dependency because it
    only queries MongoDB via Motor directly.
    """
    db = get_db()
    doc = await db["community_posts"].find_one(
        {"_id": ObjectId(test_post_id)},
        {"flagged_by": 1, "is_flagged": 1},
    )
    assert doc is not None, "Test post not found in DB"

    # flagged_by should exist and contain at least one entry
    assert "flagged_by" in doc, (
        "Expected 'flagged_by' field to exist on the document after flagging"
    )
    assert len(doc["flagged_by"]) >= 1, (
        "flagged_by should have at least one user_id stored"
    )
    # After T1.4, it must have exactly 3 entries and is_flagged must be True
    assert len(doc["flagged_by"]) == 3, (
        f"Expected 3 entries in flagged_by, got {len(doc['flagged_by'])}"
    )
    assert doc["is_flagged"] is True, (
        "is_flagged must be True in the DB document after threshold was reached"
    )
