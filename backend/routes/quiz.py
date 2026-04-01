from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import List, Any, Optional
from models.quiz_model import ScoreRequest, ScoreResponse
from services.quiz_service import quiz_service
from services.auth_service import get_current_user
import logging
from utils.i18n import resolve_lang, translate_field

def translate_quiz(quiz: dict, lang: str) -> dict:
    for field in ["title", "description"]:
        if field in quiz:
            quiz[field] = translate_field(quiz[field], lang)
    for q in quiz.get("questions", []):
        if "text" in q:
            q["text"] = translate_field(q["text"], lang)
        if "explanation" in q:
            q["explanation"] = translate_field(q["explanation"], lang)
        for opt in q.get("options", []):
            if "text" in opt:
                opt["text"] = translate_field(opt["text"], lang)
    return quiz

logger = logging.getLogger(__name__)

from fastapi.security import OAuth2PasswordBearer
from services.auth_service import decode_access_token
from services.user_service import user_service

router = APIRouter()

oauth2_scheme_optional = OAuth2PasswordBearer(tokenUrl="/api/auth/login", auto_error=False)

async def get_optional_user(token: Optional[str] = Depends(oauth2_scheme_optional)) -> Optional[dict]:
    if not token:
        return None
    try:
        payload = decode_access_token(token)
        user_id = payload.get("sub")
        if user_id:
            return await user_service.get_user_by_id(user_id)
    except Exception as e:
        logger.warning(f"Optional auth failed in quiz route: {e}")
        current_user = None
    return None

def clean_quiz_for_public(quiz: dict) -> dict:
    # Remove correct answers before sending
    quiz["id"] = str(quiz.pop("_id", ""))
    
    questions = quiz.get("questions", [])
    for q in questions:
        q.pop("correct_option_id", None)
        q.pop("explanation", None)
    return quiz

@router.get("/")
async def list_quizzes(lang: str = Query("en")):
    resolved = resolve_lang(lang)
    quizzes = await quiz_service.get_published_quizzes()
    return [translate_quiz(clean_quiz_for_public(q), resolved) for q in quizzes]

@router.get("/{quiz_id}")
async def get_quiz(quiz_id: str, lang: str = Query("en")):
    resolved = resolve_lang(lang)
    quiz = await quiz_service.get_quiz(quiz_id)
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    return translate_quiz(clean_quiz_for_public(quiz), resolved)

@router.post("/{quiz_id}/submit", response_model=ScoreResponse)
async def submit_quiz(quiz_id: str, request: ScoreRequest, current_user: Optional[dict] = Depends(get_optional_user)):
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
