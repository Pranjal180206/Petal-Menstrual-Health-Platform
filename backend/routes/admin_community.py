from fastapi import APIRouter, Depends
from database import get_db
from services.auth_service import get_admin_user
from services import admin_service

router = APIRouter()


@router.get("/community/flagged")
async def list_flagged_posts(db=Depends(get_db), _=Depends(get_admin_user)):
    return await admin_service.get_flagged_posts(db)


@router.delete("/community/{post_id}")
async def delete_post(post_id: str, db=Depends(get_db), _=Depends(get_admin_user)):
    await admin_service.delete_post(db, post_id)
    return {"deleted": True}


@router.patch("/community/{post_id}/clear-flag")
async def clear_flag(post_id: str, db=Depends(get_db), _=Depends(get_admin_user)):
    return await admin_service.clear_flag(db, post_id)
