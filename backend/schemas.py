
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from enum import Enum 

# ====================================================
# 1. ENUMS (For robust validation of fixed values)
# ====================================================

# Mirrors the MySQL ENUM for USERS.ROLES
class UserRole(str, Enum):
    customer = 'customer'
    driver = 'driver'
    admin = 'admin'
    owner = 'owner' 

# Mirrors the MySQL ENUM for DELIVERIES.DELIVERY_STATUS
class DeliveryStatus(str, Enum):
    ASSIGNED = 'ASSIGNED'
    PICKED_UP = 'PICKED_UP'
    IN_TRANSIT = 'IN_TRANSIT'
    DELIVERED = 'DELIVERED'
    FAILED = 'FAILED'

# ====================================================
# 2. USER AND AUTHENTICATION SCHEMAS
# ====================================================

# Schema for User Registration Input (what the user sends to POST /auth/register)
class RegisterRequest(BaseModel):
    username: str = Field(..., max_length=50) 
    email: str
    password: str # This will be hashed in the auth.py route
    phone: str
    role: UserRole = UserRole.customer

# Schema for returning a User Profile (Output: Sensitive fields removed)
class UserResponse(BaseModel):
    USER_ID: int
    USER_NAME: str
    EMAIL: str
    PHONE: Optional[str] = None
    ROLES: UserRole 
    # NOTE: PASS_WORD is deliberately omitted for security

# Schema for a successful login (Output: Contains JWT)
class Token(BaseModel):
    access_token: str
    token_type: str
    user_id: int
    role: UserRole

# ====================================================
# 3. ORDER INPUT SCHEMAS
# ====================================================

# Item model for the order request
class OrderItemRequest(BaseModel):
    MENU_ITEM_ID: int
    QUANTITY: int

# Main Order Placement model (Input for POST /orders)
class OrderCreate(BaseModel):
    RESTAURANT_ID: int
    PAYMENT_METHOD: str # Could be another Enum if needed
    items: List[OrderItemRequest]

# ====================================================
# 4. ORDER AND DELIVERY OUTPUT SCHEMAS (Nested Responses)
# ====================================================

# Item model for the Order Details Response (Nested output structure)
class OrderItemResponse(BaseModel):
    ORDER_ITEM_ID: int
    MENU_ITEM_ID: int
    ITEM_NAME: str  # Data retrieved via JOIN in SQL function
    QUANTITY: int
    PRICE: float 

# Delivery model for the Order Details Response
class DeliveryResponse(BaseModel):
    DELIVERY_ID: int
    DRIVER_ID: int
    DELIVERY_STATUS: DeliveryStatus 
    ESTIMATED_TIME: Optional[datetime] = None # Handles potential NULL in DB
    ACTUAL_TIME: Optional[datetime] = None # Handles potential NULL in DB

# The final, complete Order Response (Output for POST /orders and GET /orders/{id})
class OrderResponse(BaseModel):
    ORDER_ID: int
    USER_ID: int
    RESTAURANT_ID: int
    TOTAL_AMOUNT: float
    ORDER_DATE: datetime 
    
    # Nested fields
    items: List[OrderItemResponse]
    delivery: Optional[DeliveryResponse] = None
