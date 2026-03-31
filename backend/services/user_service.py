from typing import Optional
from pymongo.errors import DuplicateKeyError
from fastapi import HTTPException
from bson import ObjectId
from bson.errors import InvalidId
from models.user_model import User, NotificationPreferences, PrivacySettings
from database import get_db
from datetime import datetime
from pydantic import BaseModel, Field
import logging

logger = logging.getLogger(__name__)

class UserSettingsUpdate(BaseModel):
    notification_preferences: Optional[NotificationPreferences] = None
    privacy_settings: Optional[PrivacySettings] = None
    language_preference: Optional[str] = None

class CyclePreferencesUpdate(BaseModel):
    average_cycle_length: Optional[int] = Field(None, ge=15, le=60)
    period_duration: Optional[int] = Field(None, ge=1, le=15)
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
    async def update_user_profile(user_id, update_data) -> Optional[dict]:
        from pymongo import ReturnDocument
        from bson import ObjectId
        db = get_db()
        
        try:
            oid = ObjectId(user_id)
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid user ID format")
        
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
            return await db["users"].find_one({"_id": oid})
            
        updated = await db["users"].find_one_and_update(
            {"_id": oid},
            {"$set": payload},
            return_document=ReturnDocument.AFTER
        )
        if updated is None:
            raise HTTPException(status_code=404, detail="User not found or update failed")
        return updated

    @staticmethod
    async def update_user_settings(user_id, update_data, db=None):
        if db is None:
            db = get_db()
        from pymongo import ReturnDocument
        from bson import ObjectId
        
        try:
            oid = ObjectId(user_id)
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid user ID format")
        
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
            {"_id": oid},
            {"$set": payload},
            return_document=ReturnDocument.AFTER
        )
        if updated is None:
            raise HTTPException(status_code=404, detail="User not found or update failed")
        return updated

    @staticmethod
    async def update_cycle_preferences(user_id, update_data: CyclePreferencesUpdate, db=None) -> dict:
        if db is None:
            db = get_db()
        from pymongo import ReturnDocument
        from bson import ObjectId
        
        try:
            oid = ObjectId(user_id)
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid user ID format")
        
        data_dict = update_data.model_dump(exclude_unset=True) if hasattr(update_data, "model_dump") else update_data
        
        payload = {}
        for k, v in data_dict.items():
            if v is not None:
                payload[f"cycle_preferences.{k}"] = v
                
        if not payload:
            return await db["users"].find_one({"_id": user_id})
            
        updated = await db["users"].find_one_and_update(
            {"_id": oid},
            {"$set": payload},
            return_document=ReturnDocument.AFTER
        )
        if updated is None:
            raise HTTPException(status_code=404, detail="User not found or update failed")
        return updated

user_service = UserService()

async def deactivate_user(user_id: str, db) -> dict:
    """Soft deactivate: marks account inactive and anonymizes community posts."""
    from bson import ObjectId
    from bson.errors import InvalidId
    try:
        oid = ObjectId(user_id)
    except (InvalidId, Exception):
        raise HTTPException(status_code=400, detail="Invalid user ID")

    now = datetime.utcnow()
    
    # Deactivate the user
    updated = await db["users"].find_one_and_update(
        {"_id": oid},
        {"$set": {"is_active": False, "deactivated_at": now}},
        return_document=True
    )
    if not updated:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Anonymize their community posts
    await db["community_posts"].update_many(
        {"author.user_id": user_id},
        {"$set": {
            "author.name": "Deleted User",
            "author.user_id": "",
            "author.avatar": None,
            "is_anonymous": True
        }}
    )
    
    updated["id"] = str(updated.pop("_id", ""))
    return updated


async def delete_user_account(user_id: str, db) -> bool:
    """Hard delete: removes user document and all personal health data."""
    from bson import ObjectId
    from bson.errors import InvalidId
    try:
        oid = ObjectId(user_id)
    except (InvalidId, Exception):
        raise HTTPException(status_code=400, detail="Invalid user ID")
    
    # Delete user document
    result = await db["users"].delete_one({"_id": oid})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Delete all health data (community posts already anonymized — keep them)
    await db["cycle_logs"].delete_many({"user_id": {"$in": [user_id, str(oid)]}})
    await db["daily_symptoms"].delete_many({"user_id": {"$in": [user_id, str(oid)]}})
    await db["health_reports"].delete_many({"user_id": {"$in": [user_id, str(oid)]}})
    await db["risk_scores"].delete_many({"user_id": {"$in": [user_id, str(oid)]}})
    
    return True


async def schedule_deletion(user_id: str, db) -> dict:
    """Schedule hard deletion in 30 days. User can cancel by staying active."""
    from bson import ObjectId
    from bson.errors import InvalidId
    from datetime import timedelta, datetime
    try:
        oid = ObjectId(user_id)
    except (InvalidId, Exception):
        raise HTTPException(status_code=400, detail="Invalid user ID")
    
    deletion_date = datetime.utcnow() + timedelta(days=30)
    
    updated = await db["users"].find_one_and_update(
        {"_id": oid},
        {"$set": {"deletion_scheduled_at": deletion_date}},
        return_document=True
    )
    if not updated:
        raise HTTPException(status_code=404, detail="User not found")
    
    # NOTE for ML/backend team: a background job is needed to execute
    # scheduled deletions after 30 days by querying deletion_scheduled_at < now.
    
    return {
        "message": "Account scheduled for deletion in 30 days",
        "deletion_date": deletion_date.isoformat()
    }


async def purge_scheduled_deletions(db) -> int:
    """
    Finds all users where deletion_scheduled_at <= now
    and hard deletes their account + all health data.
    Returns count of users purged.
    """
    now = datetime.utcnow()
    
    cursor = db["users"].find({"deletion_scheduled_at": {"$lte": now}})
    users_to_delete = await cursor.to_list(length=100)  # bounded — process 100 per run
    
    count = 0
    for user in users_to_delete:
        user_id = str(user["_id"])
        try:
            await delete_user_account(user_id, db)
            count += 1
        except Exception as e:
            logger.error(f"[PURGE JOB] Failed to delete user {user_id}: {e}", exc_info=True)
    
    if count > 0:
        logger.info(f"[PURGE JOB] Deleted {count} scheduled account(s)")
    
    return count
