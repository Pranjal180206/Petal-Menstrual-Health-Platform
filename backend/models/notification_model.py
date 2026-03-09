from pydantic import BaseModel, Field
from datetime import datetime
from bson import ObjectId
from database import PyObjectId


class Notification(BaseModel):

    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")

    user_id: PyObjectId

    type: str

    message: str

    is_read: bool = False

    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}