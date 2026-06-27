from fastapi import FastAPI, HTTPException, Request, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from utils import validate_jwt_token, decode_jwt_token
import os
from dotenv import load_dotenv
from db import database
from bson import ObjectId
from fastapi.encoders import ENCODERS_BY_TYPE
ENCODERS_BY_TYPE[ObjectId] = str
import json
from datetime import datetime
from uuid import uuid4

from routers.auth_router import router as auth_router
from routers.user_router import router as user_router
from routers.friend_router import router as friend_router
from routers.chat_router import router as chat_router

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "your_srv_connection_url_here")

app = FastAPI(title="Real-time Chat API")

app.include_router(auth_router, prefix="/api/auth", tags=["auth"])
app.include_router(user_router, prefix="/api/users", tags=["users"])
app.include_router(friend_router, prefix="/api/friends", tags=["friends"])
app.include_router(chat_router, prefix="/api/chats", tags=["chats"])

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
    "/docs",
    "/"
}

@app.middleware("http")
async def auth_middleware(request: Request, call_next):
    if request.method == "OPTIONS":
        return await call_next(request)
    
    if request.url.path in EXCLUDED_PATH or request.url.path.startswith("/ws/"):
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

class ConnectionManager:
    def __init__(self):
        # Maps user_id string to a list of WebSocket connections
        self.active_connections: dict[str, list[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, user_id: str):
        await websocket.accept()
        if user_id not in self.active_connections:
            self.active_connections[user_id] = []
        self.active_connections[user_id].append(websocket)
        print(f"User {user_id} connected. Total connections: {len(self.active_connections[user_id])}")

    def disconnect(self, websocket: WebSocket, user_id: str):
        if user_id in self.active_connections:
            try:
                self.active_connections[user_id].remove(websocket)
                print(f"User {user_id} disconnected. Remaining: {len(self.active_connections[user_id])}")
                if not self.active_connections[user_id]:
                    del self.active_connections[user_id]
            except ValueError:
                pass

    async def send_message(self, message: dict, user_id: str):
        print(f"Sending message to {user_id}: {message}")
        if user_id in self.active_connections:
            print(f"User {user_id} is online. Broadcasting to {len(self.active_connections[user_id])} connections.")
            disconnected = []
            for connection in self.active_connections[user_id]:
                try:
                    await connection.send_text(json.dumps(message))
                except Exception:
                    disconnected.append(connection)
            for conn in disconnected:
                self.disconnect(conn, user_id)

manager = ConnectionManager()

@app.websocket("/ws/chat")
async def websocket_endpoint(websocket: WebSocket):
    token = websocket.query_params.get("token")
    if not validate_jwt_token(token):
        await websocket.close(code=1008)
        return
        
    payload = decode_jwt_token(token)
    user_id = payload["user_id"]
    await manager.connect(websocket, user_id)
    
    try:
        while True:
            data = await websocket.receive_text()
            payload = json.loads(data)
            
            chat_id = payload.get("chat_id")
            content = payload.get("content")
            
            if not chat_id or not content:
                continue
                
            chat = database.get_collection("chats").find_one({"chat_id": chat_id, "participants": user_id})
            if not chat:
                continue
                
            message_id = str(uuid4())
            new_message = {
                "message_id": message_id,
                "chat_id": chat_id,
                "sender_id": user_id,
                "content": content,
                "type": "text",
                "timestamp": datetime.utcnow()
            }
            database.get_collection("messages").insert_one(new_message)
            
            # Broadcast to all participants
            broadcast_msg = {
                "event": "new_message",
                "message": {
                    "id": message_id,
                    "chat_id": chat_id,
                    "sender_id": user_id,
                    "content": content,
                    "type": "text",
                    "timestamp": new_message["timestamp"].isoformat()
                }
            }
            
            for participant_id in chat["participants"]:
                await manager.send_message(broadcast_msg, participant_id)
                
    except WebSocketDisconnect:
        manager.disconnect(websocket, user_id)

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
