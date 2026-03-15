from pydantic import BaseModel, Field
from typing import List
from datetime import datetime
from bson import ObjectId
from database import PyObjectId


class EducationContent(BaseModel):

    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")

    title: str

    category: str

    target_gender: str

    age_group: str

    content: str

    media: List[str]

    language: str

    created_by: str

    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}