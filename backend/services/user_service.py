from typing import Optional
from pymongo.errors import DuplicateKeyError
from fastapi import HTTPException
from bson import ObjectId
from models.user_model import User
from database import get_db

class UserService:
    @staticmethod
    async def get_user_by_email(email: str) -> Optional[dict]:
        db = get_db()
        user = await db["users"].find_one({"email": email})
        return user

    @staticmethod
    async def get_user_by_id(user_id: str) -> Optional[dict]:
        db = get_db()
        try:
            user = await db["users"].find_one({"_id": ObjectId(user_id)})
            return user
        except:
            return None

    @staticmethod
    async def create_user(user_data: dict) -> dict:
        db = get_db()
        try:
            result = await db["users"].insert_one(user_data)
        except DuplicateKeyError:
            raise HTTPException(status_code=409, detail="Email already registered")
            
        created_user = await db["users"].find_one({"_id": result.inserted_id})
        return created_user

user_service = UserService()
