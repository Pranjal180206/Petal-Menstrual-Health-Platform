from fastapi import APIRouter, Depends, Request
from typing import Optional, List
from pydantic import BaseModel, Field
from database import get_db
from services.auth_service import get_admin_user
from services import admin_service
from config import limiter

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
