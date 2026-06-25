from fastapi import APIRouter, HTTPException
from models.user import User, UserLogin
from db import database
from utils import get_hashed_password, check_password, create_jwt_token
from uuid import uuid4

router = APIRouter()

@router.post("/register", response_model = dict)
async def create_user(user: User):
    existing_user = database.get_collection("users").count_documents({"username": user.username}) > 0
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")
    user.password = get_hashed_password(user.password)
    user.user_id = str(uuid4())

    new_user = {
        "user_id": user.user_id,
        "username": user.username,
        "password": user.password,
        "friends": [],
        "sent_requests": [],
        "received_requests": []
    }

    database.get_collection("users").insert_one(new_user)
    
    return {
        "status": "success",
        "message": "User registered successfully",
        "data": {
            "id": user.user_id,
            "username": user.username
        }
    }

@router.post("/login", response_model=dict)
async def login_user(payload: UserLogin):
    user = database.get_collection("users").find_one({"username": payload.username})
    if not user:
        raise HTTPException(status_code=404, detail="User not found! Please register!")
    if not check_password(user["password"], payload.password):
        raise HTTPException(status_code=401, detail="Unauthorized! Invalid password")
    
    token = create_jwt_token({"username": user["username"], "user_id": user["user_id"]})
    
    return {
        "status": "success",
        "message": "Login successful!",
        "access_token": token,
        "token_type": "bearer",
        "data": {
            "id": user["user_id"],
            "username": user["username"]
        }
    }
