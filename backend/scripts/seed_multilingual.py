"""
Seed multilingual (hi, mr) content into existing documents
and then verify the admin API and public API responses.
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

load_dotenv()

VIDEO_MULTILINGUAL = {
    "title": {
        "en": "Understanding Your Menstrual Cycle",
        "hi": "अपने मासिक चक्र को समझें",
        "mr": "आपला मासिक पाळीचा चक्र समजून घ्या"
    },
    "description": {
        "en": "Learn about the four phases of your cycle.",
        "hi": "अपने चक्र के चार चरणों के बारे में जानें।",
        "mr": "आपल्या चक्राच्या चार टप्प्यांबद्दल जाणून घ्या."
    }
}

MYTH_MULTILINGUAL = {
    "myth": {
        "en": "You should not exercise during your period.",
        "hi": "मासिक धर्म के दौरान व्यायाम नहीं करना चाहिए।",
        "mr": "मासिक पाळी दरम्यान व्यायाम करू नये."
    },
    "fact": {
        "en": "Light exercise can actually reduce cramps.",
        "hi": "हल्का व्यायाम वास्तव में ऐंठन को कम कर सकता है।",
        "mr": "हलका व्यायाम प्रत्यक्षात पेटके कमी करू शकतो."
    }
}

BLOG_MULTILINGUAL = {
    "title": {
        "en": "Nutrition Tips for Menstrual Health",
        "hi": "मासिक स्वास्थ्य के लिए पोषण संबंधी सुझाव",
        "mr": "मासिक आरोग्यासाठी पोषण टिप्स"
    },
    "summary": {
        "en": "What to eat during your cycle for better health.",
        "hi": "बेहतर स्वास्थ्य के लिए अपने चक्र के दौरान क्या खाएं।",
        "mr": "चांगल्या आरोग्यासाठी आपल्या चक्रादरम्यान काय खावे."
    }
}

async def seed():
    uri = os.getenv("MONGO_URI")
    client = AsyncIOMotorClient(uri)
    db = client["menstrual_health_db"]

    # ── Seed video ──────────────────────────────────────────
    video = await db["education_videos"].find_one({})
    if video:
        await db["education_videos"].update_one(
            {"_id": video["_id"]},
            {"$set": VIDEO_MULTILINGUAL}
        )
        vid_id = str(video["_id"])
        print(f"VIDEO seeded: {vid_id}")
        # Verify raw admin view
        v = await db["education_videos"].find_one({"_id": video["_id"]})
        print(f"  title in DB: {v['title']}")
    else:
        print("No videos found to seed")

    # ── Seed myth ───────────────────────────────────────────
    myth = await db["myth_facts"].find_one({})
    if myth:
        await db["myth_facts"].update_one(
            {"_id": myth["_id"]},
            {"$set": MYTH_MULTILINGUAL}
        )
        myth_id = str(myth["_id"])
        print(f"MYTH seeded: {myth_id}")
        m = await db["myth_facts"].find_one({"_id": myth["_id"]})
        print(f"  myth in DB: {m['myth']}")
    else:
        print("No myths found to seed")

    # ── Seed blog ───────────────────────────────────────────
    blog = await db["blogs"].find_one({})
    if blog:
        await db["blogs"].update_one(
            {"_id": blog["_id"]},
            {"$set": BLOG_MULTILINGUAL}
        )
        blog_id = str(blog["_id"])
        print(f"BLOG seeded: {blog_id}")
        b = await db["blogs"].find_one({"_id": blog["_id"]})
        print(f"  title in DB: {b['title']}")
    else:
        print("No blogs found to seed")

    client.close()
    print("\nSeeding complete.")

asyncio.run(seed())
