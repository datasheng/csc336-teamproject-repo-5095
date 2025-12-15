# backend/routes/orders.py
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import List
from datetime import datetime, timedelta
from decimal import Decimal, ROUND_HALF_UP

from database.queries import (
    create_order,
    add_order_item,
    create_payment,
    create_delivery,
    get_order_details,
    get_menu_item_by_id,
    get_orders_for_user,
)

# Constants to match frontend checkout
DELIVERY_FEE = Decimal("3.99")
SERVICE_FEE = Decimal("2.99")
TAX_RATE = Decimal("0.08")

def money(x: Decimal) -> Decimal:
    """Round to 2 decimals using standard financial rounding."""
    return x.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)

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

@router.post("/")
def place_order(order_data: OrderCreate):
    """Create a new order with items, payment, and delivery.
    Stores GRAND TOTAL in ORDERS.TOTAL_AMOUNT:
      grand_total = subtotal + DELIVERY_FEE + SERVICE_FEE + (subtotal * TAX_RATE)
    """

    # 1) Calculate subtotal and validate items
    subtotal = Decimal("0.00")
    items_to_process = []

    for item in order_data.items:
        menu_item = get_menu_item_by_id(item.MENU_ITEM_ID)

        if not menu_item or menu_item["RESTAURANT_ID"] != order_data.RESTAURANT_ID:
            raise HTTPException(
                status_code=400,
                detail=f"Menu item {item.MENU_ITEM_ID} invalid or doesn't belong to this restaurant"
            )

        # Ensure Decimal safety even if DB adapter returns Decimal/float/str
        price = Decimal(str(menu_item["PRICE"]))
        item_total = price * Decimal(item.QUANTITY)
        subtotal += item_total

        items_to_process.append({
            "menu_item_id": item.MENU_ITEM_ID,
            "quantity": item.QUANTITY,
            "price": price,  # keep Decimal for DB insert if supported
        })

    # 2) Compute grand total to match frontend
    subtotal = money(subtotal)
    tax = money(subtotal * TAX_RATE)
    grand_total = money(subtotal + DELIVERY_FEE + SERVICE_FEE + tax)

    try:
        grand_total_float = float(grand_total)

        # 3) Create main order with GRAND TOTAL
        order_id = create_order(
            user_id=order_data.user_id,
            restaurant_id=order_data.RESTAURANT_ID,
            subtotal=float(subtotal),
            total_amount=grand_total_float  # <-- store grand total in ORDERS.TOTAL_AMOUNT
        )

        if not order_id:
            raise Exception("Failed to create order")

        # 4) Add order items
        for item in items_to_process:
            add_order_item(
                order_id=order_id,
                menu_item_id=item["menu_item_id"],
                quantity=item["quantity"],
                price=item["price"]
            )

        # 5) Create payment for GRAND TOTAL
        create_payment(
            order_id=order_id,
            amount=grand_total_float,  # <-- charge grand total
            method=order_data.PAYMENT_METHOD
        )

        # 6) Create delivery (assign to driver ID 1 for now)
        estimated_time = datetime.now() + timedelta(minutes=30)
        create_delivery(
            order_id=order_id,
            driver_id=1,
            delivery_address=order_data.delivery_address,
            estimated_time=estimated_time
        )

        # 7) Return order details
        return get_order_details(order_id)

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Order processing failed: {str(e)}"
        )

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
    return [get_order_details(oid) for oid in order_ids]

@router.get("/")
def list_orders(user_id: int = Query(...)):
    order_ids = get_orders_for_user(user_id)
    return [get_order_details(oid) for oid in order_ids]
