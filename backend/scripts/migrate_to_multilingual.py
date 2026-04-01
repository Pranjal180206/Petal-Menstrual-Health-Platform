"""
One-time migration: wraps flat English string fields into 
multilingual dict format { "en": "original value" }.

Safe to re-run — skips fields already in dict format.
Run from project root with backend venv active:
  python backend/scripts/migrate_to_multilingual.py
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

load_dotenv()

COLLECTIONS = {
    "education_videos": ["title", "description"],
    "blogs": ["title", "summary", "content"],
    "education_content": ["title", "content"],
    "myth_facts": ["myth", "fact"],
}

async def migrate():
    uri = os.getenv("MONGO_URI")
    if not uri:
        print("ERROR: MONGO_URI not found in environment")
        return

    client = AsyncIOMotorClient(uri)
    db = client["menstrual_health_db"]

    total_migrated = 0

    for collection_name, fields in COLLECTIONS.items():
        collection = db[collection_name]
        docs = await collection.find().to_list(None)
        migrated = 0
        skipped = 0

        for doc in docs:
            update = {}
            for field in fields:
                val = doc.get(field)
                if isinstance(val, str):
                    # Wrap flat string as English entry
                    update[field] = {"en": val}
                elif isinstance(val, dict):
                    skipped += 1  # Already migrated
                # None values left as-is

            if update:
                await collection.update_one(
                    {"_id": doc["_id"]},
                    {"$set": update}
                )
                migrated += 1

        print(
            f"{collection_name}: "
            f"{migrated} migrated, "
            f"{skipped} already done, "
            f"{len(docs)} total"
        )
        total_migrated += migrated

    print(f"\nTotal documents migrated: {total_migrated}")
    client.close()

if __name__ == "__main__":
    asyncio.run(migrate())
