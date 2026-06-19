# Accounts API Guide

## Overview

The Accounts API provides full CRUD operations for managing user accounts in the finance management system. All endpoints require JWT authentication via the Authorization header.

## Files Created

1. **accounts_repository.py** - Data access layer for accounts
2. **accounts_routes.py** - API endpoints for accounts

## Account Data Model

```python
{
    "_id": "string (MongoDB ObjectId)",
    "name": "string (required)",
    "type": "string (required) - e.g., 'Checking Account', 'Savings Account'",
    "balance": "number (required)",
    "userId": "string (required) - User ID from JWT token",
    "createdAt": "ISO timestamp",
    "updatedAt": "ISO timestamp"
}
```

## API Endpoints

### 1. Create Account
**POST** `/accounts`

Creates a new account for the authenticated user.

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
    "name": "My Checking Account",
    "type": "Checking Account",
    "balance": 1500.00
}
```

**Response (201):**
```json
{
    "status": "success",
    "message": "Account created successfully",
    "account": {
        "_id": "507f1f77bcf86cd799439011",
        "name": "My Checking Account",
        "type": "Checking Account",
        "balance": 1500.00,
        "userId": "user_id_from_token",
        "createdAt": "2026-06-19T...",
        "updatedAt": "2026-06-19T..."
    }
}
```

---

### 2. Get All User Accounts
**GET** `/accounts`

Retrieves all accounts for the authenticated user.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
    "status": "success",
    "count": 2,
    "accounts": [
        {
            "_id": "507f1f77bcf86cd799439011",
            "name": "My Checking Account",
            "type": "Checking Account",
            "balance": 1500.00,
            "userId": "user_id",
            "createdAt": "2026-06-19T...",
            "updatedAt": "2026-06-19T..."
        }
    ]
}
```

---

### 3. Get Account by ID
**GET** `/accounts/{account_id}`

Retrieves a specific account (must belong to authenticated user).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
    "status": "success",
    "account": {
        "_id": "507f1f77bcf86cd799439011",
        "name": "My Checking Account",
        "type": "Checking Account",
        "balance": 1500.00,
        "userId": "user_id",
        "createdAt": "2026-06-19T...",
        "updatedAt": "2026-06-19T..."
    }
}
```

---

### 4. Update Account
**PUT** `/accounts/{account_id}`

Updates an account (must belong to authenticated user).

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body (all fields optional):**
```json
{
    "name": "Updated Account Name",
    "type": "Savings Account",
    "balance": 2500.00
}
```

**Response (200):**
```json
{
    "status": "success",
    "message": "Account updated successfully",
    "account": {
        "_id": "507f1f77bcf86cd799439011",
        "name": "Updated Account Name",
        "type": "Savings Account",
        "balance": 2500.00,
        "userId": "user_id",
        "createdAt": "2026-06-19T...",
        "updatedAt": "2026-06-19T..."
    }
}
```

---

### 5. Delete Account
**DELETE** `/accounts/{account_id}`

Deletes an account (must belong to authenticated user).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
    "status": "success",
    "message": "Account 507f1f77bcf86cd799439011 deleted successfully"
}
```

---

### 6. Get Account Summary
**GET** `/accounts/user/{user_id}/summary`

Gets account summary for a user (total balance and account count).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
    "status": "success",
    "summary": {
        "totalBalance": 4000.00,
        "accountCount": 2,
        "accounts": [
            {
                "_id": "507f1f77bcf86cd799439011",
                "name": "My Checking Account",
                "type": "Checking Account",
                "balance": 1500.00,
                "userId": "user_id",
                "createdAt": "2026-06-19T...",
                "updatedAt": "2026-06-19T..."
            }
        ]
    }
}
```

---

## Authentication

All endpoints require JWT token authentication. The token is passed via the `Authorization` header in the format:

```
Authorization: Bearer <token>
```

The token is decoded to extract:
- `email` - User's email address
- `user_id` - MongoDB user ID
- `iat` - Token issued at timestamp
- `exp` - Token expiration timestamp

### Error Responses

**401 Unauthorized:**
```json
{
    "detail": "Authorization header missing"
}
```

**403 Forbidden:**
```json
{
    "detail": "Unauthorized: account does not belong to user"
}
```

**404 Not Found:**
```json
{
    "detail": "Account with id {account_id} not found"
}
```

**400 Bad Request:**
```json
{
    "detail": "Missing required fields: balance"
}
```

---

## Integration with Main Application

To integrate these routes into your FastAPI application:

```python
from fastapi import FastAPI
from accounts_routes import accounts_router
from user_routes import user_router

app = FastAPI()

# Register routers
app.include_router(accounts_router)
app.include_router(user_router)
```

---

## Key Features

1. **Authentication**: All endpoints require valid JWT token
2. **User Isolation**: Users can only access their own accounts
3. **Timestamps**: Automatic `createdAt` and `updatedAt` tracking
4. **Input Validation**: Required fields and balance validation
5. **Error Handling**: Comprehensive error responses
6. **Summary Endpoint**: Quick access to total balance and account count

---

## Usage Example (Python)

```python
import requests
import json

BASE_URL = "http://localhost:8000"
TOKEN = "your_jwt_token_here"

headers = {
    "Authorization": f"Bearer {TOKEN}",
    "Content-Type": "application/json"
}

# Create account
account_data = {
    "name": "My Savings Account",
    "type": "Savings Account",
    "balance": 5000.00
}

response = requests.post(
    f"{BASE_URL}/accounts",
    json=account_data,
    headers=headers
)

print(response.json())

# Get all accounts
response = requests.get(
    f"{BASE_URL}/accounts",
    headers=headers
)

print(response.json())
```

---

## Database Schema

Accounts are stored in MongoDB with the following indexes recommended:

```python
# Create indexes for better query performance
db.accounts.create_index([("userId", 1)])
db.accounts.create_index([("createdAt", -1)])
db.accounts.create_index([("userId", 1), ("_id", 1)])
```
