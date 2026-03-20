from fastapi import APIRouter, Depends
from typing import Optional
from pydantic import BaseModel
from database import get_db
from services.auth_service import get_admin_user
from services import admin_service

router = APIRouter()


class MythCreate(BaseModel):
    myth: str
    fact: str


class MythUpdate(BaseModel):
    myth: Optional[str] = None
    fact: Optional[str] = None


@router.get("/myths")
async def list_myths(db=Depends(get_db), _=Depends(get_admin_user)):
    return await admin_service.get_myths(db)


@router.post("/myths", status_code=201)
async def create_myth(body: MythCreate, db=Depends(get_db), _=Depends(get_admin_user)):
    return await admin_service.create_myth(db, body.myth, body.fact)


@router.patch("/myths/{myth_id}")
async def update_myth(myth_id: str, body: MythUpdate, db=Depends(get_db), _=Depends(get_admin_user)):
    return await admin_service.update_myth(db, myth_id, body.model_dump(exclude_unset=True))


@router.delete("/myths/{myth_id}")
async def delete_myth(myth_id: str, db=Depends(get_db), _=Depends(get_admin_user)):
    await admin_service.delete_myth(db, myth_id)
    return {"deleted": True}
