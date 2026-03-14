from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from bson import ObjectId
from database import PyObjectId

class AuthorInfo(BaseModel):
    user_id: str
    name: str
    avatar: Optional[str] = None

class ForumReplyReq(BaseModel):
    content: str
    is_anonymous: bool = False

class ForumReplyResponse(BaseModel):
    id: str
    author: AuthorInfo
    content: str
    is_anonymous: bool
    created_at: datetime
    is_flagged: bool

class ForumPostReq(BaseModel):
    title: str
    content: str
    category: str
    is_anonymous: bool = False

class ForumPostResponse(BaseModel):
    id: str
    title: str
    content: str
    category: str
    author: AuthorInfo
    is_anonymous: bool
    created_at: datetime
    likes: List[str] = []
    likes_count: int = 0
    replies: List[ForumReplyResponse] = []
    is_flagged: bool = False
    
    class Config:
        json_encoders = {ObjectId: str}