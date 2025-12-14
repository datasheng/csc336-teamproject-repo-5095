# backend/routes/auth.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from database.queries import create_user, get_user_by_email

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

    return {
        "success": True,
        "user": {
            "USER_ID": user["USER_ID"],
            "USER_NAME": user["USER_NAME"],
            "EMAIL": user["EMAIL"],
            "ROLES": user["ROLES"],
        }
    }
