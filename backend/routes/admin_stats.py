import asyncio
from fastapi import APIRouter, Depends, Request
from database import get_db
from services.auth_service import get_admin_user
from config import limiter

router = APIRouter()


@router.get("/stats")
@limiter.limit("30/minute")
async def get_stats(request: Request, db=Depends(get_db), _=Depends(get_admin_user)):
    (
        total_users,
        active_users,
        deactivated_users,
        total_posts,
        flagged_posts,
        articles,
        myths,
        videos,
        blogs,
        total_quizzes,
        published_quizzes,
    ) = await asyncio.gather(
        db["users"].count_documents({}),
        db["users"].count_documents({"is_active": True}),
        db["users"].count_documents({"is_active": False}),
        db["community_posts"].count_documents({}),
        db["community_posts"].count_documents({"is_flagged": True}),
        db["education_content"].count_documents({"type": "article"}),
        db["education_content"].count_documents({"type": "myth"}),
        db["education_videos"].count_documents({}),
        db["blogs"].count_documents({}),
        db["quizzes"].count_documents({}),
        db["quizzes"].count_documents({"is_published": True}),
    )

    return {
        "users": {
            "total": total_users,
            "active": active_users,
            "deactivated": deactivated_users,
        },
        "community": {
            "total_posts": total_posts,
            "flagged_count": flagged_posts,
        },
        "education": {
            "articles": articles,
            "myths": myths,
            "videos": videos,
            "blogs": blogs,
        },
        "quizzes": {
            "total": total_quizzes,
            "published": published_quizzes,
        },
    }
