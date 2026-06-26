from fastapi import APIRouter, HTTPException, Request
from models.chat import GroupChatCreate, ChatResponse, MessageResponse
from db import database
from utils import decode_jwt_token
from typing import List
from datetime import datetime
from uuid import uuid4

router = APIRouter()

def get_current_user_id(request: Request):
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        raise HTTPException(status_code=401, detail="Missing authorization header")
    
    payload = {}
    if auth_header.startswith("Bearer "):
        token = auth_header.split(" ")[1]
        payload = decode_jwt_token(token)
    else:
        raise HTTPException(status_code=401, detail="Invalid authorization header")
    return payload["user_id"]

@router.get("/", response_model=List[ChatResponse])
def get_user_chats(request: Request):
    user_id = get_current_user_id(request)
    chats = list(database.get_collection("chats").find({"participants": user_id}))
    result = []
    for chat in chats:
        result.append({
            "id": chat["chat_id"],
            "is_group": chat.get("is_group", False),
            "name": chat.get("name"),
            "participants": chat.get("participants", []),
            "created_at": chat.get("created_at")
        })
    return result

@router.get("/{chat_id}/messages", response_model=List[MessageResponse])
def get_chat_messages(chat_id: str, request: Request):
    user_id = get_current_user_id(request)

    chats = database.get_collection("chats").find_one({"chat_id": chat_id})
    if not chats:
        raise HTTPException(stats_code=404, details="Chat not found")
    
    messages = list(database.get_collection("messages").find({"chat_id": chat_id}).sort("timestamp", 1))

    return [
        {
            "id": m.get("message_id"),
            "chat_id": m["chat_id"],
            "sender_id": m["sender_id"],
            "content": m["content"],
            "type": m["type"],
            "timestamp": m["timestamp"]
        }
        for m in messages
    ]