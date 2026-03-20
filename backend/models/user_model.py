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


class NotificationPreferences(BaseModel):
    email: bool = True
    push: bool = True
    reminders: bool = True

class PrivacySettings(BaseModel):
    data_sharing: bool = False
    anonymous_by_default: bool = True

class CyclePreferences(BaseModel):
    average_cycle_length: int = 28
    average_period_length: int = 5
    luteal_phase_tracking: bool = False

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

    notification_preferences: NotificationPreferences = NotificationPreferences()
    privacy_settings: PrivacySettings = PrivacySettings()
    language_preference: str = "en"
    cycle_preferences: CyclePreferences = CyclePreferences()

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