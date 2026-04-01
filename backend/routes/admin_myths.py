from fastapi import APIRouter, Depends, Request
from typing import Optional, Union
from pydantic import BaseModel, Field
from database import get_db
from services.auth_service import get_admin_user
from services import admin_service
from config import limiter

router = APIRouter()


class MythCreate(BaseModel):
    myth: Union[dict, str] = Field(..., min_length=1, max_length=1000)
    fact: Union[dict, str] = Field(..., min_length=1, max_length=1000)


class MythUpdate(BaseModel):
    myth: Optional[Union[dict, str]] = Field(None, max_length=1000)
    fact: Optional[Union[dict, str]] = Field(None, max_length=1000)


@router.get("/myths")
@limiter.limit("30/minute")
async def list_myths(request: Request, db=Depends(get_db), _=Depends(get_admin_user)):
    return await admin_service.get_myths(db)


@router.post("/myths", status_code=201)
@limiter.limit("30/minute")
async def create_myth(request: Request, body: MythCreate, db=Depends(get_db), _=Depends(get_admin_user)):
    return await admin_service.create_myth(db, body.model_dump(exclude_unset=True))


@router.patch("/myths/{myth_id}")
@limiter.limit("30/minute")
async def update_myth(request: Request, myth_id: str, body: MythUpdate, db=Depends(get_db), _=Depends(get_admin_user)):
    return await admin_service.update_myth(db, myth_id, body.model_dump(exclude_unset=True))


@router.delete("/myths/{myth_id}")
@limiter.limit("30/minute")
async def delete_myth(request: Request, myth_id: str, db=Depends(get_db), _=Depends(get_admin_user)):
    await admin_service.delete_myth(db, myth_id)
    return {"deleted": True}
