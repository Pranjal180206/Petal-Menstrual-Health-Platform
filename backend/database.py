import os
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/petal_health")

class Database:
    client: AsyncIOMotorClient = None
    db = None

db_config = Database()

async def ensure_indexes():
    """Create all required database indexes on startup."""
    db = db_config.db
    if db is None:
        return

    # users collection
    await db["users"].create_index("email", unique=True)
    await db["users"].create_index("created_at")

    # community_posts collection
    await db["community_posts"].create_index("created_at")
    await db["community_posts"].create_index("is_flagged")
    await db["community_posts"].create_index("author.user_id")

    # cycle_logs collection
    await db["cycle_logs"].create_index("user_id")
    await db["cycle_logs"].create_index("created_at")

    # daily_symptoms
    await db["daily_symptoms"].create_index([("user_id", 1)])
    await db["daily_symptoms"].create_index([("user_id", 1), ("date", -1)])

    # health_reports
    await db["health_reports"].create_index([("user_id", 1)])

    # risk_scores
    await db["risk_scores"].create_index([("user_id", 1)])

    # notifications
    await db["notifications"].create_index([("user_id", 1), ("created_at", -1)])

    # myth_facts
    await db["myth_facts"].create_index([("_id", 1)])

    # education_content
    await db["education_content"].create_index([("_id", 1)])
    await db["education_content"].create_index("slug", unique=True, sparse=True)
    await db["education_content"].create_index("is_featured")
    await db["education_content"].create_index("tags")

    # quizzes
    await db["quizzes"].create_index([("is_published", 1)])

    # quiz_scores collection
    await db["quiz_scores"].create_index("quiz_id")
    await db["quiz_scores"].create_index("user_id")
    await db["quiz_scores"].create_index("submitted_at")
    await db["quiz_scores"].create_index([
        ("quiz_id", 1), 
        ("submitted_at", -1)
    ])

    await db["education_videos"].create_index(
        [("is_published", 1), ("display_order", 1)]
    )
    await db["education_videos"].create_index("category")
    await db["blogs"].create_index(
        [("is_published", 1), ("created_at", -1)]
    )
    await db["blogs"].create_index("slug", unique=True)
    await db["blogs"].create_index("category")

    print("Database indexes ensured.")

async def connect_to_mongo():
    if not MONGO_URI.startswith("mongodb"):
        raise ValueError("Invalid MONGO_URI strictly defined configuration")
    db_config.client = AsyncIOMotorClient(MONGO_URI)
    # The database name could optionally be parsed from the URI, 
    # but here we'll assume 'petal_health' if not explicitly defined in URI
    db_name = MONGO_URI.split("/")[-1].split("?")[0]
    if not db_name:
        db_name = "petal_health"
        
    db_config.db = db_config.client[db_name]
    print(f"Connected to MongoDB: {db_name}")
    await ensure_indexes()

async def close_mongo_connection():
    if db_config.client:
        db_config.client.close()
        print("MongoDB connection closed")

def get_db():
    return db_config.db

from typing import Any
from pydantic_core import core_schema

class PyObjectId(str):
    @classmethod
    def __get_pydantic_core_schema__(
            cls, _source_type: Any, _handler: Any
    ) -> core_schema.CoreSchema:
        return core_schema.json_or_python_schema(
            json_schema=core_schema.str_schema(),
            python_schema=core_schema.union_schema([
                core_schema.is_instance_schema(ObjectId),
                core_schema.chain_schema([
                    core_schema.str_schema(),
                    core_schema.no_info_plain_validator_function(cls.validate)
                ])
            ]),
            serialization=core_schema.plain_serializer_function_ser_schema(
                lambda x: str(x)
            ),
        )

    @classmethod
    def validate(cls, value) -> ObjectId:
        if not ObjectId.is_valid(value):
            raise ValueError("Invalid ObjectId")
        return ObjectId(value)