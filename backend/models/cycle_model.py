from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from bson import ObjectId
from database import PyObjectId


class CycleLog(BaseModel):

    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")

    user_id: PyObjectId

    cycle_start_date: datetime
    cycle_end_date: Optional[datetime]

    cycle_length: Optional[int]

    symptoms: List[str]

    flow_intensity: Optional[str]

    mood: Optional[str]

    notes: Optional[str]

    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}