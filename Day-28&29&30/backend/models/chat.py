from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class GroupChatCreate(BaseModel):
    name: str
    participant_ids: List[str]

class ChatResponse(BaseModel):
    id: str
    is_group: bool
    name: Optional[str] = None
    participants: List
    created_at: datetime

class MessageCreate(BaseModel):
    chat_id: str
    content: str

class MessageResponse(BaseModel):
    id: str
    chat_id: str
    sender_id: str
    content: str
    type: str
    timestamp: datetime
