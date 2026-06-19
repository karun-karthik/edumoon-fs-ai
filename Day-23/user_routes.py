from fastapi import APIRouter, HTTPException, Query
from typing import List, Dict, Any
from user_repository import UserRepository
import bcrypt
import jwt
import os
from datetime import datetime, timedelta

user_router = APIRouter(prefix="/user", tags=["User APIs"])


@user_router.post("/sign-up", status_code=201, summary="Create a new user")
def create_user(user: Dict[str, Any]) -> Dict[str, Any]:
    """
    Create a new user.
    
    Expected user data:
    - email: str (required)
    - name: str (required)
    - password: str (required)
    """
    try:
        # Check if user already exists
        if UserRepository.user_exists(user.get("email")):
            raise HTTPException(status_code=400, detail="User with this email already exists")
        
        password = user.get("password")
        password_bytes = password.encode('utf-8')
        hashed_password = bcrypt.hashpw(password_bytes, bcrypt.gensalt())
        
        # Store hashed password as string (MongoDB can't store bytes directly)
        user["password"] = hashed_password.decode('utf-8')
        
        # Create user
        created_user = UserRepository.create_user(user)
        return {
            "status": "success",
            "message": "User created successfully",
            "user": created_user
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating user: {str(e)}")


@user_router.post("/login", status_code=200, summary="Login into the system")
def login_user(user: Dict[str, Any]) -> Dict[str, Any]:
    """
    Login the new user.
    
    Expected user data:
    - email: str (required)
    - password: str (required)
    """
    try:
        # Check if user doesn't exists
        if not UserRepository.user_exists(user.get("email")):
            raise HTTPException(status_code=400, detail="User with this email doesn't exists")
        
        existing_user = UserRepository.get_user_by_email(user.get("email"))
        password = user.get("password")
        password_bytes = password.encode('utf-8')
        
        # Stored hash is a string, convert to bytes directly
        stored_hash = existing_user.get("password").encode('utf-8') if isinstance(existing_user.get("password"), str) else existing_user.get("password")

        if bcrypt.checkpw(password_bytes, stored_hash):
            # Generate JWT token
            payload = {
                "email": user.get("email"),
                "user_id": existing_user.get("_id"),
                "iat": datetime.utcnow(),
                "exp": datetime.utcnow() + timedelta(hours=24)
            }
            secret_key = os.getenv("JWT_SECRET", "your-secret-key-change-in-production")
            token = jwt.encode(payload, secret_key, algorithm="HS256")

            return {
                "status": "success",
                "message": "Login successful",
                "token": token
            }
        else:
            raise HTTPException(status_code=401, detail="Unauthorized! Invalid password")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error login user: {str(e)}")


@user_router.get("/{user_id}", summary="Get a specific user by ID")
def get_user(user_id: str) -> Dict[str, Any]:
    """Get a specific user by their ID."""
    try:
        user = UserRepository.get_user_by_id(user_id)
        if not user:
            raise HTTPException(status_code=404, detail=f"User with id {user_id} not found")
        return {
            "status": "success",
            "user": user
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving user: {str(e)}")


@user_router.get("/email/{email}", summary="Get a user by email")
def get_user_by_email(email: str) -> Dict[str, Any]:
    """Get a user by their email address."""
    try:
        user = UserRepository.get_user_by_email(email)
        if not user:
            raise HTTPException(status_code=404, detail=f"User with email {email} not found")
        return {
            "status": "success",
            "user": user
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving user: {str(e)}")


@user_router.get("", summary="Get all users")
def get_all_users() -> Dict[str, Any]:
    """Get all users in the database."""
    try:
        users = UserRepository.get_all_users()
        return {
            "status": "success",
            "count": len(users),
            "users": users
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving users: {str(e)}")


@user_router.put("/{user_id}", summary="Update a user by ID")
def update_user(user_id: str, update_data: Dict[str, Any]) -> Dict[str, Any]:
    """Update an existing user."""
    try:
        updated_user = UserRepository.update_user(user_id, update_data)
        if not updated_user:
            raise HTTPException(status_code=404, detail=f"User with id {user_id} not found")
        return {
            "status": "success",
            "message": "User updated successfully",
            "user": updated_user
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating user: {str(e)}")


@user_router.delete("/{user_id}", summary="Delete a user by ID")
def delete_user(user_id: str) -> Dict[str, Any]:
    """Delete a user by their ID."""
    try:
        deleted = UserRepository.delete_user(user_id)
        if not deleted:
            raise HTTPException(status_code=404, detail=f"User with id {user_id} not found")
        return {
            "status": "success",
            "message": f"User {user_id} deleted successfully"
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting user: {str(e)}")
