
from fastapi import APIRouter, HTTPException, status, Depends

from ..db_layer import db_queries 
from ..schemas import OrderCreate, OrderItemRequest # Use schemas you defined

# Define the router object
router = APIRouter(
    prefix="/orders",
    tags=["Orders"]
)

def get_current_user_id():
    # In a real app, this verifies the JWT and returns the ID
    return 1 # Hardcoding a test user ID for now

# ... (Your existing code down to line 18) ...

# -------------------------------------------------------------
# 2. The Order Placement Endpoint (POST /orders)
# -------------------------------------------------------------
@router.post("/", status_code=status.HTTP_201_CREATED)
def place_order(
    order_data: OrderCreate,
    user_id: int = Depends(get_current_user_id) # Uses the placeholder above
):
    # --- Step 1: Pre-Calculations and Item Validation ---
    total_amount = 0.0
    items_to_process = []

    # Get menu item prices and validate them against the restaurant
    for item in order_data.items:
        # NOTE: You MUST have a get_menu_item_by_id function in db_queries
        menu_item = db_queries.get_menu_item_by_id(item.MENU_ITEM_ID) 
        
        if not menu_item or menu_item['RESTAURANT_ID'] != order_data.RESTAURANT_ID:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Menu item ID {item.MENU_ITEM_ID} is invalid or does not belong to this restaurant."
            )
            
        item_total = menu_item['PRICE'] * item.QUANTITY
        total_amount += item_total
        
        items_to_process.append({
            "menu_item_id": item.MENU_ITEM_ID,
            "quantity": item.QUANTITY,
            "price": menu_item['PRICE'] 
        })
        
    # --- Step 2: Transactional Inserts ---
    try:
        # 1. Create the main ORDERS record
        order_id = db_queries.create_order(
            user_id=user_id,
            restaurant_id=order_data.RESTAURANT_ID,
            total_amount=total_amount
        )

        if not order_id:
            raise Exception("Database error: Could not create main order record.")

        # 2. Add all ORDER_ITEMS
        for item in items_to_process:
            db_queries.add_order_item(
                order_id=order_id,
                menu_item_id=item['menu_item_id'],
                quantity=item['quantity'],
                price=item['price']
            )

        # 3. Create PAYMENTS record
        db_queries.create_payment(
            order_id=order_id,
            amount=total_amount,
            method=order_data.PAYMENT_METHOD
        )
        
        # 4. Create DELIVERIES record (Assume driver ID 1 is a default for now)
        # NOTE: You MUST have a create_delivery function in db_queries
        db_queries.create_delivery( 
            order_id=order_id,
            driver_id=1, 
            delivery_status='ASSIGNED'
        )

        # 5. Return the full order details
        return db_queries.get_order_details(order_id)

    except Exception as e:
        # Catch any failure during the multi-step insert process
        print(f"Order Placement Error: {e}")
        # In a raw SQL setup, relying on your teammate's functions to handle rollback
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="Order processing failed due to a server error."
        )

# -------------------------------------------------------------
# 3. The Order Details Endpoint (GET /orders/{order_id})
# -------------------------------------------------------------
@router.get("/{order_id}")
def get_single_order(
    order_id: int,
    user_id: int = Depends(get_current_user_id)
):
    order_details = db_queries.get_order_details(order_id)
    
    if not order_details:
        raise HTTPException(status_code=404, detail=f"Order ID {order_id} not found.")

    # Security Check: Ensure the user owns the order
    if order_details.get('USER_ID') != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="You do not have permission to view this order."
        )
        
    return order_details
