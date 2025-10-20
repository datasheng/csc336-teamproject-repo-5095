from fastapi import APIRouter, HTTPException
from database.queries import get_all_restaurants, get_restaurant_by_id, get_restaurant_menu

# Create router
router = APIRouter(prefix="/api/restaurants", tags=["Restaurants"])

# Browse restaurants endpoint
@router.get("/")
def get_restaurants(zip: str = None):
    """Get all restaurants, optionally filtered by ZIP code"""
    
    restaurants = get_all_restaurants()
    
    # TODO: Filter by ZIP once Krista adds ZIP_CODE column
    # if zip:
    #     restaurants = [r for r in restaurants if r.get('ZIP_CODE') == zip]
    
    return {
        "success": True,
        "count": len(restaurants),
        "restaurants": restaurants
    }

# Get specific restaurant
@router.get("/{restaurant_id}")
def get_restaurant(restaurant_id: int):
    """Get specific restaurant details"""
    
    restaurant = get_restaurant_by_id(restaurant_id)
    
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found")
    
    return {
        "success": True,
        "restaurant": restaurant
    }

# Get restaurant menu
@router.get("/{restaurant_id}/menu")
def get_menu(restaurant_id: int):
    """Get restaurant menu"""
    
    menu = get_restaurant_menu(restaurant_id)
    
    return {
        "success": True,
        "restaurant_id": restaurant_id,
        "menu_items": menu
    }