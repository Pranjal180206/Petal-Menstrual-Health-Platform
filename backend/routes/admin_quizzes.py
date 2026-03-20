from fastapi import APIRouter, Depends
from typing import Optional, List
from pydantic import BaseModel
from database import get_db
from services.auth_service import get_admin_user
from services import admin_service

router = APIRouter()


class QuizQuestion(BaseModel):
    id: str
    question: str
    options: List[dict]
    correct_option_id: str
    explanation: str


class QuizCreate(BaseModel):
    title: str
    description: Optional[str] = None
    questions: List[dict] = []
    is_published: Optional[bool] = False


class QuizUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    questions: Optional[List[dict]] = None
    is_published: Optional[bool] = None


@router.get("/quizzes")
async def list_quizzes(db=Depends(get_db), _=Depends(get_admin_user)):
    return await admin_service.get_quizzes(db)


@router.post("/quizzes", status_code=201)
async def create_quiz(body: QuizCreate, db=Depends(get_db), _=Depends(get_admin_user)):
    return await admin_service.create_quiz(db, body.model_dump())


@router.patch("/quizzes/{quiz_id}")
async def update_quiz(quiz_id: str, body: QuizUpdate, db=Depends(get_db), _=Depends(get_admin_user)):
    return await admin_service.update_quiz(db, quiz_id, body.model_dump(exclude_unset=True))


@router.delete("/quizzes/{quiz_id}")
async def delete_quiz(quiz_id: str, db=Depends(get_db), _=Depends(get_admin_user)):
    await admin_service.delete_quiz(db, quiz_id)
    return {"deleted": True}


@router.patch("/quizzes/{quiz_id}/publish")
async def toggle_publish(quiz_id: str, db=Depends(get_db), _=Depends(get_admin_user)):
    return await admin_service.toggle_publish(db, quiz_id)
