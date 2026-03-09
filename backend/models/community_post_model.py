from pydantic import BaseModel, Field
from typing import List
from datetime import datetime
from bson import ObjectId
from database import PyObjectId


class CommunityPost(BaseModel):

    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")

    anonymous_user_id: str

    title: str

    content: str

    tags: List[str]

    likes: int = 0

    replies_count: int = 0

    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}