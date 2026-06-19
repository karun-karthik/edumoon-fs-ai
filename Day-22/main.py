from fastapi import FastAPI, HTTPException
from pymongo import MongoClient
from pymongo.errors import ServerSelectionTimeoutError, ConnectionFailure
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI()

# MongoDB Atlas connection
MONGO_URI = os.getenv("MONGO_URI", "your_srv_connection_url_here")

# Global MongoDB client and database
client = None
db = None

@app.on_event("startup")
async def startup_event():
    """Connect to MongoDB on startup"""
    global client, db
    try:
        client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
        # Verify connection
        client.admin.command('ping')
        db = client.get_database()
        print("✓ Connected to MongoDB Atlas successfully")
    except (ServerSelectionTimeoutError, ConnectionFailure) as e:
        print(f"✗ Failed to connect to MongoDB Atlas: {e}")
        raise

@app.on_event("shutdown")
async def shutdown_event():
    """Close MongoDB connection on shutdown"""
    global client
    if client:
        client.close()
        print("✓ MongoDB connection closed")

@app.get("/collections")
async def get_collections():
    """
    Get list of all collections in the current database
    
    Returns:
        dict: Contains list of collection names and metadata
    """
    try:
        if client is None or db is None:
            raise HTTPException(status_code=500, detail="Database connection not established")
        
        # Get list of collection names
        collections = db.list_collection_names()
        
        return {
            "status": "success",
            "database": db.name,
            "collections": collections,
            "count": len(collections)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching collections: {str(e)}")

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    try:
        if client is not None:
            client.admin.command('ping')
            return {
                "status": "healthy",
                "database": db.name if db is not None else None
            }
        else:
            return {"status": "unhealthy", "reason": "Database not connected"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Health check failed: {str(e)}")

@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "message": "MongoDB Atlas API",
        "endpoints": {
            "GET /collections": "Get list of all collections in the database",
            "GET /health": "Health check endpoint"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
