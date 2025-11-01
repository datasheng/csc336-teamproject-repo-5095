# backend/routes/reports.py
from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from database.queries import get_revenue_report

router = APIRouter(prefix="/api/reports", tags=["Reports"])

@router.get("/revenue")
def get_revenue_data():
    """
    Generate revenue report (MANDATORY FEATURE)
    Returns aggregated revenue data for Excel export
    """
    try:
        report_data = get_revenue_report()

        if report_data is None:
            raise HTTPException(
                status_code=500,
                detail="Failed to connect to database"
            )

        return {
            "success": True,
            "message": "Revenue report generated",
            "data": report_data
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Report generation failed: {str(e)}"
        )
