from typing import List, Optional, Tuple
from bson import ObjectId
from datetime import datetime
from models.community_post_model import ForumPostReq, ForumReplyReq, AuthorInfo, ForumPostResponse, ForumReplyResponse
from database import get_db

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

class ForumService:
    @staticmethod
    async def get_posts(skip: int = 0, limit: int = 20) -> List[dict]:
        db = get_db()
        cursor = db["forum_posts"].find({"is_flagged": {"$ne": True}}).sort("created_at", -1).skip(skip).limit(limit)
        posts = await cursor.to_list(length=limit)
        return [_format_post(p) for p in posts]

    @staticmethod
    async def create_post(data: ForumPostReq, current_user: Optional[dict]) -> dict:
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
        
        result = await db["forum_posts"].insert_one(post_data)
        created = await db["forum_posts"].find_one({"_id": result.inserted_id})
        return _format_post(created)

    @staticmethod
    async def add_reply(post_id: str, data: ForumReplyReq, current_user: Optional[dict]) -> Optional[dict]:
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
        except Exception:
            return None
        
        updated = await db["forum_posts"].find_one_and_update(
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
        except Exception:
            return None
            
        post = await db["forum_posts"].find_one({"_id": post_oid})
        if not post: return None
        
        likes = post.get("likes", [])
        if user_id in likes:
            update_query = {"$pull": {"likes": user_id}}
        else:
            update_query = {"$addToSet": {"likes": user_id}}
            
        updated = await db["forum_posts"].find_one_and_update(
            {"_id": post_oid},
            update_query,
            return_document=True
        )
        return _format_post(updated)

    @staticmethod
    async def flag_post(post_id: str) -> bool:
        db = get_db()
        try:
            post_oid = ObjectId(post_id)
        except Exception:
            return False
            
        result = await db["forum_posts"].update_one(
            {"_id": post_oid},
            {"$set": {"is_flagged": True}}
        )
        return result.modified_count > 0

forum_service = ForumService()
