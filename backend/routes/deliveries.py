# backend/routes/deliveries.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from database.queries import get_delivery_by_order_id, get_delivery_by_id, update_delivery_status

router = APIRouter(prefix="/api/deliveries", tags=["Deliveries"])

class DeliveryStatusUpdate(BaseModel):
    status: str  # ASSIGNED, PICKED_UP, IN_TRANSIT, DELIVERED

@router.get("/order/{order_id}")
def get_delivery_for_order(order_id: int):
    """
    Get delivery information for a specific order
    Used by customer to track their delivery
    """
    try:
        delivery = get_delivery_by_order_id(order_id)
        
        if not delivery:
            raise HTTPException(
                status_code=404,
                detail=f"No delivery found for order {order_id}"
            )
        
        return {
            "success": True,
            "delivery": delivery
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get delivery: {str(e)}"
        )

@router.get("/{delivery_id}")
def get_delivery(delivery_id: int):
    """
    Get delivery details by delivery ID
    """
    try:
        delivery = get_delivery_by_id(delivery_id)
        
        if not delivery:
            raise HTTPException(
                status_code=404,
                detail=f"Delivery {delivery_id} not found"
            )
        
        return {
            "success": True,
            "delivery": delivery
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get delivery: {str(e)}"
        )

@router.patch("/{delivery_id}/status")
def update_delivery(delivery_id: int, data: DeliveryStatusUpdate):
    """
    Update delivery status
    Used by drivers to update progress
    """
    try:
        # Validate status
        valid_statuses = ["ASSIGNED", "PICKED_UP", "IN_TRANSIT", "DELIVERED"]
        if data.status not in valid_statuses:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid status. Must be one of: {', '.join(valid_statuses)}"
            )
        
        success = update_delivery_status(delivery_id, data.status)
        
        if not success:
            raise HTTPException(
                status_code=404,
                detail=f"Delivery {delivery_id} not found"
            )
        
        return {
            "success": True,
            "message": f"Delivery status updated to {data.status}"
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to update delivery: {str(e)}"
        )