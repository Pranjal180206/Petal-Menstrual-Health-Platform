from fastapi import APIRouter, Depends, HTTPException, status, Request
from pydantic import BaseModel, EmailStr, field_validator
from config import limiter
from datetime import timedelta, datetime
from typing import Optional
from email_validator import validate_email, EmailNotValidError

from services.auth_service import get_password_hash, verify_password, create_access_token, get_current_user, ACCESS_TOKEN_EXPIRE_MINUTES
from services.user_service import user_service
from services.google_auth_service import exchange_code_for_profile, get_or_create_user
from database import get_db
from bson import ObjectId
from routes.users import sanitize_user

router = APIRouter()

def inject_user_defaults(user: dict) -> dict:
    user.setdefault("cycle_preferences", {
        "average_cycle_length": 28,
        "average_period_length": 5,
        "luteal_phase_length": 14
    })
    user.setdefault("notification_preferences", {
        "email": True,
        "push": True,
        "reminders": True
    })
    user.setdefault("privacy_settings", {
        "data_sharing": False,
        "anonymous_by_default": True
    })
    user.setdefault("language_preference", "en")
    return user

class UserRegister(BaseModel):
    name: str
    email: str
    password: str
    gender: str
    age: int
    is_menstruating: bool

    @field_validator("email", mode="before")
    @classmethod
    def validate_email_syntax_only(cls, v: str) -> str:
        """Validate email syntax without DNS/deliverability checks.
        Allows test domains (@example.com, etc.) and avoids network calls."""
        try:
            info = validate_email(v, check_deliverability=False)
            return info.normalized
        except EmailNotValidError as e:
            raise ValueError(str(e))

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: dict

@router.post("/register", status_code=status.HTTP_201_CREATED)
@limiter.limit("3/minute")
async def register(request: Request, user_in: UserRegister):
    existing_user = await user_service.get_user_by_email(user_in.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    user_dict = user_in.model_dump()
    password = user_dict.pop("password")
    user_dict["password_hash"] = get_password_hash(password)
    user_dict["role"] = "user"
    user_dict["created_at"] = datetime.utcnow()
    user_dict["profile"] = {"language_preference": "en"}
    user_dict["consent"] = {
        "data_collection": True,
        "community_guidelines": True,
        "timestamp": datetime.utcnow()
    }
    user_dict["cycle_preferences"] = {
        "average_cycle_length": 28,
        "average_period_length": 5,
        "luteal_phase_length": 14
    }
    user_dict["notification_preferences"] = {
        "email": True,
        "push": True,
        "reminders": True
    }
    user_dict["privacy_settings"] = {
        "data_sharing": False,
        "anonymous_by_default": True
    }
    user_dict["language_preference"] = "en"

    created_user = await user_service.create_user(user_dict)
    
    # Generate token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(created_user["_id"]), "is_admin": created_user.get("is_admin", False)}, expires_delta=access_token_expires
    )
    
    # Strip sensitive info
    created_user["id"] = str(created_user.pop("_id"))
    created_user = inject_user_defaults(created_user)
    created_user = sanitize_user(created_user)
    
    return {
        "access_token": access_token, 
        "token_type": "bearer", 
        "user": created_user
    }

class GoogleAuthRequest(BaseModel):
    code: str
    redirect_uri: str

@router.post("/google")
@limiter.limit("10/minute")
async def google_auth(request: Request, body: GoogleAuthRequest):
    print(f"[ROUTE] POST /auth/google called, code length={len(body.code)}, redirect_uri={body.redirect_uri}")
    try:
        profile = await exchange_code_for_profile(body.code, body.redirect_uri)
    except HTTPException:
        raise  # Let HTTPExceptions pass through with their original status code
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
        
    db = get_db()
    user = await get_or_create_user(db, profile)
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user["_id"]), "is_admin": user.get("is_admin", False)}, expires_delta=access_token_expires
    )
    
    await db["users"].update_one(
        {"_id": ObjectId(user["_id"])},
        {"$set": {"last_login": datetime.utcnow()}}
    )

    user["id"] = str(user.pop("_id"))
    user = inject_user_defaults(user)
    user = sanitize_user(user)
    
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "user": user
    }

@router.post("/login")
@limiter.limit("5/minute")
async def login(request: Request, user_in: UserLogin):
    user = await user_service.get_user_by_email(user_in.email)
    if not user or not user.get("password_hash") or not verify_password(user_in.password, user.get("password_hash")):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user["_id"]), "is_admin": user.get("is_admin", False)}, expires_delta=access_token_expires
    )
    
    
    # Update last login
    await get_db()["users"].update_one(
        {"_id": ObjectId(user["_id"])},
        {"$set": {"last_login": datetime.utcnow()}}
    )

    user["id"] = str(user.pop("_id"))
    user = inject_user_defaults(user)
    user = sanitize_user(user)
    
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "user": user
    }

@router.get("/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    user = dict(current_user)
    user["id"] = str(user.pop("_id"))
    user = inject_user_defaults(user)
    user = sanitize_user(user)
    return user
