from pydantic import BaseModel, Field
from typing import Optional, List, Union
from bson import ObjectId

class BlogCreate(BaseModel):
    title: Union[dict, str] = Field(..., min_length=1, max_length=300)
    summary: Union[dict, str] = Field(..., min_length=1, max_length=500)
    content: Union[dict, str] = Field(..., min_length=1, max_length=50000)
    category: str = "general"
    author_name: str = "Petal Team"
    tags: List[str] = []
    cover_image_url: Optional[str] = None

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class BlogUpdate(BaseModel):
    title: Optional[Union[dict, str]] = Field(None, max_length=300)
    summary: Optional[Union[dict, str]] = Field(None, max_length=500)
    content: Optional[Union[dict, str]] = Field(None, max_length=50000)
    category: Optional[str] = None
    author_name: Optional[str] = None
    tags: Optional[List[str]] = None
    cover_image_url: Optional[str] = None
    is_published: Optional[bool] = None
    is_featured: Optional[bool] = None

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
