from fastapi import APIRouter, Depends, HTTPException
from database import get_db
import services.education_service as education_service
from services.admin_service import get_videos, get_blogs

router = APIRouter()

@router.get("/articles")
async def get_articles(db=Depends(get_db)):
    return await education_service.get_articles(db)

@router.get("/myth-facts")
async def get_myth_facts(lang: str = "en", db=Depends(get_db)):
    return await education_service.get_myth_facts(db)

@router.get("/videos")
async def public_videos(db=Depends(get_db)):
    cursor = db["education_videos"].find(
        {"is_published": True}
    ).sort("display_order", 1)
    docs = await cursor.to_list(length=200)
    for d in docs:
        d["id"] = str(d.pop("_id", ""))
    return docs

@router.get("/blogs")
async def public_blogs(db=Depends(get_db)):
    cursor = db["blogs"].find(
        {"is_published": True}
    ).sort("created_at", -1)
    docs = await cursor.to_list(length=200)
    for d in docs:
        d["id"] = str(d.pop("_id", ""))
    return docs

@router.get("/blogs/{slug}")
async def public_blog_by_slug(slug: str, db=Depends(get_db)):
    doc = await db["blogs"].find_one(
        {"slug": slug, "is_published": True}
    )
    if not doc:
        raise HTTPException(status_code=404, detail="Blog not found")
    doc["id"] = str(doc.pop("_id"))
    return doc
