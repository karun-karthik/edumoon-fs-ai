from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
from db import database
from routes.user_router import router
from bson import ObjectId
from fastapi.encoders import ENCODERS_BY_TYPE
ENCODERS_BY_TYPE[ObjectId] = str

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "your_srv_connection_url_here")

app = FastAPI()
app.include_router(router, prefix="/api/users", tags=["users"])
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


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
