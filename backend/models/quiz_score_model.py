from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class QuizScoreRecord(BaseModel):
    """
    Stored in quiz_scores collection on every quiz submission.
    """
    quiz_id: str
    quiz_title: str                    # denormalized for easy admin display
    user_id: Optional[str] = None      # None for anonymous attempts
    user_name: Optional[str] = None    # denormalized for easy admin display
    user_email: Optional[str] = None   # denormalized for admin display
    score: float                       # percentage score 0-100
    passed: bool                       # score >= 70
    total_questions: int
    correct_answers: int
    time_taken_seconds: Optional[int] = None  # future use
    submitted_at: datetime = Field(default_factory=datetime.utcnow)
    language: Optional[str] = "en"


class QuizScoreResponse(BaseModel):
    """
    Returned to admin when listing scores.
    """
    id: str
    quiz_id: str
    quiz_title: str
    user_id: Optional[str]
    user_name: Optional[str]
    user_email: Optional[str]
    score: float
    passed: bool
    total_questions: int
    correct_answers: int
    submitted_at: datetime
    language: Optional[str]
