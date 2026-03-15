from pydantic import BaseModel, Field
from datetime import datetime
from bson import ObjectId
from database import PyObjectId


class CommunityReply(BaseModel):

    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")

    post_id: PyObjectId

    anonymous_user_id: str

    content: str

    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}