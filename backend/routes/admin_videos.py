from fastapi import APIRouter, Depends, Request, HTTPException
from database import get_db
from services.auth_service import get_admin_user
from services import admin_service
from config import limiter
from models.video_model import VideoCreate, VideoUpdate
from bson import ObjectId
from bson.errors import InvalidId

router = APIRouter()


@router.get("/videos")
@limiter.limit("30/minute")
async def list_videos(request: Request, db=Depends(get_db), _=Depends(get_admin_user)):
    return await admin_service.get_videos(db)


@router.post("/videos", status_code=201)
@limiter.limit("30/minute")
async def create_video(request: Request, body: VideoCreate, db=Depends(get_db), _=Depends(get_admin_user)):
    return await admin_service.create_video(db, body.model_dump())


@router.patch("/videos/{video_id}")
@limiter.limit("30/minute")
async def update_video(request: Request, video_id: str, body: VideoUpdate, db=Depends(get_db), _=Depends(get_admin_user)):
    try:
        ObjectId(video_id)
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid ID format")
    updated = await admin_service.update_video(db, video_id, body.model_dump(exclude_unset=True))
    if not updated:
        raise HTTPException(status_code=404, detail="Video not found")
    return updated


@router.delete("/videos/{video_id}")
@limiter.limit("30/minute")
async def delete_video(request: Request, video_id: str, db=Depends(get_db), _=Depends(get_admin_user)):
    try:
        ObjectId(video_id)
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid ID format")
    deleted = await admin_service.delete_video(db, video_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Video not found")
    return {"deleted": True}
