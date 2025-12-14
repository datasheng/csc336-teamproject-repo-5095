# backend/routes/reports.py
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from typing import List, Dict, Any
from database.queries import get_revenue_report, get_revenue_details
import openpyxl
from io import BytesIO
from datetime import datetime

router = APIRouter(prefix="/api/reports", tags=["Reports"])
@router.get("/revenue")
def get_revenue_data():
    """
    Get revenue data for all restaurants
    Returns aggregated statistics per restaurant
    """
    try:
        report = get_revenue_report()
        
        # Debug logging
        print(f"🔍 Revenue report type: {type(report)}")
        print(f"🔍 Revenue report value: {report}")
        
        if report is None:
            print("⚠️ get_revenue_report() returned None")
            return []  # Return empty array instead of None
        
        if not isinstance(report, list):
            print(f"⚠️ Expected list, got {type(report)}")
            return []
        
        return report
        
    except Exception as e:
        print(f"❌ Error in get_revenue_data: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate revenue report: {str(e)}"
        )

@router.get("/revenue/details")
def get_detailed_revenue():
    """
    Get detailed revenue data (order-by-order breakdown)
    Returns individual order profit data from INVESTOR_PROFIT_VIEW
    """
    try:
        details = get_revenue_details()
        
        if details is None:
            raise HTTPException(
                status_code=500,
                detail="Failed to connect to database"
            )
        
        return {
            "success": True,
            "message": "Revenue details retrieved",
            "data": details
        }
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get details: {str(e)}"
        )


@router.get("/revenue/excel")
def download_revenue_excel():
    """
    Download revenue report as Excel file (MANDATORY REQUIREMENT)
    Returns an Excel file with aggregated revenue data for all restaurants
    """
    try:
        # Get aggregated report data
        report_data = get_revenue_report()
        
        if not report_data:
            raise HTTPException(
                status_code=404,
                detail="No revenue data available"
            )
        
        # Create Excel workbook
        wb = openpyxl.Workbook()
        ws = wb.active
        ws.title = "Revenue Report"
        
        # Add title row
        ws.merge_cells('A1:E1')
        title_cell = ws['A1']
        title_cell.value = f"Restaurant Revenue Report - {datetime.now().strftime('%Y-%m-%d')}"
        title_cell.font = openpyxl.styles.Font(size=14, bold=True)
        title_cell.alignment = openpyxl.styles.Alignment(horizontal='center')
        
        # Add headers in row 3
        headers = ["Restaurant", "Total Orders", "Total Revenue", "Avg Order Value", "Unique Customers"]
        ws.append([])  # Empty row 2
        ws.append(headers)
        
        # Style header row
        for cell in ws[3]:
            cell.font = openpyxl.styles.Font(bold=True, color="FFFFFF")
            cell.fill = openpyxl.styles.PatternFill(start_color="FF5722", end_color="FF5722", fill_type="solid")
            cell.alignment = openpyxl.styles.Alignment(horizontal='center')
        
        # Add data rows
        total_orders = 0
        total_revenue = 0.0
        
        for row in report_data:
            ws.append([
                row['RESTAURANT_NAME'],
                row['TOTAL_ORDERS'],
                float(row['TOTAL_REVENUE']),
                float(row['AVG_ORDER_VALUE']),
                row['UNIQUE_CUSTOMERS']
            ])
            total_orders += row['TOTAL_ORDERS']
            total_revenue += float(row['TOTAL_REVENUE'])
        
        # Add totals row
        last_row = ws.max_row + 1
        ws.append([])  # Empty row
        totals_row = last_row + 1
        ws[f'A{totals_row}'] = "TOTAL"
        ws[f'B{totals_row}'] = total_orders
        ws[f'C{totals_row}'] = total_revenue
        
        # Style totals row
        for cell in ws[totals_row]:
            cell.font = openpyxl.styles.Font(bold=True)
            cell.fill = openpyxl.styles.PatternFill(start_color="FFE0B2", end_color="FFE0B2", fill_type="solid")
        
        # Format currency columns
        for row in ws.iter_rows(min_row=4, max_row=ws.max_row, min_col=3, max_col=4):
            for cell in row:
                cell.number_format = '$#,##0.00'
        
        # Auto-adjust column widths (skip merged cells)
        for col_idx in range(1, 6):  # Columns A through E
            max_length = 0
            column_letter = openpyxl.utils.get_column_letter(col_idx)
            
            for row in ws.iter_rows(min_row=3, min_col=col_idx, max_col=col_idx):
                for cell in row:
                    try:
                        if cell.value and len(str(cell.value)) > max_length:
                            max_length = len(str(cell.value))
                    except:
                        pass
            
            adjusted_width = max(12, (max_length + 2) * 1.2)
            ws.column_dimensions[column_letter].width = adjusted_width
        
        # Save to BytesIO
        output = BytesIO()
        wb.save(output)
        output.seek(0)
        
        # Generate filename with timestamp
        filename = f"revenue_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.xlsx"
        
        # Return as downloadable file
        return StreamingResponse(
            output,
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Excel generation failed: {str(e)}"
        )