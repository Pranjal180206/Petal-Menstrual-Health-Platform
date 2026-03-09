from pydantic import BaseModel, Field
from typing import List
from datetime import datetime
from bson import ObjectId
from database import PyObjectId


class RiskScore(BaseModel):

    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")

    user_id: PyObjectId

    cycle_id: PyObjectId

    risk_score: float

    risk_level: str

    possible_conditions: List[str]

    recommendation: List[str]

    model_version: str

    generated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}