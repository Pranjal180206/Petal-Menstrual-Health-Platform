from fastapi import APIRouter

router = APIRouter()

@router.get("/articles")
async def get_articles():
    return [{"id": "1", "title": "Understanding your cycle", "content": "..."}]

@router.get("/myth-facts")
async def get_myth_facts(lang: str = "en"):
    if lang == "hi":
        return [{"id": "1", "myth": "आप मासिक धर्म के दौरान व्यायाम नहीं कर सकतीं", "fact": "व्यायाम वास्तव में ऐंठन से राहत दिला सकता है।"}]
    
    return [{"id": "1", "myth": "You cannot exercise on your period", "fact": "Exercise can actually relieve cramps."}]
