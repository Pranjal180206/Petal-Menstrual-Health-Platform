from fastapi import APIRouter, Depends, Request
from typing import Optional, Union, List
from pydantic import BaseModel, Field
from database import get_db
from services.auth_service import get_admin_user
from services import admin_service
from config import limiter

router = APIRouter()


class ArticleCreate(BaseModel):
    title: Union[dict, str] = Field(..., min_length=1, max_length=300)
    content: Union[dict, str] = Field(..., min_length=1, max_length=50000)
    category: Optional[str] = "general"
    summary: Optional[Union[dict, str]] = None
    author_name: Optional[str] = None
    tags: Optional[List[str]] = []
    is_featured: Optional[bool] = False
    slug: Optional[str] = None


class ArticleUpdate(BaseModel):
    title: Optional[Union[dict, str]] = Field(None, max_length=300)
    content: Optional[Union[dict, str]] = Field(None, max_length=50000)
    category: Optional[str] = None
    is_published: Optional[bool] = None
    summary: Optional[Union[dict, str]] = None
    author_name: Optional[str] = None
    tags: Optional[List[str]] = None
    is_featured: Optional[bool] = None
    slug: Optional[str] = None


@router.get("/articles")
@limiter.limit("30/minute")
async def list_articles(request: Request, db=Depends(get_db), _=Depends(get_admin_user)):
    return await admin_service.get_articles(db)


@router.post("/articles", status_code=201)
@limiter.limit("30/minute")
async def create_article(request: Request, body: ArticleCreate, db=Depends(get_db), _=Depends(get_admin_user)):
    return await admin_service.create_article(db, body.model_dump(exclude_unset=True))


@router.patch("/articles/{article_id}")
@limiter.limit("30/minute")
async def update_article(request: Request, article_id: str, body: ArticleUpdate, db=Depends(get_db), _=Depends(get_admin_user)):
    return await admin_service.update_article(db, article_id, body.model_dump(exclude_unset=True))


@router.delete("/articles/{article_id}")
@limiter.limit("30/minute")
async def delete_article(request: Request, article_id: str, db=Depends(get_db), _=Depends(get_admin_user)):
    await admin_service.delete_article(db, article_id)
    return {"deleted": True}
