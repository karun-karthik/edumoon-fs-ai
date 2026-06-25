from pydantic import BaseModel
from typing import Optional, List

class User(BaseModel):
    user_id: Optional[str] = None
    username: str
    password: str
    friends: Optional[List[str]] = []
    sent_requests: Optional[List[str]] = []
    received_requests: Optional[List[str]] = []

class UserLogin(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    id: str
    username: str
    friends: List[str]
    sent_requests:  List[str]
    received_requests:  List[str]