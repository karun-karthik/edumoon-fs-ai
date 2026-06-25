from fastapi import APIRouter, HTTPException, Request
from models.user import UserResponse
from db import database
from utils import decode_jwt_token

router = APIRouter()

@router.get("/me", response_model=UserResponse)
def read_users(request: Request):
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        raise HTTPException(status_code=401, detail="Missing authorization header")
    
    payload = {}
    if auth_header.startswith("Bearer "):
        token = auth_header.split(" ")[1]
        payload = decode_jwt_token(token)
    else:
        raise HTTPException(status_code=401, detail="Invalid authorization header")

    user = database.get_collection("users").find_one({"user_id": payload["user_id"]})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "id": user["user_id"],
        "username": user["username"],
        "friends": user.get("friends", []),
        "sent_requests": user.get("sent_requests", []),
        "received_requests": user.get("received_requests", [])
    }

@router.get("/search")
def search_user(q: str, request: Request):
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        raise HTTPException(status_code=401, detail="Missing authorization header")
    
    payload = {}
    if auth_header.startswith("Bearer "):
        token = auth_header.split(" ")[1]
        payload = decode_jwt_token(token)
    else:
        raise HTTPException(status_code=401, detail="Invalid authorization header")
    
    users = list(database.get_collection("users").find({
        "user_id": {"$ne": payload["user_id"]},
        "username": {"$regex": q, "$options": "i"}
    }, {"_id": 0, "password": 0}))

    return [{"id": str(user["user_id"]), "username": user["username"]} for user in users]