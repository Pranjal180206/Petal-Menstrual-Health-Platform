from fastapi import APIRouter, Depends, Request
from typing import Optional, List
from pydantic import BaseModel, Field
from database import get_db
from services.auth_service import get_admin_user
from services import admin_service
from config import limiter
from utils.i18n import resolve_lang

router = APIRouter()


class QuizCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=300)
    description: Optional[str] = Field(None, max_length=1000)
    questions: List[dict] = []
    is_published: Optional[bool] = False


class QuizUpdate(BaseModel):
    title: Optional[str] = Field(None, max_length=300)
    description: Optional[str] = Field(None, max_length=1000)
    questions: Optional[List[dict]] = None
    is_published: Optional[bool] = None


@router.get("/quizzes")
@limiter.limit("30/minute")
async def list_quizzes(request: Request, db=Depends(get_db), _=Depends(get_admin_user)):
    return await admin_service.get_quizzes(db)


@router.post("/quizzes", status_code=201)
@limiter.limit("30/minute")
async def create_quiz(request: Request, body: QuizCreate, db=Depends(get_db), _=Depends(get_admin_user)):
    return await admin_service.create_quiz(db, body.model_dump())


@router.patch("/quizzes/{quiz_id}")
@limiter.limit("30/minute")
async def update_quiz(request: Request, quiz_id: str, body: QuizUpdate, db=Depends(get_db), _=Depends(get_admin_user)):
    return await admin_service.update_quiz(db, quiz_id, body.model_dump(exclude_unset=True))


@router.delete("/quizzes/{quiz_id}")
@limiter.limit("30/minute")
async def delete_quiz(request: Request, quiz_id: str, db=Depends(get_db), _=Depends(get_admin_user)):
    await admin_service.delete_quiz(db, quiz_id)
    return {"deleted": True}


@router.patch("/quizzes/{quiz_id}/publish")
@limiter.limit("30/minute")
async def toggle_publish(request: Request, quiz_id: str, db=Depends(get_db), _=Depends(get_admin_user)):
    return await admin_service.toggle_publish(db, quiz_id)


# ── Helper: serialize MongoDB score doc ──────────────────
def serialize_score(score: dict) -> dict:
    score["id"] = str(score.pop("_id"))
    return score

# ── GET all scores across all quizzes ─────────────────────
@router.get("/quiz-scores")
async def get_all_quiz_scores(
    skip: int = 0,
    limit: int = 50,
    quiz_id: Optional[str] = None,    # filter by specific quiz
    passed: Optional[bool] = None,    # filter by pass/fail
    db=Depends(get_db),
    admin=Depends(get_admin_user)
):
    query = {}
    if quiz_id:
        query["quiz_id"] = quiz_id
    if passed is not None:
        query["passed"] = passed

    scores = await db["quiz_scores"].find(query)\
        .sort("submitted_at", -1)\
        .skip(skip)\
        .limit(limit)\
        .to_list(limit)

    total = await db["quiz_scores"].count_documents(query)

    return {
        "total": total,
        "skip": skip,
        "limit": limit,
        "scores": [serialize_score(s) for s in scores]
    }


# ── GET scores for a specific quiz ───────────────────────
@router.get("/quiz-scores/quiz/{quiz_id}")
async def get_scores_by_quiz(
    quiz_id: str,
    skip: int = 0,
    limit: int = 50,
    db=Depends(get_db),
    admin=Depends(get_admin_user)
):
    scores = await db["quiz_scores"].find(
        {"quiz_id": quiz_id}
    ).sort("submitted_at", -1).skip(skip).limit(limit).to_list(limit)

    total = await db["quiz_scores"].count_documents({"quiz_id": quiz_id})

    # Calculate summary stats for this quiz
    all_scores = await db["quiz_scores"].find(
        {"quiz_id": quiz_id}
    ).to_list(None)

    avg_score = 0.0
    pass_count = 0
    if all_scores:
        avg_score = round(
            sum(s["score"] for s in all_scores) / len(all_scores), 2
        )
        pass_count = sum(1 for s in all_scores if s["passed"])

    return {
        "quiz_id": quiz_id,
        "total_attempts": total,
        "average_score": avg_score,
        "pass_count": pass_count,
        "fail_count": total - pass_count,
        "pass_rate": round(pass_count / total * 100, 1) if total else 0,
        "scores": [serialize_score(s) for s in scores]
    }


# ── GET scores for a specific user ───────────────────────
@router.get("/quiz-scores/user/{user_id}")
async def get_scores_by_user(
    user_id: str,
    db=Depends(get_db),
    admin=Depends(get_admin_user)
):
    scores = await db["quiz_scores"].find(
        {"user_id": user_id}
    ).sort("submitted_at", -1).to_list(50)

    return {
        "user_id": user_id,
        "total_attempts": len(scores),
        "scores": [serialize_score(s) for s in scores]
    }


# ── GET summary stats across all quizzes ─────────────────
@router.get("/quiz-scores/summary")
async def get_quiz_scores_summary(
    db=Depends(get_db),
    admin=Depends(get_admin_user)
):
    total = await db["quiz_scores"].count_documents({})
    passed = await db["quiz_scores"].count_documents({"passed": True})
    
    # Per-quiz breakdown
    pipeline = [
        {
            "$group": {
                "_id": "$quiz_id",
                "quiz_title": {"$first": "$quiz_title"},
                "attempts": {"$sum": 1},
                "avg_score": {"$avg": "$score"},
                "pass_count": {
                    "$sum": {"$cond": ["$passed", 1, 0]}
                }
            }
        },
        {"$sort": {"attempts": -1}}
    ]
    per_quiz = await db["quiz_scores"].aggregate(pipeline).to_list(100)

    return {
        "total_attempts": total,
        "total_passed": passed,
        "total_failed": total - passed,
        "overall_pass_rate": round(passed / total * 100, 1) if total else 0,
        "per_quiz": [
            {
                "quiz_id": q["_id"],
                "quiz_title": q["quiz_title"],
                "attempts": q["attempts"],
                "avg_score": round(q["avg_score"], 2),
                "pass_count": q["pass_count"],
                "pass_rate": round(
                    q["pass_count"] / q["attempts"] * 100, 1
                ) if q["attempts"] else 0
            }
            for q in per_quiz
        ]
    }
