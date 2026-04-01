from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import Optional
from datetime import datetime
from bson import ObjectId
from database import PyObjectId


class UserProfile(BaseModel):
    avatar: Optional[str] = None
    bio: Optional[str] = Field(None, max_length=500)
    location: Optional[str] = None
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
    period_duration: int = 5
    luteal_phase_length: int = 14

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
    is_admin: bool = False
    is_active: bool = True

    is_menstruating: bool
    onboarding_complete: bool = False

    profile: Optional[UserProfile]

    notification_preferences: NotificationPreferences = NotificationPreferences()
    privacy_settings: PrivacySettings = PrivacySettings()
    language_preference: str = "en"
    cycle_preferences: CyclePreferences = CyclePreferences()

    consent: Consent

    created_at: datetime = Field(default_factory=datetime.utcnow)
    last_login: Optional[datetime] = None
    deactivated_at: Optional[datetime] = None
    deletion_scheduled_at: Optional[datetime] = None
    reset_token: Optional[str] = None
    reset_token_expiry: Optional[datetime] = None

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
    height: Optional[float] = Field(None, ge=100, le=250)
    weight: Optional[float] = Field(None, ge=30,  le=250)
    breastfeeding: Optional[bool]  = None
    is_menstruating: Optional[bool] = None
    onboarding_complete: Optional[bool] = None
    profile: Optional[UserProfileNestedUpdate] = None