from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
from datetime import datetime
from bson import ObjectId
from database import PyObjectId

class AuthorInfo(BaseModel):
    user_id: str
    name: str
    avatar: Optional[str] = None

class CommunityReplyReq(BaseModel):
    content: str = Field(..., min_length=1, max_length=1000)
    is_anonymous: bool = False

class CommunityReplyResponse(BaseModel):
    id: str
    author: AuthorInfo
    content: str
    is_anonymous: bool
    created_at: datetime
    is_flagged: bool

class CommunityPostReq(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    content: str = Field(..., min_length=1, max_length=2000)
    category: str = Field(..., min_length=1, max_length=100)
    is_anonymous: bool = False

class CommunityPostResponse(BaseModel):
    id: str
    title: str
    content: str
    category: str
    author: AuthorInfo
    is_anonymous: bool
    created_at: datetime
    likes: List[str] = []
    likes_count: int = 0
    replies: List[CommunityReplyResponse] = []
    is_flagged: bool = False
    flagged_by: List[str] = []

    model_config = ConfigDict(json_encoders={ObjectId: str})