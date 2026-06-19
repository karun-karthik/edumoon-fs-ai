from fastapi import FastAPI, HTTPException
import os
from dotenv import load_dotenv
from user_routes import user_router
from db import database

# Load environment variables
load_dotenv()

# MongoDB Atlas connection URL
MONGO_URI = os.getenv("MONGO_URI", "your_srv_connection_url_here")

app = FastAPI()
app.include_router(user_router)


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
        "message": "MongoDB Atlas API",
        "endpoints": {
            "GET /collections": "Get list of all collections in the database",
            "GET /health": "Health check endpoint",
            "POST /user/sign-up": "Create a new user"
        }
    }


@app.get("/collections")
async def get_collections():
    """
    Get list of all collections in the current database
    
    Returns:
        dict: Contains list of collection names and metadata
    """
    try:
        db = database.get_database()
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
        if database.client is not None:
            database.client.admin.command('ping')
            db = database.get_database()
            return {
                "status": "healthy",
                "database": db.name
            }
        else:
            return {"status": "unhealthy", "reason": "Database not connected"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Health check failed: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
