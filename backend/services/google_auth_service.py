import httpx
import os
import logging
from pathlib import Path
from fastapi import HTTPException
from datetime import datetime
from dotenv import load_dotenv

logger = logging.getLogger(__name__)

# Use path relative to this file so it works regardless of uvicorn's cwd
_env_path = Path(__file__).parent.parent / '.env'
load_dotenv(dotenv_path=_env_path, override=True)
logger.info(f"[STARTUP] google_auth_service loading .env from: {_env_path}")
logger.info(f"[STARTUP] GOOGLE_CLIENT_ID loaded: {bool(os.getenv('GOOGLE_CLIENT_ID'))}")
logger.info(f"[STARTUP] GOOGLE_CLIENT_SECRET loaded: {bool(os.getenv('GOOGLE_CLIENT_SECRET'))}")

ALLOWED_REDIRECT_URIS = [
    os.getenv("GOOGLE_REDIRECT_URI", "http://localhost:5173"),
    "http://localhost:5174",
    # add production URL here when deploying
]

async def exchange_code_for_profile(code: str, redirect_uri: str) -> dict:
    logger.info(f"[DEBUG-FUNC] exchange_code_for_profile called with redirect_uri={redirect_uri}")
    
    if redirect_uri not in ALLOWED_REDIRECT_URIS:
        raise HTTPException(status_code=400, detail="Invalid redirect URI")
    # Re-load dotenv here in case module-level load didn't propagate
    load_dotenv(dotenv_path=_env_path, override=True)
    client_id = os.getenv("GOOGLE_CLIENT_ID")
    client_secret = os.getenv("GOOGLE_CLIENT_SECRET")
    logger.info(f"[DEBUG-FUNC] client_id present: {bool(client_id)}, secret present: {bool(client_secret)}")
    
    if not client_id or not client_secret:
        raise HTTPException(status_code=500, detail="Google Auth is not configured on the server")

    token_url = "https://oauth2.googleapis.com/token"
    data = {
        "code": code,
        "client_id": client_id,
        "client_secret": client_secret,
        "redirect_uri": redirect_uri,
        "grant_type": "authorization_code"
    }
    
    async with httpx.AsyncClient() as client:
        logger.info(f"[DEBUG] Exchanging code with redirect_uri={redirect_uri}, client_id={client_id[:20]}...")
        token_res = await client.post(token_url, data=data)
        logger.info(f"[DEBUG] Google token exchange status: {token_res.status_code}")
        logger.info(f"[DEBUG] Google response: {token_res.text[:500]}")
        if token_res.status_code != 200:
            raise HTTPException(status_code=400, detail=f"Failed to exchange code: {token_res.text}")
            
        token_data = token_res.json()
        access_token = token_data.get("access_token")
        
        if not access_token:
            raise HTTPException(status_code=400, detail="No access token returned")
            
        profile_url = "https://www.googleapis.com/oauth2/v2/userinfo"
        profile_res = await client.get(profile_url, headers={"Authorization": f"Bearer {access_token}"})
        
        if profile_res.status_code != 200:
            raise HTTPException(status_code=400, detail="Failed to fetch Google profile")
            
        profile_data = profile_res.json()
        
        return {
            "google_id": profile_data.get("id"),
            "email": profile_data.get("email"),
            "name": profile_data.get("name"),
            "avatar_url": profile_data.get("picture")
        }

async def get_or_create_user(db, profile: dict) -> dict:
    google_id = profile["google_id"]
    email = profile["email"]
    
    users_collection = db["users"]
    
    # 1. Check if user exists with this google_id
    user = await users_collection.find_one({"google_id": google_id})
    if user:
        if not user.get("is_active", True):
            raise HTTPException(
                status_code=403,
                detail="Your account has been deactivated. Please contact support."
            )
        return user
        
    # 2. Check if user exists with this email (any provider)
    user = await users_collection.find_one({"email": email})
    if user:
        if not user.get("is_active", True):
            raise HTTPException(
                status_code=403,
                detail="Your account has been deactivated. Please contact support."
            )
        await users_collection.update_one(
            {"_id": user["_id"]},
            {"$set": {
                "google_id": google_id,
                "auth_provider": "multiple",
                "avatar_url": user.get("avatar_url") or profile.get("avatar_url")
            }}
        )
        user = await users_collection.find_one({"_id": user["_id"]})
        return user
        
    # 3. If no user found, create new user
    new_user = {
        "email": email,
        "name": profile["name"],
        "avatar_url": profile["avatar_url"],
        "google_id": google_id,
        "auth_provider": "google",
        "password_hash": None,
        "role": "user",
        "gender": "prefer not to say", # default required fields for petal dataset
        "age": 0,
        "is_menstruating": False,
        "created_at": datetime.utcnow(),
        "profile": {"language_preference": "en"},
        "consent": {
            "data_collection": True,
            "community_guidelines": True,
            "timestamp": datetime.utcnow()
        },
        "cycle_preferences": {
            "average_cycle_length": 28,
            "period_duration": 5,
            "luteal_phase_length": 14
        },
        "notification_preferences": {
            "email": True,
            "push": True,
            "reminders": True
        },
        "privacy_settings": {
            "data_sharing": False,
            "anonymous_by_default": True
        },
        "language_preference": "en"
    }
    
    result = await users_collection.insert_one(new_user)
    new_user["_id"] = result.inserted_id
    return new_user
