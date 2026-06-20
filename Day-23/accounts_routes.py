from fastapi import APIRouter, HTTPException, Header
from typing import List, Dict, Any, Optional
from accounts_repository import AccountsRepository
import jwt
import os
from datetime import datetime

accounts_router = APIRouter(prefix="/accounts", tags=["Accounts APIs"])


def decode_token(authorization: Optional[str]) -> Dict[str, Any]:
    """
    Decode JWT token from Authorization header
    
    Args:
        authorization: Authorization header value (Bearer <token>)
        
    Returns:
        Decoded token payload
        
    Raises:
        HTTPException: If token is invalid or missing
    """
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")
    
    try:
        # Extract token from "Bearer <token>" format
        parts = authorization.split()
        if len(parts) != 2 or parts[0].lower() != "bearer":
            raise HTTPException(status_code=401, detail="Invalid authorization header format")
        
        token = parts[1]
        secret_key = os.getenv("JWT_SECRET", "your-secret-key-change-in-production")
        
        # Decode the token
        payload = jwt.decode(token, secret_key, algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Token validation failed: {str(e)}")


@accounts_router.post("", status_code=201, summary="Create a new account")
def create_account(
    account: Dict[str, Any],
    authorization: Optional[str] = Header(None)
) -> Dict[str, Any]:
    """
    Create a new account for the authenticated user.
    
    Expected account data:
    - name: str (required)
    - type: str (required) - e.g., "Checking Account", "Savings Account", etc.
    - balance: float (required)
    
    Token is extracted from Authorization header (Bearer <token>)
    """
    try:
        # Decode token and get user email
        payload = decode_token(authorization)
        email = payload.get("email")
        user_id = payload.get("user_id")
        
        if not email or not user_id:
            raise HTTPException(status_code=401, detail="Invalid token: missing email or user_id")
        
        # Remove _id if present (let MongoDB generate it)
        account.pop("_id", None)
        
        # Validate required fields
        required_fields = ["name", "type", "balance"]
        missing_fields = [field for field in required_fields if field not in account]
        
        if missing_fields:
            raise HTTPException(
                status_code=400,
                detail=f"Missing required fields: {', '.join(missing_fields)}"
            )
        
        # Validate balance is a number
        try:
            balance = float(account.get("balance"))
            account["balance"] = balance
        except (ValueError, TypeError):
            raise HTTPException(status_code=400, detail="Balance must be a valid number")
        
        # Add userId to account data
        account["userId"] = user_id
        account["createdAt"] = datetime.utcnow().isoformat()
        account["updatedAt"] = datetime.utcnow().isoformat()
        
        # Create account
        created_account = AccountsRepository.create_account(account)
        
        return {
            "status": "success",
            "message": "Account created successfully",
            "account": created_account
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating account: {str(e)}")


@accounts_router.get("", summary="Get all accounts for authenticated user")
def get_user_accounts(authorization: Optional[str] = Header(None)) -> Dict[str, Any]:
    """
    Get all accounts for the authenticated user.
    
    Token is extracted from Authorization header (Bearer <token>)
    """
    try:
        # Decode token and get user ID
        payload = decode_token(authorization)
        user_id = payload.get("user_id")
        
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token: missing user_id")
        
        # Get accounts for the user
        accounts = AccountsRepository.get_accounts_by_user_id(user_id)
        
        return {
            "status": "success",
            "count": len(accounts),
            "accounts": accounts
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving accounts: {str(e)}")


@accounts_router.get("/{account_id}", summary="Get a specific account by ID")
def get_account(
    account_id: str,
    authorization: Optional[str] = Header(None)
) -> Dict[str, Any]:
    """
    Get a specific account by ID (must belong to authenticated user).
    
    Token is extracted from Authorization header (Bearer <token>)
    """
    try:
        # Decode token and get user ID
        payload = decode_token(authorization)
        user_id = payload.get("user_id")
        
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token: missing user_id")
        
        # Get account
        account = AccountsRepository.get_account_by_id(account_id)
        
        if not account:
            raise HTTPException(status_code=404, detail=f"Account with id {account_id} not found")
        
        # Verify account belongs to the user
        if account.get("userId") != user_id:
            raise HTTPException(status_code=403, detail="Unauthorized: account does not belong to user")
        
        return {
            "status": "success",
            "account": account
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving account: {str(e)}")


@accounts_router.put("/{account_id}", summary="Update an account by ID")
def update_account(
    account_id: str,
    update_data: Dict[str, Any],
    authorization: Optional[str] = Header(None)
) -> Dict[str, Any]:
    """
    Update an account by ID (must belong to authenticated user).
    
    Can update:
    - name: str
    - type: str
    - balance: float
    
    Token is extracted from Authorization header (Bearer <token>)
    """
    try:
        # Decode token and get user ID
        payload = decode_token(authorization)
        user_id = payload.get("user_id")
        
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token: missing user_id")
        
        # Get account to verify ownership
        account = AccountsRepository.get_account_by_id(account_id)
        
        if not account:
            raise HTTPException(status_code=404, detail=f"Account with id {account_id} not found")
        
        # Verify account belongs to the user
        if account.get("userId") != user_id:
            raise HTTPException(status_code=403, detail="Unauthorized: account does not belong to user")
        
        # Remove _id if present (never update MongoDB's _id)
        update_data.pop("_id", None)
        
        # Validate balance if provided
        if "balance" in update_data:
            try:
                balance = float(update_data.get("balance"))
                update_data["balance"] = balance
            except (ValueError, TypeError):
                raise HTTPException(status_code=400, detail="Balance must be a valid number")
        
        # Add updatedAt timestamp
        update_data["updatedAt"] = datetime.utcnow().isoformat()
        
        # Update account
        updated_account = AccountsRepository.update_account(account_id, update_data)
        
        if not updated_account:
            raise HTTPException(status_code=404, detail=f"Account with id {account_id} not found")
        
        return {
            "status": "success",
            "message": "Account updated successfully",
            "account": updated_account
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating account: {str(e)}")


@accounts_router.delete("/{account_id}", summary="Delete an account by ID")
def delete_account(
    account_id: str,
    authorization: Optional[str] = Header(None)
) -> Dict[str, Any]:
    """
    Delete an account by ID (must belong to authenticated user).
    
    Token is extracted from Authorization header (Bearer <token>)
    """
    try:
        # Decode token and get user ID
        payload = decode_token(authorization)
        user_id = payload.get("user_id")
        
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token: missing user_id")
        
        # Get account to verify ownership
        account = AccountsRepository.get_account_by_id(account_id)
        
        if not account:
            raise HTTPException(status_code=404, detail=f"Account with id {account_id} not found")
        
        # Verify account belongs to the user
        if account.get("userId") != user_id:
            raise HTTPException(status_code=403, detail="Unauthorized: account does not belong to user")
        
        # Delete account
        deleted = AccountsRepository.delete_account(account_id)
        
        if not deleted:
            raise HTTPException(status_code=500, detail="Failed to delete account")
        
        return {
            "status": "success",
            "message": f"Account {account_id} deleted successfully"
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting account: {str(e)}")


@accounts_router.get("/user/{user_id}/summary", summary="Get account summary for a user")
def get_account_summary(
    user_id: str,
    authorization: Optional[str] = Header(None)
) -> Dict[str, Any]:
    """
    Get account summary for a user (total balance, account count).
    Only accessible to the authenticated user or admin.
    
    Token is extracted from Authorization header (Bearer <token>)
    """
    try:
        # Decode token and verify user ID matches
        payload = decode_token(authorization)
        auth_user_id = payload.get("user_id")
        
        if not auth_user_id:
            raise HTTPException(status_code=401, detail="Invalid token: missing user_id")
        
        # Verify requesting user can access this user's data
        if auth_user_id != user_id:
            raise HTTPException(status_code=403, detail="Unauthorized: cannot access other user's accounts")
        
        # Get all accounts for the user
        accounts = AccountsRepository.get_accounts_by_user_id(user_id)
        
        # Calculate summary
        total_balance = sum(account.get("balance", 0) for account in accounts)
        account_count = len(accounts)
        
        return {
            "status": "success",
            "summary": {
                "totalBalance": total_balance,
                "accountCount": account_count,
                "accounts": accounts
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving account summary: {str(e)}")
