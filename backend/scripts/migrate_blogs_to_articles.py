"""
One-time migration: moves all blog documents into 
education_content collection with field mapping.

Blog fields → Article fields:
  title       → title (same, already Union[dict,str])
  summary     → summary (NEW field on articles)
  content     → content (same)
  category    → category (same)
  author_name → author_name (NEW field on articles)
  tags        → tags (NEW field on articles)
  is_featured → is_featured (NEW field on articles)
  slug        → slug (NEW field on articles)
  is_published→ is_published (same)
  created_at  → created_at (same)
  updated_at  → updated_at (same)

Safe to re-run — checks for existing slug before inserting.
"""
import asyncio
from datetime import datetime
import os
import sys

# Add backend directory to sys.path to resolve imports
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from database import connect_to_mongo, get_db, close_mongo_connection

async def migrate():
    await connect_to_mongo()
    db = get_db()

    blogs = await db["blogs"].find().to_list(None)
    print(f"Found {len(blogs)} blogs to migrate")

    migrated = 0
    skipped = 0

    for blog in blogs:
        # Check if already migrated (by slug)
        slug = blog.get("slug")
        if slug:
            exists = await db["education_content"].find_one({"slug": slug})
            if exists:
                print(f"  Skipping (already exists): {slug}")
                skipped += 1
                continue

        # Map blog fields to article structure
        article = {
            "title": blog.get("title"),
            "content": blog.get("content"),
            "category": blog.get("category", "general"),
            # Add required dummy values for existing required fields in EducationContent
            "target_gender": "all",
            "age_group": "all",
            "media": [blog.get("cover_image_url")] if blog.get("cover_image_url") else [],
            "language": "en",
            "created_by": blog.get("author_name", "Petal Team"),
            "is_published": blog.get("is_published", True),
            "created_at": blog.get("created_at", datetime.utcnow()),
            "updated_at": blog.get("updated_at", datetime.utcnow()),
            # Blog-specific fields being carried over
            "summary": blog.get("summary"),
            "author_name": blog.get("author_name"),
            "tags": blog.get("tags", []),
            "is_featured": blog.get("is_featured", False),
            "slug": blog.get("slug"),
            "source": "migrated_from_blogs",  # audit trail
        }

        await db["education_content"].insert_one(article)
        migrated += 1
        print(f"  Migrated: {blog.get('title', 'untitled')}")

    print(f"\nDone: {migrated} migrated, {skipped} skipped")
    await close_mongo_connection()

if __name__ == "__main__":
    asyncio.run(migrate())
