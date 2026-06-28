from fastapi import APIRouter, HTTPException, Request
from db import database
from utils import decode_jwt_token
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

@router.post("/request/{target_id}")
def send_friend_request(target_id: str, request: Request):
    user_id = get_current_user_id(request)

    target_user = database.get_collection("users").find_one({"user_id": target_id})
    if not target_user:
        raise HTTPException(status_code=404, detail="User not found")

    current_user = database.get_collection("users").find_one({"user_id": user_id})

    if target_id in current_user.get("friends", []):
        raise HTTPException(status_code=400, detail="Already friends")
    
    database.get_collection("users").update_one(
        {"user_id": user_id},
        {"$addToSet": {"sent_requests": target_id}}
    )
    database.get_collection("users").update_one(
        {"user_id": target_id},
        {"$addToSet": {"received_requests": user_id}}
    )
    return {
        "status": "success",
        "message": "Friend request sent"
    }

@router.post("/accept/{requester_id}")
def accept_friend_request(requester_id: str, request: Request):
    user_id = get_current_user_id(request)
    current_user = database.get_collection("users").find_one({"user_id": user_id})

    if requester_id not in current_user.get("received_requests", []):
        raise HTTPException(status_code=400, detail="No pending requests from this user")
    
    database.get_collection("users").update_one(
        {"user_id": user_id},
        {
            "$addToSet": {"friends": requester_id},
            "$pull": {"received_requests": requester_id}
        }
    )

    database.get_collection("users").update_one(
        {"user_id": requester_id},
        {
            "$addToSet": {"friends": user_id},
            "$pull": {"sent_requests": user_id}
        }
    )

    chat_id = str(uuid4())

    chat = {
        "chat_id": chat_id,
        "is_group": False,
        "participants": [user_id, requester_id],
        "created_at": datetime.utcnow()
    }

    database.get_collection("chats").insert_one(chat)

    return {
        "status": "success",
        "message": "Friend request accepted"
    }

@router.post("/reject/{requester_id}")
def reject_friend_request(requester_id: str, request: Request):
    user_id = get_current_user_id(request)
    current_user = database.get_collection("users").find_one({"user_id": user_id})

    if requester_id not in current_user.get("received_requests", []):
        raise HTTPException(status_code=400, detail="No pending requests from this user")
    
    database.get_collection("users").update_one(
        {"user_id": user_id},
        {"$pull": {"received_requests": requester_id}}
    )

    database.get_collection("users").update_one(
        {"user_id": requester_id},
        {"$pull": {"sent_requests": user_id}}
    )

    return {
        "status": "success",
        "message": "Friend request rejected"
    }