# MongoDB Atlas FastAPI Integration

A simple FastAPI application that connects to MongoDB Atlas using an SRV connection URL and provides endpoints to list collections.

## Setup

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Configure MongoDB Connection
Create a `.env` file in the project root:
```bash
cp .env.example .env
```

Edit `.env` and add your MongoDB Atlas SRV connection URL:
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
```

You can find your SRV connection URL in MongoDB Atlas:
- Go to your cluster
- Click "Connect"
- Choose "Connect your application"
- Copy the connection string
- Replace `<password>` with your database user's password

### 3. Run the Application
```bash
python main.py
```

The server will start on `http://localhost:8000`

## API Endpoints

### GET /
Root endpoint with API information
```bash
curl http://localhost:8000/
```

### GET /collections
Get list of all collections in the database
```bash
curl http://localhost:8000/collections
```

Response:
```json
{
  "status": "success",
  "database": "your_database_name",
  "collections": ["collection1", "collection2", "collection3"],
  "count": 3
}
```

### GET /health
Health check endpoint
```bash
curl http://localhost:8000/health
```

Response:
```json
{
  "status": "healthy",
  "database": "your_database_name"
}
```

## API Documentation

Once the server is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Features

- ✓ MongoDB Atlas SRV connection
- ✓ Automatic connection on startup
- ✓ Clean connection on shutdown
- ✓ List all collections in database
- ✓ Health check endpoint
- ✓ Error handling
- ✓ Auto-generated API documentation

## Troubleshooting

**Connection Failed Error:**
- Verify your SRV connection URL is correct
- Check your MongoDB Atlas network access (whitelist your IP)
- Ensure database user credentials are correct

**Module Not Found:**
- Run `pip install -r requirements.txt`
- Verify you're using the correct Python environment

**TimeoutError:**
- Check internet connection
- Verify MongoDB Atlas cluster is running
- Check firewall settings
