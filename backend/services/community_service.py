import logging
from typing import List, Optional, Tuple
from bson import ObjectId
from datetime import datetime
from models.community_post_model import CommunityPostReq, CommunityReplyReq, AuthorInfo, CommunityPostResponse, CommunityReplyResponse
from database import get_db
from fastapi import HTTPException

logger = logging.getLogger(__name__)

def _anonymize_author(author_info: dict, is_anonymous: bool) -> dict:
    if is_anonymous:
        return {"user_id": "", "name": "Anonymous", "avatar": None}
    return author_info

def _format_reply(r: dict) -> dict:
    return {
        "id": str(r.get("id", ObjectId())), # Ensure ID exists
        "author": _anonymize_author(r.get("author", {}), r.get("is_anonymous", False)),
        "content": r.get("content", ""),
        "is_anonymous": r.get("is_anonymous", False),
        "created_at": r.get("created_at", datetime.utcnow()),
        "is_flagged": r.get("is_flagged", False)
    }

def _format_post(post: dict) -> dict:
    post_id = str(post.get("_id"))
    author = _anonymize_author(post.get("author", {}), post.get("is_anonymous", False))
    likes = post.get("likes", [])
    
    replies = []
    for repl in post.get("replies", []):
        replies.append(_format_reply(repl))
        
    return {
        "id": post_id,
        "title": post.get("title", ""),
        "content": post.get("content", ""),
        "category": post.get("category", ""),
        "author": author,
        "is_anonymous": post.get("is_anonymous", False),
        "created_at": post.get("created_at", datetime.utcnow()),
        "likes": likes,
        "likes_count": len(likes),
        "replies": replies,
        "is_flagged": post.get("is_flagged", False)
    }

