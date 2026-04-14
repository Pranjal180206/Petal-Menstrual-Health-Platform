import os
from datetime import datetime, timedelta, timezone
from typing import Optional
from jose import JWTError, jwt
from fastapi import HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer
from dotenv import load_dotenv

load_dotenv()

import warnings

SECRET_KEY = os.getenv("SECRET_KEY", "")

if not SECRET_KEY:
    # On Railway (or any production env), RAILWAY_ENVIRONMENT is set automatically.
    # Crash immediately rather than silently running with a known-public key.
    if os.getenv("RAILWAY_ENVIRONMENT"):
        import sys
        print(
            "[FATAL] SECRET_KEY is not set. "
            "Refusing to start in production. "
            "Set SECRET_KEY in Railway environment variables.",
            flush=True
        )
        sys.exit(1)
    else:
        # Local development only — warn but continue.
        warnings.warn(
            "[SECURITY WARNING] SECRET_KEY is not set. "
            "Using an insecure fallback — never deploy without a real key.",
            stacklevel=2
        )
        SECRET_KEY = "dev_insecure_fallback_do_not_use_in_production"

ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))

import hashlib
import base64
import bcrypt
import logging

logger = logging.getLogger(__name__)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

def _prepare_password(password: str) -> str:
    """
    SHA-256 pre-hash a password before it reaches bcrypt.
    """
    digest = hashlib.sha256(password.encode("utf-8")).digest()
    return base64.b64encode(digest).decode("utf-8")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    p = _prepare_password(plain_password)
    return bcrypt.checkpw(p.encode("utf-8"), hashed_password.encode("utf-8"))

def get_password_hash(password: str) -> str:
    p = _prepare_password(password)
    # gensalt() generates a bcrypt-compatible salt
    hashed_bytes = bcrypt.hashpw(p.encode("utf-8"), bcrypt.gensalt())
    return hashed_bytes.decode("utf-8")

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

async def get_current_user(token: str = Depends(oauth2_scheme)) -> dict:
    from services.user_service import user_service
    
    payload = decode_access_token(token)
    user_id: str = payload.get("sub")
    if user_id is None:
        raise HTTPException(status_code=401, detail="Invalid auth token")
        
    user = await user_service.get_user_by_id(user_id)
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    
    if not user.get("is_active", True):
        raise HTTPException(
            status_code=403,
            detail="Account has been deactivated. Please contact support."
        )
        
    return user

async def get_admin_user(current_user: dict = Depends(get_current_user)) -> dict:
    if not current_user.get("is_admin", False):
        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )
    return current_user


async def create_password_reset_token(email: str, db) -> Optional[str]:
    """
    Finds user by email, generates a secure token,
    stores hashed token + expiry (1 hour) in DB.
    Returns the plain token to be sent via email.
    Returns None silently if email not found (prevents enumeration).
    """
    import secrets

    user = await db["users"].find_one({"email": email})
    if not user:
        # Don't reveal if email exists — return silently
        return None

    if user.get("auth_provider") == "google":
        raise HTTPException(
            status_code=400,
            detail="This account uses Google sign-in. Please use Google to log in."
        )

    token = secrets.token_urlsafe(32)
    token_hash = hashlib.sha256(token.encode()).hexdigest()
    expiry = datetime.now(timezone.utc) + timedelta(hours=1)

    await db["users"].update_one(
        {"_id": user["_id"]},
        {"$set": {
            "reset_token": token_hash,
            "reset_token_expiry": expiry
        }}
    )
    return token


async def reset_password(token: str, new_password: str, db) -> bool:
    """
    Validates token, updates password using the existing hashing pipeline, clears token.
    """
    token_hash = hashlib.sha256(token.encode()).hexdigest()

    user = await db["users"].find_one({
        "reset_token": token_hash,
        "reset_token_expiry": {"$gt": datetime.now(timezone.utc)}
    })

    if not user:
        raise HTTPException(status_code=400, detail="Invalid or expired reset token")

    # Use the same SHA-256 pre-hash pipeline as registration/login
    hashed_password = get_password_hash(new_password)

    await db["users"].update_one(
        {"_id": user["_id"]},
        {
            "$set": {"password_hash": hashed_password},
            "$unset": {"reset_token": "", "reset_token_expiry": ""}
        }
    )
    return True


async def send_reset_email(email: str, token: str, reset_base_url: str):
    """
    EMAIL_PLACEHOLDER: Replace with real email provider
    (SendGrid, Resend, AWS SES, etc.) when ready.
    For now, logs the magic link to the server log for testing.
    """
    reset_link = f"{reset_base_url}/reset-password?token={token}"
    logger.info(f"[PASSWORD RESET] Magic link for {email}: {reset_link}")
    # TODO: implement actual email sending
    # await sendgrid_client.send(to=email, subject="Reset your Petal password", body=reset_link)
