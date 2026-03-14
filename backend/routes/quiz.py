from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Any
from models.quiz_model import ScoreRequest, ScoreResponse
from services.quiz_service import quiz_service
from services.auth_service import get_current_user

router = APIRouter()

def clean_quiz_for_public(quiz: dict) -> dict:
    # Remove correct answers before sending
    quiz["id"] = str(quiz.pop("_id", ""))
    
    questions = quiz.get("questions", [])
    for q in questions:
        q.pop("correct_option_id", None)
        q.pop("explanation", None)
    return quiz

@router.get("/")
async def list_quizzes():
    quizzes = await quiz_service.get_published_quizzes()
    return [clean_quiz_for_public(q) for q in quizzes]

@router.get("/{quiz_id}")
async def get_quiz(quiz_id: str):
    quiz = await quiz_service.get_quiz(quiz_id)
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    return clean_quiz_for_public(quiz)

@router.post("/{quiz_id}/submit", response_model=ScoreResponse)
async def submit_quiz(quiz_id: str, request: ScoreRequest, current_user: dict = Depends(get_current_user)):
    try:
        user_id = str(current_user["_id"]) if current_user else None
        
        result = await quiz_service.score_quiz(
            quiz_id=quiz_id, 
            submitted_answers=request.answers,
            user_id=user_id
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