class CommunityService:
    @staticmethod
    async def get_posts(skip: int = 0, limit: int = 20, user_id: Optional[str] = None) -> List[dict]:
        db = get_db()
        query = {"is_flagged": {"$ne": True}}
        if user_id:
            query["author.user_id"] = user_id
        cursor = db["community_posts"].find(query).sort("created_at", -1).skip(skip).limit(limit)
        posts = await cursor.to_list(length=limit)
        return [_format_post(p) for p in posts]

    @staticmethod
    async def create_post(data: CommunityPostReq, current_user: Optional[dict]) -> dict:
        db = get_db()
        author = {"user_id": "guest", "name": "Guest", "avatar": None}
        is_anonymous = True
        
        if current_user:
            author = {
                "user_id": str(current_user["_id"]),
                "name": current_user.get("name", "User"),
                "avatar": current_user.get("profile", {}).get("avatar")
            }
            is_anonymous = data.is_anonymous
            
        post_data = {
            "title": data.title,
            "content": data.content,
            "category": data.category,
            "author": author,
            "is_anonymous": is_anonymous,
            "created_at": datetime.utcnow(),
            "likes": [],
            "replies": [],
            "is_flagged": False
        }
        
        result = await db["community_posts"].insert_one(post_data)
        created = await db["community_posts"].find_one({"_id": result.inserted_id})
        return _format_post(created)

    @staticmethod
    async def add_reply(post_id: str, data: CommunityReplyReq, current_user: Optional[dict]) -> Optional[dict]:
        db = get_db()
        author = {"user_id": "guest", "name": "Guest", "avatar": None}
        is_anonymous = True
        
        if current_user:
            author = {
                "user_id": str(current_user["_id"]),
                "name": current_user.get("name", "User"),
                "avatar": current_user.get("profile", {}).get("avatar")
            }
            is_anonymous = data.is_anonymous

        reply = {
            "id": ObjectId(),
            "author": author,
            "content": data.content,
            "is_anonymous": is_anonymous,
            "created_at": datetime.utcnow(),
            "is_flagged": False
        }
        
        try:
            post_oid = ObjectId(post_id)
        except Exception as e:
            logger.error(f"[ERROR] CommunityService.add_reply: {e}", exc_info=True)
            raise HTTPException(status_code=400, detail="Invalid post ID format")
        
        updated = await db["community_posts"].find_one_and_update(
            {"_id": post_oid},
            {"$push": {"replies": reply}},
            return_document=True
        )
        if not updated:
            return None
            
        return _format_post(updated)
        
    @staticmethod
    async def toggle_like(post_id: str, user_id: str) -> Optional[dict]:
        db = get_db()
        try:
            post_oid = ObjectId(post_id)
        except Exception as e:
            logger.error(f"[ERROR] CommunityService.toggle_like: {e}", exc_info=True)
            raise HTTPException(status_code=400, detail="Invalid post ID format")
            
        post = await db["community_posts"].find_one({"_id": post_oid})
        if not post: return None
        
        likes = post.get("likes", [])
        if user_id in likes:
            update_query = {"$pull": {"likes": user_id}}
        else:
            update_query = {"$addToSet": {"likes": user_id}}
            
        updated = await db["community_posts"].find_one_and_update(
            {"_id": post_oid},
            update_query,
            return_document=True
        )
        return _format_post(updated)

    FLAG_THRESHOLD = 1

    @staticmethod
    async def flag_post(post_id: str, user_id: str) -> Optional[dict]:
        """
        Idempotently add user_id to the post's flagged_by set.
        Sets is_flagged=True only once flagged_by reaches FLAG_THRESHOLD users.

        Returns:
            {"already_flagged": True}  — user already flagged this post
            {"already_flagged": False, "flag_count": N, "is_flagged": bool}
            None — post not found
        """
        db = get_db()
        try:
            post_oid = ObjectId(post_id)
        except Exception as e:
            logger.error(f"[ERROR] CommunityService.flag_post: {e}", exc_info=True)
            raise HTTPException(status_code=400, detail="Invalid post ID format")

        # Use $addToSet for atomicity — if user_id is already present the
        # set won't grow and modified_count will be 0.
        result = await db["community_posts"].update_one(
            {"_id": post_oid},
            {"$addToSet": {"flagged_by": user_id}}
        )

        # Post doesn't exist at all
        if result.matched_count == 0:
            return None

        # User already flagged this post (set was not modified)
        already_flagged = (result.modified_count == 0)

        # Fetch updated document to get the current flag count
        post = await db["community_posts"].find_one(
            {"_id": post_oid},
            {"flagged_by": 1, "is_flagged": 1}
        )
        flag_count = len(post.get("flagged_by", []))
        is_flagged = flag_count >= CommunityService.FLAG_THRESHOLD

        # Promote is_flagged once threshold is crossed
        if is_flagged and not post.get("is_flagged", False):
            await db["community_posts"].update_one(
                {"_id": post_oid},
                {"$set": {"is_flagged": True}}
            )

        return {
            "already_flagged": already_flagged,
            "flag_count": flag_count,
            "is_flagged": is_flagged,
        }

    @staticmethod
    async def delete_post(post_id: str, user_id: str, is_admin: bool) -> bool:
        db = get_db()
        try:
            post_oid = ObjectId(post_id)
        except Exception:
            return False
            
        post = await db["community_posts"].find_one({"_id": post_oid})
        if not post: return False
        
        # Check authorization: user is the author or admin
        post_author_id = post.get("author", {}).get("user_id", "")
        if not is_admin and post_author_id != user_id:
            return False
            
        result = await db["community_posts"].delete_one({"_id": post_oid})
        return result.deleted_count > 0

    @staticmethod
    async def delete_reply(post_id: str, reply_id: str, user_id: str, is_admin: bool) -> bool:
        db = get_db()
        try:
            post_oid = ObjectId(post_id)
            reply_oid = ObjectId(reply_id)
        except Exception:
            return False
            
        post = await db["community_posts"].find_one({"_id": post_oid})
        if not post: return False
        
        # Find the specific reply
        target_reply = None
        for r in post.get("replies", []):
            if str(r.get("id")) == reply_id or r.get("id") == reply_oid:
                target_reply = r
                break
                
        if not target_reply:
            return False
            
        reply_author_id = target_reply.get("author", {}).get("user_id", "")
        # Only author or admin can delete
        if not is_admin and reply_author_id != user_id:
            return False
            
        # Delete reply by filtering it out from the replies array
        result = await db["community_posts"].update_one(
            {"_id": post_oid},
            {"$pull": {"replies": {"id": target_reply.get("id")}}}
        )
        return result.modified_count > 0

community_service = CommunityService()
