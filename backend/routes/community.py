from fastapi import APIRouter, Depends, HTTPException, status, Query, Request
from typing import List, Optional
from models.community_post_model import CommunityPostReq, CommunityReplyReq, CommunityPostResponse
from services.community_service import community_service
from services.auth_service import get_current_user

from config import limiter
router = APIRouter()

# Dependency to optionally get user
from fastapi.security import OAuth2PasswordBearer
from services.auth_service import decode_access_token
from services.user_service import user_service
oauth2_scheme_optional = OAuth2PasswordBearer(tokenUrl="/api/auth/login", auto_error=False)

async def get_optional_user(token: Optional[str] = Depends(oauth2_scheme_optional)) -> Optional[dict]:
    if not token:
        return None
    try:
        payload = decode_access_token(token)
        user_id = payload.get("sub")
        if user_id:
            return await user_service.get_user_by_id(user_id)
    except:
        pass
    return None

@router.get("/", response_model=List[CommunityPostResponse])
async def list_posts(skip: int = Query(0, ge=0), limit: int = Query(20, le=100), user_id: Optional[str] = None):
    return await community_service.get_posts(skip, limit, user_id)

@router.post("/", response_model=CommunityPostResponse, status_code=status.HTTP_201_CREATED)
@limiter.limit("20/minute")
async def create_post(request: Request, body: CommunityPostReq, current_user: Optional[dict] = Depends(get_optional_user)):
    return await community_service.create_post(body, current_user)

@router.post("/{post_id}/reply", response_model=CommunityPostResponse)
async def add_reply(post_id: str, request: CommunityReplyReq, current_user: Optional[dict] = Depends(get_optional_user)):
    updated = await community_service.add_reply(post_id, request, current_user)
    if not updated:
        raise HTTPException(status_code=404, detail="Post not found")
    return updated

@router.patch("/{post_id}/like", response_model=CommunityPostResponse)
async def toggle_like(post_id: str, current_user: dict = Depends(get_current_user)):
    updated = await community_service.toggle_like(post_id, str(current_user["_id"]))
    if not updated:
        raise HTTPException(status_code=404, detail="Post not found")
    return updated

@router.patch("/{post_id}/flag", status_code=status.HTTP_200_OK)
async def flag_post(post_id: str, current_user: dict = Depends(get_current_user)):
    user_id = str(current_user["_id"])
    result = await community_service.flag_post(post_id, user_id)

    if result is None:
        raise HTTPException(status_code=404, detail="Post not found")

    if result.get("already_flagged"):
        raise HTTPException(status_code=409, detail="already flagged by this user")
    return {
        "message": "Post flagged",
        "flag_count": result["flag_count"],
        "is_flagged": result["is_flagged"],
    }

@router.delete("/{post_id}", status_code=status.HTTP_200_OK)
async def delete_post(post_id: str, current_user: dict = Depends(get_current_user)):
    user_id = str(current_user["_id"])
    is_admin = current_user.get("is_admin", False)
    result = await community_service.delete_post(post_id, user_id, is_admin)
    if not result:
        raise HTTPException(status_code=403, detail="Not authorized to delete this post or post not found")
    return {"message": "Post deleted successfully"}

@router.delete("/{post_id}/reply/{reply_id}", status_code=status.HTTP_200_OK)
async def delete_reply(post_id: str, reply_id: str, current_user: dict = Depends(get_current_user)):
    user_id = str(current_user["_id"])
    is_admin = current_user.get("is_admin", False)
    result = await community_service.delete_reply(post_id, reply_id, user_id, is_admin)
    if not result:
        raise HTTPException(status_code=403, detail="Not authorized to delete this reply or reply not found")
    return {"message": "Reply deleted successfully"}
