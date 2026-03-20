from fastapi import APIRouter, Depends, Request
from database import get_db
from services.auth_service import get_admin_user
from services import admin_service
from config import limiter

router = APIRouter()


@router.get("/community/flagged")
@limiter.limit("30/minute")
async def list_flagged_posts(request: Request, db=Depends(get_db), _=Depends(get_admin_user)):
    return await admin_service.get_flagged_posts(db)


@router.delete("/community/{post_id}")
@limiter.limit("30/minute")
async def delete_post(request: Request, post_id: str, db=Depends(get_db), _=Depends(get_admin_user)):
    await admin_service.delete_post(db, post_id)
    return {"deleted": True}


@router.patch("/community/{post_id}/clear-flag")
@limiter.limit("30/minute")
async def clear_flag(request: Request, post_id: str, db=Depends(get_db), _=Depends(get_admin_user)):
    return await admin_service.clear_flag(db, post_id)
