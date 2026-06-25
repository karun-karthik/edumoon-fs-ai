from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from utils import validate_jwt_token
import os
from dotenv import load_dotenv
from db import database
from bson import ObjectId
from fastapi.encoders import ENCODERS_BY_TYPE
ENCODERS_BY_TYPE[ObjectId] = str

from routers.auth_router import router as auth_router
from routers.user_router import router as user_router
from routers.friend_router import router as friend_router

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "your_srv_connection_url_here")

app = FastAPI(title="Real-time Chat API")

app.include_router(auth_router, prefix="/api/auth", tags=["auth"])
app.include_router(user_router, prefix="/api/users", tags=["users"])
app.include_router(friend_router, prefix="/api/friends", tags=["friends"])


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

EXCLUDED_PATH = {
    "/api/auth/register",
    "/api/auth/login",
    "/docs"
}

@app.middleware("http")
async def auth_middleware(request: Request, call_next):
    if request.method == "OPTIONS":
        return await call_next(request)
    
    if request.url.path in EXCLUDED_PATH:
        return await call_next(request)

    authorization_key = request.headers.get("Authorization")

    if not authorization_key:
        return JSONResponse(
            status_code=401,
            content={
                "status":"error",
                "message":"Authorization header is required."
            }
        )
    
    if not validate_jwt_token(authorization_key):
        return JSONResponse(
            status_code=401,
            content={
                "status":"error",
                "message":"Invalid token."
            }
        )
    
    return await call_next(request)



@app.on_event("startup")
async def startup_event():
    """Connect to MongoDB on startup"""
    await database.connect(MONGO_URI)


@app.on_event("shutdown")
async def shutdown_event():
    """Close MongoDB connection on shutdown"""
    await database.disconnect()



@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "status": "ok"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
