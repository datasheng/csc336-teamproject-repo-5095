# backend/routes/reports.py
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from typing import List, Dict, Any
from database.queries import get_revenue_report, get_revenue_details
from database.connection import get_db_connection 
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
    
@router.get("/restaurant/{restaurant_id}/excel")
def download_restaurant_revenue_excel(restaurant_id: int):
    """
    Download revenue report for a specific restaurant
    For restaurant owners to see their earnings
    """
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        # Get restaurant info
        cursor.execute("""
            SELECT r.RESTAURANT_NAME, u.USER_NAME as OWNER_NAME
            FROM RESTAURANT r
            JOIN USERS u ON r.OWNER_ID = u.USER_ID
            WHERE r.RESTAURANT_ID = %s
        """, (restaurant_id,))
        restaurant_info = cursor.fetchone()
        
        if not restaurant_info:
            cursor.close()
            conn.close()
            raise HTTPException(status_code=404, detail="Restaurant not found")
        
        # Get orders for this restaurant
        cursor.execute("""
            SELECT 
                o.ORDER_ID,
                o.ORDER_DATE,
                u.USER_NAME as CUSTOMER_NAME,
                o.TOTAL_AMOUNT as GROSS_REVENUE,
                (o.TOTAL_AMOUNT * 0.15) as PLATFORM_COMMISSION,
                (o.TOTAL_AMOUNT * 0.85) as NET_REVENUE
            FROM ORDERS o
            JOIN USERS u ON o.USER_ID = u.USER_ID 
            WHERE o.RESTAURANT_ID = %s
            ORDER BY o.ORDER_DATE DESC
        """, (restaurant_id,))
        orders = cursor.fetchall()
        
        cursor.close()
        conn.close()
        
        # Create Excel workbook
        wb = openpyxl.Workbook()
        ws = wb.active
        ws.title = "Restaurant Revenue"
        
        # Title
        ws.merge_cells('A1:F1')
        title_cell = ws['A1']
        title_cell.value = f"REVENUE REPORT - {restaurant_info['RESTAURANT_NAME']}"
        title_cell.font = openpyxl.styles.Font(size=16, bold=True)
        title_cell.alignment = openpyxl.styles.Alignment(horizontal='center')
        
        # Restaurant info
        ws['A3'] = "Restaurant:"
        ws['B3'] = restaurant_info['RESTAURANT_NAME']
        ws['B3'].font = openpyxl.styles.Font(bold=True)
        
        ws['A4'] = "Owner:"
        ws['B4'] = restaurant_info['OWNER_NAME']
        
        ws['A5'] = "Report Date:"
        ws['B5'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        
        # Summary section
        total_orders = len(orders)
        total_gross = sum(float(o['GROSS_REVENUE']) for o in orders)
        total_commission = sum(float(o['PLATFORM_COMMISSION']) for o in orders)
        total_net = sum(float(o['NET_REVENUE']) for o in orders)
        
        ws['A7'] = "REVENUE SUMMARY"
        ws['A7'].font = openpyxl.styles.Font(size=12, bold=True)
        
        ws['A8'] = "Total Orders:"
        ws['B8'] = total_orders
        
        ws['A9'] = "Gross Revenue (Customer Payments):"
        ws['B9'] = total_gross
        ws['B9'].number_format = '$#,##0.00'
        
        ws['A10'] = "Platform Commission (15%):"
        ws['B10'] = -total_commission
        ws['B10'].number_format = '$#,##0.00'
        ws['B10'].font = openpyxl.styles.Font(color="FF0000")
        
        ws['A11'] = "NET REVENUE (You Keep):"
        ws['B11'] = total_net
        ws['B11'].number_format = '$#,##0.00'
        ws['B11'].font = openpyxl.styles.Font(bold=True, size=12)
        ws['B11'].fill = openpyxl.styles.PatternFill(start_color="90EE90", end_color="90EE90", fill_type="solid")
        
        # Order history table
        ws['A13'] = "ORDER HISTORY"
        ws['A13'].font = openpyxl.styles.Font(size=12, bold=True)
        
        # Headers
        headers = ["Order ID", "Date", "Customer", "Gross Revenue", "Commission (15%)", "Net Revenue"]
        ws.append([])  # Row 14 - empty
        ws.append(headers)  # Row 15
        
        # Style headers
        for cell in ws[15]:
            cell.font = openpyxl.styles.Font(bold=True, color="FFFFFF")
            cell.fill = openpyxl.styles.PatternFill(start_color="FF5722", end_color="FF5722", fill_type="solid")
            cell.alignment = openpyxl.styles.Alignment(horizontal='center')
        
        # Add order rows
        for order in orders:
            ws.append([
                order['ORDER_ID'],
                order['ORDER_DATE'].strftime('%Y-%m-%d'),
                order['CUSTOMER_NAME'],
                float(order['GROSS_REVENUE']),
                -float(order['PLATFORM_COMMISSION']),
                float(order['NET_REVENUE'])
            ])
        
        # Format currency columns (D, E, F)
        for row in ws.iter_rows(min_row=16, max_row=ws.max_row, min_col=4, max_col=6):
            for cell in row:
                cell.number_format = '$#,##0.00'
        
        # Auto-adjust column widths
        for col_idx in range(1, 7):
            column_letter = openpyxl.utils.get_column_letter(col_idx)
            max_length = 0
            for row in ws.iter_rows(min_col=col_idx, max_col=col_idx):
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
        
        # Generate filename
        filename = f"{restaurant_info['RESTAURANT_NAME'].replace(' ', '_')}_Revenue_{datetime.now().strftime('%Y%m%d_%H%M%S')}.xlsx"
        
        return StreamingResponse(
            output,
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Excel generation failed: {str(e)}"
        )