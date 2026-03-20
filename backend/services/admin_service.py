from bson import ObjectId
from datetime import datetime
from fastapi import HTTPException


def safe_object_id(id_str: str) -> ObjectId:
    try:
        return ObjectId(id_str)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid ID format")


# ─── ARTICLES ──────────────────────────────────────────────────────────────────

async def get_articles(db) -> list:
    cursor = db["education_content"].find({}).sort("created_at", -1)
    docs = await cursor.to_list(length=200)
    for d in docs:
        d["id"] = str(d.pop("_id", ""))
    return docs

async def create_article(db, title: str, content: str, category: str = "general") -> dict:
    doc = {
        "title": title,
        "content": content,
        "category": category,
        "is_published": False,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
    }
    result = await db["education_content"].insert_one(doc)
    doc["id"] = str(result.inserted_id)
    doc.pop("_id", None)
    return doc

async def update_article(db, article_id: str, update_data: dict) -> dict:
    oid = safe_object_id(article_id)
    update_data["updated_at"] = datetime.utcnow()
    updated = await db["education_content"].find_one_and_update(
        {"_id": oid},
        {"$set": update_data},
        return_document=True
    )
    if not updated:
        raise HTTPException(status_code=404, detail="Article not found")
    updated["id"] = str(updated.pop("_id", ""))
    return updated

async def delete_article(db, article_id: str) -> bool:
    oid = safe_object_id(article_id)
    result = await db["education_content"].delete_one({"_id": oid})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Article not found")
    return True


# ─── MYTHS ─────────────────────────────────────────────────────────────────────

async def get_myths(db) -> list:
    cursor = db["myth_facts"].find({}).sort("created_at", -1)
    docs = await cursor.to_list(length=200)
    for d in docs:
        d["id"] = str(d.pop("_id", ""))
    return docs

async def create_myth(db, myth: str, fact: str) -> dict:
    doc = {
        "myth": myth,
        "fact": fact,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
    }
    result = await db["myth_facts"].insert_one(doc)
    doc["id"] = str(result.inserted_id)
    doc.pop("_id", None)
    return doc

async def update_myth(db, myth_id: str, update_data: dict) -> dict:
    oid = safe_object_id(myth_id)
    update_data["updated_at"] = datetime.utcnow()
    updated = await db["myth_facts"].find_one_and_update(
        {"_id": oid},
        {"$set": update_data},
        return_document=True
    )
    if not updated:
        raise HTTPException(status_code=404, detail="Myth not found")
    updated["id"] = str(updated.pop("_id", ""))
    return updated

async def delete_myth(db, myth_id: str) -> bool:
    oid = safe_object_id(myth_id)
    result = await db["myth_facts"].delete_one({"_id": oid})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Myth not found")
    return True


# ─── QUIZZES ───────────────────────────────────────────────────────────────────

async def get_quizzes(db) -> list:
    cursor = db["quizzes"].find({}).sort("created_at", -1)
    docs = await cursor.to_list(length=200)
    for d in docs:
        d["id"] = str(d.pop("_id", ""))
    return docs

async def create_quiz(db, quiz_data: dict) -> dict:
    quiz_data.setdefault("is_published", False)
    quiz_data["created_at"] = datetime.utcnow()
    quiz_data["updated_at"] = datetime.utcnow()
    result = await db["quizzes"].insert_one(quiz_data)
    quiz_data["id"] = str(result.inserted_id)
    quiz_data.pop("_id", None)
    return quiz_data

async def update_quiz(db, quiz_id: str, update_data: dict) -> dict:
    oid = safe_object_id(quiz_id)
    update_data["updated_at"] = datetime.utcnow()
    updated = await db["quizzes"].find_one_and_update(
        {"_id": oid},
        {"$set": update_data},
        return_document=True
    )
    if not updated:
        raise HTTPException(status_code=404, detail="Quiz not found")
    updated["id"] = str(updated.pop("_id", ""))
    return updated

async def delete_quiz(db, quiz_id: str) -> bool:
    oid = safe_object_id(quiz_id)
    result = await db["quizzes"].delete_one({"_id": oid})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Quiz not found")
    return True

async def toggle_publish(db, quiz_id: str) -> dict:
    oid = safe_object_id(quiz_id)
    quiz = await db["quizzes"].find_one({"_id": oid})
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    new_state = not quiz.get("is_published", False)
    updated = await db["quizzes"].find_one_and_update(
        {"_id": oid},
        {"$set": {"is_published": new_state, "updated_at": datetime.utcnow()}},
        return_document=True
    )
    updated["id"] = str(updated.pop("_id", ""))
    return updated


# ─── COMMUNITY ─────────────────────────────────────────────────────────────────

async def get_flagged_posts(db) -> list:
    cursor = db["community_posts"].find({"is_flagged": True}).sort("created_at", -1)
    docs = await cursor.to_list(length=100)
    for d in docs:
        d["id"] = str(d.pop("_id", ""))
    return docs

async def delete_post(db, post_id: str) -> bool:
    oid = safe_object_id(post_id)
    result = await db["community_posts"].delete_one({"_id": oid})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Post not found")
    return True

async def clear_flag(db, post_id: str) -> dict:
    oid = safe_object_id(post_id)
    updated = await db["community_posts"].find_one_and_update(
        {"_id": oid},
        {"$set": {"is_flagged": False, "flagged_by": []}},
        return_document=True
    )
    if not updated:
        raise HTTPException(status_code=404, detail="Post not found")
    updated["id"] = str(updated.pop("_id", ""))
    return updated


# ─── USERS ─────────────────────────────────────────────────────────────────────

async def get_all_users(db, skip: int = 0, limit: int = 50) -> list:
    cursor = db["users"].find({}, {"password_hash": 0}).sort("created_at", -1).skip(skip).limit(limit)
    docs = await cursor.to_list(length=limit)
    for d in docs:
        d["id"] = str(d.pop("_id", ""))
    return docs

async def toggle_user_active(db, user_id: str) -> dict:
    oid = safe_object_id(user_id)
    user = await db["users"].find_one({"_id": oid})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    new_state = not user.get("is_active", True)
    updated = await db["users"].find_one_and_update(
        {"_id": oid},
        {"$set": {"is_active": new_state}},
        return_document=True
    )
    updated.pop("password_hash", None)
    updated["id"] = str(updated.pop("_id", ""))
    return updated
