# backend/schemas.py
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime # Use for TIMESTAMP/DATETIME fields

# Pydantic Schema for a User
class User(BaseModel):
    USER_ID: int
    USER_NAME: str
    PASS_WORD: str
    EMAIL: str
    PHONE: Optional[str] # Allow for null if the column allows it
    ROLES: str # 'customer', 'driver', 'admin'

# Pydantic Schema for a Menu Item (Used as a building block for an order)
class OrderItemRequest(BaseModel):
    MENU_ITEM_ID: int
    QUANTITY: int

# Pydantic Schema for placing a new Order (The INPUT data)
class OrderCreate(BaseModel):
    RESTAURANT_ID: int
    PAYMENT_METHOD: str
    items: List[OrderItemRequest] # This list uses the item model above
