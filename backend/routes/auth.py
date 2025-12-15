# backend/routes/auth.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from database.queries import create_user, get_user_by_email
from database.connection import get_db_connection

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

class RegisterRequest(BaseModel):
    username: str
    email: str
    password: str
    phone: str
    role: str = "customer"

class LoginRequest(BaseModel):
    email: str
    password: str

def get_restaurant_id_for_owner(user_id: int):
    """Get the restaurant ID for a restaurant owner"""
    conn = get_db_connection()
    if not conn:
        return None
    
    try:
        cursor = conn.cursor(dictionary=True)
        query = "SELECT RESTAURANT_ID FROM RESTAURANT WHERE OWNER_ID = %s"
        cursor.execute(query, (user_id,))
        result = cursor.fetchone()
        cursor.close()
        conn.close()
        return result["RESTAURANT_ID"] if result else None
    except Exception as e:
        print(f"Error getting restaurant ID: {e}")
        return None

@router.post("/register")
def register(data: RegisterRequest):
    existing_user = get_user_by_email(data.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    user_id = create_user(
        username=data.username,
        password=data.password,  # TODO: hash this!
        email=data.email,
        phone=data.phone,
        role=data.role
    )

    if user_id:
        return {"success": True, "message": "Account created successfully!", "user_id": user_id}
    raise HTTPException(status_code=500, detail="Failed to create account")

@router.post("/login")
def login(data: LoginRequest):
    user = get_user_by_email(data.email)

    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if user["PASS_WORD"] != data.password:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    # Build response
    response_user = {
        "USER_ID": user["USER_ID"],
        "USER_NAME": user["USER_NAME"],
        "EMAIL": user["EMAIL"],
        "ROLES": user["ROLES"],
    }
    
    # If user is a restaurant owner, include their restaurant ID
    if user["ROLES"] in ["restaurant_owner", "owner"]:
        restaurant_id = get_restaurant_id_for_owner(user["USER_ID"])
        if restaurant_id:
            response_user["RESTAURANT_ID"] = restaurant_id

    return {
        "success": True,
        "user": response_user
    }