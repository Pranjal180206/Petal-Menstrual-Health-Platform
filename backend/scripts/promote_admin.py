# Usage: python backend/scripts/promote_admin.py --email user@example.com
# Run from project root with backend venv activated

import asyncio
import argparse
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from dotenv import load_dotenv
load_dotenv("backend/.env")

from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId

MONGO_URI = os.getenv("MONGO_URI")
db_name = MONGO_URI.split("/")[-1].split("?")[0]

async def promote_user(email: str):
    client = AsyncIOMotorClient(MONGO_URI)
    db = client[db_name]
    
    user = await db["users"].find_one({"email": email})
    if not user:
        print(f"❌ No user found with email: {email}")
        return
    
    if user.get("is_admin"):
        print(f"⚠️  User {email} is already an admin.")
        return
    
    await db["users"].update_one(
        {"_id": user["_id"]},
        {"$set": {"is_admin": True}}
    )
    print(f"✅ Successfully promoted {email} to admin.")
    print(f"   User ID: {user['_id']}")
    print(f"   Name: {user.get('name', 'Unknown')}")
    client.close()

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Promote a user to admin")
    parser.add_argument("--email", required=True, help="Email of user to promote")
    args = parser.parse_args()
    asyncio.run(promote_user(args.email))
