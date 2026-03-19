from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import Optional
from datetime import datetime
from bson import ObjectId
from database import PyObjectId


class UserProfile(BaseModel):
    avatar: Optional[str]
    bio: Optional[str]
    location: Optional[str]
    language_preference: Optional[str] = "en"


class Consent(BaseModel):
    data_collection: bool
    community_guidelines: bool
    timestamp: datetime


class User(BaseModel):

    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")

    name: str
    email: EmailStr
    password_hash: Optional[str] = None
    auth_provider: str = "email"
    google_id: Optional[str] = None
    avatar_url: Optional[str] = None

    gender: str
    age: int

    role: str = "user"

    is_menstruating: bool

    profile: Optional[UserProfile]

    consent: Consent

    created_at: datetime = Field(default_factory=datetime.utcnow)
    last_login: Optional[datetime] = None

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_encoders={ObjectId: str}
    )

class UserProfileNestedUpdate(BaseModel):
    avatar: Optional[str] = None
    bio: Optional[str] = None
    location: Optional[str] = None
    language_preference: Optional[str] = None

class UserProfileUpdate(BaseModel):
    name: Optional[str] = None
    gender: Optional[str] = None
    age: Optional[int] = None
    is_menstruating: Optional[bool] = None
    profile: Optional[UserProfileNestedUpdate] = None