from fastapi import APIRouter, Depends, HTTPException, Query
from database import get_db
import services.education_service as education_service
from services.admin_service import get_videos, get_blogs
import json
import time
from utils.i18n import resolve_lang, translate_document

VIDEO_TRANSLATABLE = ["title", "description"]
ARTICLE_TRANSLATABLE = ["title", "content"]
MYTH_TRANSLATABLE = ["myth", "fact"]
BLOG_TRANSLATABLE = ["title", "summary", "content"]

router = APIRouter()


def _agent_log(hypothesis_id: str, location: str, message: str, data: dict):
    # #region agent log
    try:
        with open("debug-06837a.log", "a", encoding="utf-8") as f:
            f.write(json.dumps({
                "sessionId": "06837a",
                "runId": "pre-fix",
                "hypothesisId": hypothesis_id,
                "location": location,
                "message": message,
                "data": data,
                "timestamp": int(time.time() * 1000)
            }) + "\n")
    except Exception:
        pass
    # #endregion

@router.get("/articles")
async def get_articles(lang: str = Query("en"), db=Depends(get_db)):
    _agent_log("H3", "backend/routes/education.py:get_articles", "Education articles endpoint called", {})
    resolved = resolve_lang(lang)
    docs = await education_service.get_articles(db)
    return [translate_document(d, resolved, ARTICLE_TRANSLATABLE) for d in docs]

@router.get("/myth-facts")
async def get_myth_facts(lang: str = Query("en"), db=Depends(get_db)):
    resolved = resolve_lang(lang)
    docs = await education_service.get_myth_facts(db)
    return [translate_document(d, resolved, MYTH_TRANSLATABLE) for d in docs]

@router.get("/videos")
async def public_videos(lang: str = Query("en"), db=Depends(get_db)):
    _agent_log("H3", "backend/routes/education.py:public_videos", "Education videos endpoint called", {})
    resolved = resolve_lang(lang)
    cursor = db["education_videos"].find(
        {"is_published": True}
    ).sort("display_order", 1)
    docs = await cursor.to_list(length=200)
    _agent_log("H4", "backend/routes/education.py:public_videos", "Education videos fetched from DB", {"count": len(docs)})
    for d in docs:
        d["id"] = str(d.pop("_id", ""))
    _agent_log("H4", "backend/routes/education.py:public_videos", "Education videos serialized for response", {"count": len(docs), "hasId": bool(docs and "id" in docs[0])})
    return [translate_document(d, resolved, VIDEO_TRANSLATABLE) for d in docs]

@router.get("/blogs")
async def public_blogs(lang: str = Query("en"), db=Depends(get_db)):
    resolved = resolve_lang(lang)
    cursor = db["blogs"].find(
        {"is_published": True}
    ).sort("created_at", -1)
    docs = await cursor.to_list(length=200)
    for d in docs:
        d["id"] = str(d.pop("_id", ""))
    return [translate_document(d, resolved, BLOG_TRANSLATABLE) for d in docs]

@router.get("/blogs/{slug}")
async def public_blog_by_slug(slug: str, lang: str = Query("en"), db=Depends(get_db)):
    resolved = resolve_lang(lang)
    doc = await db["blogs"].find_one(
        {"slug": slug, "is_published": True}
    )
    if not doc:
        raise HTTPException(status_code=404, detail="Blog not found")
    doc["id"] = str(doc.pop("_id"))
    return translate_document(doc, resolved, BLOG_TRANSLATABLE)
