# backend/routes/auth.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from database.queries import create_user, get_user_by_email

# Create router
router = APIRouter(prefix="/api/auth", tags=["Authentication"])

# Define request model
class RegisterRequest(BaseModel):
    username: str
    email: str
    password: str
    phone: str
    role: str = "customer"  # default to customer

# Registration endpoint
@router.post("/register")
def register(data: RegisterRequest):
    """Register a new user account"""
    
    # Check if email already exists
    existing_user = get_user_by_email(data.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user (TODO: add password hashing later)
    user_id = create_user(
        username=data.username,
        password=data.password,  # TODO: hash this!
        email=data.email,
        phone=data.phone,
        role=data.role
    )
    
    if user_id:
        return {
            "success": True,
            "message": "Account created successfully!",
            "user_id": user_id
        }
    else:
        raise HTTPException(status_code=500, detail="Failed to create account")