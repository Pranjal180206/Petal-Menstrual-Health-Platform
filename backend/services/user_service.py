from typing import Optional
from pymongo.errors import DuplicateKeyError
from fastapi import HTTPException
from bson import ObjectId
from bson.errors import InvalidId
from models.user_model import User, NotificationPreferences, PrivacySettings
from database import get_db
from pydantic import BaseModel, Field

class UserSettingsUpdate(BaseModel):
    notification_preferences: Optional[NotificationPreferences] = None
    privacy_settings: Optional[PrivacySettings] = None
    language_preference: Optional[str] = None

class CyclePreferencesUpdate(BaseModel):
    average_cycle_length: Optional[int] = Field(None, ge=15, le=60)
    average_period_length: Optional[int] = Field(None, ge=1, le=15)
    luteal_phase_length: Optional[int] = Field(None, ge=10, le=16)

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
            oid = ObjectId(user_id)
        except (InvalidId, Exception):
            return None
            
        user = await db["users"].find_one({"_id": oid})
        if user is None:
            return None
            
        user["_id"] = str(user["_id"])
        return user

    @staticmethod
    async def create_user(user_data: dict) -> dict:
        db = get_db()
        try:
            result = await db["users"].insert_one(user_data)
        except DuplicateKeyError:
            raise HTTPException(status_code=409, detail="Email already registered")
            
        created_user = await db["users"].find_one({"_id": result.inserted_id})
        return created_user

    @staticmethod
    async def update_user_profile(user_id: ObjectId, update_data) -> Optional[dict]:
        from pymongo import ReturnDocument
        db = get_db()
        
        # Convert Pydantic model to dict if needed, excluding unset/none
        data_dict = update_data.model_dump(exclude_unset=True) if hasattr(update_data, "model_dump") else update_data
        
        payload = {}
        for k, v in data_dict.items():
            if v is not None:
                if isinstance(v, dict):
                    # Flatten nested dicts for Mongo $set so we don't overwrite the entire object
                    for sub_k, sub_v in v.items():
                        if sub_v is not None:
                            payload[f"{k}.{sub_k}"] = sub_v
                else:
                    payload[k] = v
                    
        if not payload:
            return await db["users"].find_one({"_id": user_id})
            
        updated = await db["users"].find_one_and_update(
            {"_id": user_id},
            {"$set": payload},
            return_document=ReturnDocument.AFTER
        )
        return updated

    @staticmethod
    async def update_user_settings(user_id, update_data, db=None):
        if db is None:
            db = get_db()
        from pymongo import ReturnDocument
        
        data_dict = update_data.model_dump(exclude_unset=True) if hasattr(update_data, "model_dump") else update_data
        
        payload = {}
        for k, v in data_dict.items():
            if v is not None:
                if isinstance(v, dict):
                    for sub_k, sub_v in v.items():
                        if sub_v is not None:
                            payload[f"{k}.{sub_k}"] = sub_v
                else:
                    payload[k] = v
                    
        if not payload:
            return await db["users"].find_one({"_id": user_id})
            
        updated = await db["users"].find_one_and_update(
            {"_id": user_id},
            {"$set": payload},
            return_document=ReturnDocument.AFTER
        )
        return updated

    @staticmethod
    async def update_cycle_preferences(user_id, update_data: CyclePreferencesUpdate, db=None) -> dict:
        if db is None:
            db = get_db()
        from pymongo import ReturnDocument
        
        data_dict = update_data.model_dump(exclude_unset=True) if hasattr(update_data, "model_dump") else update_data
        
        payload = {}
        for k, v in data_dict.items():
            if v is not None:
                payload[f"cycle_preferences.{k}"] = v
                
        if not payload:
            return await db["users"].find_one({"_id": user_id})
            
        updated = await db["users"].find_one_and_update(
            {"_id": user_id},
            {"$set": payload},
            return_document=ReturnDocument.AFTER
        )
        return updated

user_service = UserService()
