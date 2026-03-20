from fastapi import APIRouter, Depends, Request
from database import get_db
from services.auth_service import get_admin_user
from services import admin_service
from services.user_service import deactivate_user
from config import limiter

router = APIRouter()


@router.get("/users")
@limiter.limit("30/minute")
async def list_users(request: Request, skip: int = 0, limit: int = 50, db=Depends(get_db), _=Depends(get_admin_user)):
    return await admin_service.get_all_users(db, skip, limit)


@router.patch("/users/{user_id}/deactivate")
@limiter.limit("30/minute")
async def deactivate_user_route(request: Request, user_id: str, db=Depends(get_db), _=Depends(get_admin_user)):
    """Deactivates user and anonymizes their community posts."""
    return await deactivate_user(user_id, db)
