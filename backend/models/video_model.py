from pydantic import BaseModel, Field
from typing import Optional, List
from bson import ObjectId

class VideoCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=300)
    youtube_url: str = Field(..., min_length=10, max_length=500)
    description: Optional[str] = Field(None, max_length=2000)
    category: str = "general"
    tags: List[str] = []
    duration_minutes: Optional[int] = None
    display_order: Optional[int] = None

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class VideoUpdate(BaseModel):
    title: Optional[str] = Field(None, max_length=300)
    youtube_url: Optional[str] = Field(None, max_length=500)
    description: Optional[str] = Field(None, max_length=2000)
    category: Optional[str] = None
    tags: Optional[List[str]] = None
    duration_minutes: Optional[int] = None
    display_order: Optional[int] = None
    is_published: Optional[bool] = None

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
