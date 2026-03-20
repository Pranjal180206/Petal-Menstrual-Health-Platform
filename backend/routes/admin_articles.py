from fastapi import APIRouter, Depends, HTTPException
from typing import Optional
from pydantic import BaseModel
from database import get_db
from services.auth_service import get_admin_user
from services import admin_service

router = APIRouter()


class ArticleCreate(BaseModel):
    title: str
    content: str
    category: Optional[str] = "general"


class ArticleUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    category: Optional[str] = None
    is_published: Optional[bool] = None


@router.get("/articles")
async def list_articles(db=Depends(get_db), _=Depends(get_admin_user)):
    return await admin_service.get_articles(db)


@router.post("/articles", status_code=201)
async def create_article(body: ArticleCreate, db=Depends(get_db), _=Depends(get_admin_user)):
    return await admin_service.create_article(db, body.title, body.content, body.category)


@router.patch("/articles/{article_id}")
async def update_article(article_id: str, body: ArticleUpdate, db=Depends(get_db), _=Depends(get_admin_user)):
    return await admin_service.update_article(db, article_id, body.model_dump(exclude_unset=True))


@router.delete("/articles/{article_id}")
async def delete_article(article_id: str, db=Depends(get_db), _=Depends(get_admin_user)):
    await admin_service.delete_article(db, article_id)
    return {"deleted": True}
