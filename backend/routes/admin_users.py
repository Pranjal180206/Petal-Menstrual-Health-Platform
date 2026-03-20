from fastapi import APIRouter, Depends
from database import get_db
from services.auth_service import get_admin_user
from services import admin_service

router = APIRouter()


@router.get("/users")
async def list_users(skip: int = 0, limit: int = 50, db=Depends(get_db), _=Depends(get_admin_user)):
    return await admin_service.get_all_users(db, skip, limit)


@router.patch("/users/{user_id}/deactivate")
async def toggle_user_active(user_id: str, db=Depends(get_db), _=Depends(get_admin_user)):
    return await admin_service.toggle_user_active(db, user_id)
