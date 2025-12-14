# backend/routes/orders.py
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import List
from datetime import datetime, timedelta
from decimal import Decimal
from database.queries import (
    create_order, 
    add_order_item, 
    create_payment, 
    create_delivery,
    get_order_details,
    get_menu_item_by_id,
    get_orders_for_user,
)

router = APIRouter(prefix="/api/orders", tags=["Orders"])

# Request models
class OrderItemRequest(BaseModel):
    MENU_ITEM_ID: int
    QUANTITY: int
    
class OrderCreate(BaseModel):
    user_id: int
    RESTAURANT_ID: int
    PAYMENT_METHOD: str
    delivery_address: str
    items: List[OrderItemRequest]

# Place order endpoint
@router.post("/")
def place_order(order_data: OrderCreate):
    """Create a new order with items, payment, and delivery"""
    
    # Calculate total and validate items
    total_amount = Decimal("0.00")
    items_to_process = []
    
    for item in order_data.items:
        menu_item = get_menu_item_by_id(item.MENU_ITEM_ID)
        
        if not menu_item or menu_item['RESTAURANT_ID'] != order_data.RESTAURANT_ID:
            raise HTTPException(
                status_code=400,
                detail=f"Menu item {item.MENU_ITEM_ID} invalid or doesn't belong to this restaurant"
            )
        
        price = menu_item["PRICE"]          # Decimal from DB
        item_total = price * item.QUANTITY  # Decimal
        total_amount += item_total
  
        items_to_process.append({
            "menu_item_id": item.MENU_ITEM_ID,
            "quantity": item.QUANTITY,
            "price": price,                 # keep Decimal (or cast to str/float if your query layer needs)
        })

    try:
        total_amount_float = float(total_amount)

        # 1. Create main order
        order_id = create_order(
            user_id=order_data.user_id,
            restaurant_id=order_data.RESTAURANT_ID,
            total_amount=total_amount_float
        )
        
        if not order_id:
            raise Exception("Failed to create order")
        
        # 2. Add order items
        for item in items_to_process:
            add_order_item(
                order_id=order_id,
                menu_item_id=item['menu_item_id'],
                quantity=item['quantity'],
                price=item['price']
            )
        
        # 3. Create payment
        create_payment(
            order_id=order_id,
            amount=total_amount_float,
            method=order_data.PAYMENT_METHOD
        )
        
        # 4. Create delivery (assign to driver ID 1 for now)
        estimated_time = datetime.now() + timedelta(minutes=30)
        create_delivery(
            order_id=order_id,
            driver_id=1,
            delivery_address=order_data.delivery_address,
            estimated_time=estimated_time
        )
        
        # 5. Return order details
        return get_order_details(order_id)
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Order processing failed: {str(e)}"
        )

# Get order details endpoint
@router.get("/{order_id}")
def get_single_order(order_id: int):
    """Get order details by ID"""
    order_details = get_order_details(order_id)
    
    if not order_details:
        raise HTTPException(
            status_code=404, 
            detail=f"Order {order_id} not found"
        )
    
    return order_details

@router.get("/user/{user_id}")
def list_user_orders(user_id: int):
    """List all orders for a user"""
    order_ids = get_orders_for_user(user_id)
    # return full details for each order
    return [get_order_details(oid) for oid in order_ids]

@router.get("/")
def list_orders(user_id: int = Query(...)):
    order_ids = get_orders_for_user(user_id)
    return [get_order_details(oid) for oid in order_ids]