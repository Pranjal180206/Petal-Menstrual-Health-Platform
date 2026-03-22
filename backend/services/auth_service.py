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
    warnings.warn(
        "[SECURITY WARNING] SECRET_KEY is not set. "
        "Using an empty key is insecure. "
        "Set SECRET_KEY in your .env file before deploying.",
        stacklevel=2
    )
    SECRET_KEY = "dev_insecure_fallback_do_not_use_in_production"

ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))

import hashlib
import base64
import bcrypt

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
