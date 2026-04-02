from pydantic import BaseModel, Field
from typing import List, Union, Optional
from datetime import datetime
from bson import ObjectId
from database import PyObjectId


class EducationContent(BaseModel):

    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")

    title: Union[dict, str]

    category: str

    target_gender: str

    age_group: str

    content: Union[dict, str]

    media: List[str]

    language: str

    created_by: str

    summary: Optional[Union[dict, str]] = None
    author_name: Optional[str] = None
    tags: Optional[List[str]] = []
    is_featured: Optional[bool] = False
    slug: Optional[str] = None
    is_published: Optional[bool] = True

    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}