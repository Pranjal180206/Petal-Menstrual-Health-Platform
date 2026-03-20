from fastapi import APIRouter, Depends
from services.auth_service import get_current_user
from services.user_service import user_service, UserSettingsUpdate, CyclePreferencesUpdate
from models.user_model import UserProfileUpdate

router = APIRouter()

@router.get("/profile")
async def get_user_profile(current_user: dict = Depends(get_current_user)):
    user = dict(current_user)
    user["id"] = str(user.pop("_id"))
    user.pop("password_hash", None)
    return user

@router.patch("/profile")
async def update_user_profile(body: UserProfileUpdate, current_user: dict = Depends(get_current_user)):
    user_id = current_user["_id"]
    updated_user = await user_service.update_user_profile(user_id, body)
    
    if updated_user:
        user = dict(updated_user)
        user["id"] = str(user.pop("_id"))
        user.pop("password_hash", None)
        return user
    
    # Fallback to current if no update happened
    return await get_user_profile(current_user)

@router.patch("/settings")
async def update_user_settings(body: UserSettingsUpdate, current_user: dict = Depends(get_current_user)):
    user_id = current_user["_id"]
    updated_user = await user_service.update_user_settings(user_id, body)
    
    if updated_user:
        user = dict(updated_user)
        user["id"] = str(user.pop("_id"))
        user.pop("password_hash", None)
        return user
    
    return await get_user_profile(current_user)

@router.patch("/cycle-preferences")
async def update_cycle_preferences(body: CyclePreferencesUpdate, current_user: dict = Depends(get_current_user)):
    user_id = current_user["_id"]
    updated_user = await user_service.update_cycle_preferences(user_id, body)
    
    if updated_user:
        user = dict(updated_user)
        user["id"] = str(user.pop("_id"))
        user.pop("password_hash", None)
        return user
    
    return await get_user_profile(current_user)
