from fastapi import APIRouter, Depends, Request, HTTPException
from database import get_db
from services.auth_service import get_admin_user
from services import admin_service
from config import limiter
from models.blog_model import BlogCreate, BlogUpdate
from bson import ObjectId
from bson.errors import InvalidId

router = APIRouter()

@router.get("/blogs")
@limiter.limit("30/minute")
async def list_blogs(request: Request, db=Depends(get_db), _=Depends(get_admin_user)):
    return await admin_service.get_blogs(db)

@router.post("/blogs", status_code=201)
@limiter.limit("30/minute")
async def create_blog(request: Request, body: BlogCreate, db=Depends(get_db), _=Depends(get_admin_user)):
    return await admin_service.create_blog(db, body.dict())

@router.patch("/blogs/{blog_id}")
@limiter.limit("30/minute")
async def update_blog(request: Request, blog_id: str, body: BlogUpdate, db=Depends(get_db), _=Depends(get_admin_user)):
    try:
        ObjectId(blog_id)
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid ID format")
    updated = await admin_service.update_blog(db, blog_id, body.dict(exclude_unset=True))
    if not updated:
        raise HTTPException(status_code=404, detail="Blog not found")
    return updated

@router.delete("/blogs/{blog_id}")
@limiter.limit("30/minute")
async def delete_blog(request: Request, blog_id: str, db=Depends(get_db), _=Depends(get_admin_user)):
    try:
        ObjectId(blog_id)
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid ID format")
    deleted = await admin_service.delete_blog(db, blog_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Blog not found")
    return {"deleted": True}
