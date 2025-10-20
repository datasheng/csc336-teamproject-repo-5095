

from fastapi import APIRouter, HTTPException, status, Depends
from ..db_layer import db_queries
# You'll likely need a schema to define the output format of the report
# For simplicity, we'll return a List of Python dicts (JSON) for now.
from typing import List, Dict, Any

# --- DEPENDENCIES ---

# Placeholder for a security dependency (More strict than get_current_user_id)

def require_admin_or_owner_role(user_id: int = Depends(get_current_user_id)):
    # In the final implementation, you'd check the user's role from the DB.
    if user_id != 1: 
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Access denied. Requires Admin or Restaurant Owner privileges."
        )
    return user_id

# --- ROUTER SETUP ---

router = APIRouter(
    prefix="/reports",
    tags=["Reporting"]
)

# --- ENDPOINT: GET /reports/revenue ---

# The response model here is a list of dictionaries (List[Dict[str, Any]]),
# as the revenue report contains aggregated data that's harder to map to a single schema.
@router.get("/revenue", 
            response_model=List[Dict[str, Any]])
def get_revenue_data(
    # This ensures only authorized users can access the financial data
    authorized_user_id: int = Depends(require_admin_or_owner_role)
):
    """
    Fetches the aggregated revenue report data from the database.
    This data is intended for Excel export or Tableau visualization.
    """
    
    # 1. Call the data access function directly
    report_data = db_queries.get_revenue_report()
    
    if not report_data:
        # It's okay if the report is empty (no orders yet), but check for DB failure
        if report_data is None: 
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
                detail="Failed to connect to database for report generation."
            )
        
    return report_data
