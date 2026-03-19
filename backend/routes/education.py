from fastapi import APIRouter, Depends
from database import get_db
import services.education_service as education_service

router = APIRouter()

@router.get("/articles")
async def get_articles(db=Depends(get_db)):
    return await education_service.get_articles(db)

@router.get("/myth-facts")
async def get_myth_facts(lang: str = "en", db=Depends(get_db)):
    return await education_service.get_myth_facts(db)
