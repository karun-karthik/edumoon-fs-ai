from pydantic import BaseModel
from typing import Optional
from pydantic_mongo import PydanticObjectId

class User(BaseModel):
    user_id: Optional[str] = None
    name: str
    email: str
    password: str
    bio: str = None
    _id: Optional[PydanticObjectId] = None

class UserLogin(BaseModel):
    email: str
    password: str