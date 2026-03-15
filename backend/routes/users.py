from fastapi import APIRouter, Depends
from services.auth_service import get_current_user

router = APIRouter()

@router.get("/profile")
async def get_user_profile(current_user: dict = Depends(get_current_user)):
    user = dict(current_user)
    user["id"] = str(user.pop("_id"))
    user.pop("password_hash", None)
    return user
