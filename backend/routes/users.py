from fastapi import APIRouter, Depends
from services.auth_service import get_current_user
from services.user_service import user_service, UserSettingsUpdate, CyclePreferencesUpdate, schedule_deletion
from models.user_model import UserProfileUpdate
from database import get_db

router = APIRouter()

_SENSITIVE_FIELDS = {"password_hash", "is_admin", "google_id", "is_active", "role"}

def sanitize_user(user: dict) -> dict:
    return {k: v for k, v in user.items() if k not in _SENSITIVE_FIELDS}


@router.get("/profile")
async def get_user_profile(current_user: dict = Depends(get_current_user)):
    user = dict(current_user)
    user["id"] = str(user.pop("_id"))
    is_admin = user.get("is_admin", False)
    sanitized = sanitize_user(user)
    sanitized["is_admin"] = is_admin
    return sanitized

@router.patch("/profile")
async def update_user_profile(body: UserProfileUpdate, current_user: dict = Depends(get_current_user)):
    user_id = current_user["_id"]
    updated_user = await user_service.update_user_profile(user_id, body)
    
    if updated_user:
        user = dict(updated_user)
        user["id"] = str(user.pop("_id"))
        is_admin = user.get("is_admin", False)
        sanitized = sanitize_user(user)
        sanitized["is_admin"] = is_admin
        return sanitized
    
    return await get_user_profile(current_user)

@router.patch("/settings")
async def update_user_settings(body: UserSettingsUpdate, current_user: dict = Depends(get_current_user)):
    user_id = current_user["_id"]
    updated_user = await user_service.update_user_settings(user_id, body)
    
    if updated_user:
        user = dict(updated_user)
        user["id"] = str(user.pop("_id"))
        is_admin = user.get("is_admin", False)
        sanitized = sanitize_user(user)
        sanitized["is_admin"] = is_admin
        return sanitized
    
    return await get_user_profile(current_user)

@router.patch("/cycle-preferences")
async def update_cycle_preferences(body: CyclePreferencesUpdate, current_user: dict = Depends(get_current_user)):
    user_id = current_user["_id"]
    updated_user = await user_service.update_cycle_preferences(user_id, body)
    
    if updated_user:
        user = dict(updated_user)
        user["id"] = str(user.pop("_id"))
        is_admin = user.get("is_admin", False)
        sanitized = sanitize_user(user)
        sanitized["is_admin"] = is_admin
        return sanitized
    
    return await get_user_profile(current_user)


@router.delete("/account")
async def request_account_deletion(
    current_user: dict = Depends(get_current_user),
    db=Depends(get_db)
):
    """Schedule account for deletion in 30 days (user-initiated)."""
    user_id = str(current_user.get("id") or current_user.get("_id", ""))
    return await schedule_deletion(user_id, db)
