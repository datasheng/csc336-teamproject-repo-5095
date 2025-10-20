#backend/app.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database.connection import test_connection, get_db_connection

app = FastAPI(
    title="Restaurant Ordering API - Team 5095",
    description="Backend API for Restaurant Ordering & Delivery System",
    version="1.0.0"
)

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Angus's frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {
        "message": "Restaurant Ordering API - Team 5095",
        "team": "Diana & Alisha (Backend)",
        "status": "Development",
        "framework": "FastAPI",
        "docs": "/docs"
    }

@app.get("/api/health")
def health():
    db_connected = test_connection()
    return {
        "status": "healthy" if db_connected else "unhealthy",
        "database": "connected ✅" if db_connected else "disconnected ❌"
    }

@app.get("/api/test-db")
def test_db():
    """Test endpoint to verify database access"""
    conn = get_db_connection()
    if not conn:
        return {"error": "Cannot connect to database"}, 500
    
    cursor = conn.cursor()
    cursor.execute("SHOW TABLES;")
    tables = [table[0] for table in cursor.fetchall()]
    cursor.close()
    conn.close()
    
    return {
        "message": "Database connected successfully!",
        "tables": tables
    }

if __name__ == '__main__':
    import uvicorn
    print("🚀 Starting FastAPI Backend Server...")
    print("📍 Server running at: http://localhost:8000")
    print("📚 API Docs: http://localhost:8000/docs")
    print("🔍 Health check: http://localhost:8000/api/health")
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)