from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from bson import ObjectId
from database import PyObjectId

class CycleLog(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    user_id: str
    cycle_start_date: datetime
    cycle_end_date: Optional[datetime] = None
    cycle_length: Optional[int] = None
    symptoms: List[str] = Field(default_factory=list)
    flow_intensity: Optional[str] = None
    mood: Optional[str] = None
    notes: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class CycleCreateReq(BaseModel):
    cycle_start_date: datetime
    cycle_end_date: Optional[datetime] = None
    symptoms: List[str] = Field(default_factory=list)
    flow_intensity: Optional[str] = None
    mood: Optional[str] = None
    notes: Optional[str] = None

class CycleUpdateReq(BaseModel):
    cycle_start_date: Optional[datetime] = None
    cycle_end_date: Optional[datetime] = None
    symptoms: Optional[List[str]] = None
    flow_intensity: Optional[str] = None
    mood: Optional[str] = None
    notes: Optional[str] = None

class TrackerSummary(BaseModel):
    average_cycle_length: int
    next_period_prediction: Optional[datetime]
    past_cycles: List[dict]