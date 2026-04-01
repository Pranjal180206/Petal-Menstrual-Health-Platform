from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict, Union
from datetime import datetime
from bson import ObjectId
from database import PyObjectId

class QuizOption(BaseModel):
    id: str
    text: Union[dict, str] # e.g. {"en": "Option A", "hi": "विकल्प क"}

class QuizQuestion(BaseModel):
    id: str
    text: Union[dict, str]
    options: List[QuizOption]
    correct_option_id: str
    explanation: Union[dict, str]

class Quiz(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    title: Union[dict, str]
    description: Union[dict, str]
    questions: List[QuizQuestion]
    is_published: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)

    model_config = ConfigDict(
        populate_by_name=True,
        json_encoders={ObjectId: str},
    )

class ScoreRequest(BaseModel):
    answers: List[Dict[str, str]] # e.g. [{"question_id": "1", "selected_option_id": "a"}]

class ScoreResponse(BaseModel):
    score_percentage: float
    passed: bool
    results: List[Dict] # includes question_id, is_correct, explanation
