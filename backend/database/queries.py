# backend/database/queries.py
"""
Database queries for Restaurant Ordering System
All queries use raw SQL (no ORM per project requirements)
"""

from database.connection import get_db_connection
from datetime import datetime, timedelta

# ==================== USER QUERIES ====================

def create_user(username, password, email, phone, role):
    """Create a new user account"""
    conn = get_db_connection()
    if not conn:
        return None
    
    try:
        cursor = conn.cursor()
        query = """
            INSERT INTO USERS (USER_NAME, PASS_WORD, EMAIL, PHONE, ROLES)
            VALUES (%s, %s, %s, %s, %s)
        """
        cursor.execute(query, (username, password, email, phone, role))
        conn.commit()
        user_id = cursor.lastrowid
        cursor.close()
        conn.close()
        return user_id
    except Exception as e:
        print(f"Error creating user: {e}")
        return None

def get_user_by_email(email):
    """Get user by email (for login)"""
    conn = get_db_connection()
    if not conn:
        return None
    
    cursor = conn.cursor(dictionary=True)
    query = "SELECT * FROM USERS WHERE EMAIL = %s"
    cursor.execute(query, (email,))
    user = cursor.fetchone()
    cursor.close()
    conn.close()
    return user

def get_user_by_id(user_id):
    """Get user by ID"""
    conn = get_db_connection()
    if not conn:
        return None
    
    cursor = conn.cursor(dictionary=True)
    query = "SELECT USER_ID, USER_NAME, EMAIL, PHONE, ROLES, ACCOUNT_CREATED_AT FROM USERS WHERE USER_ID = %s"
    cursor.execute(query, (user_id,))
    user = cursor.fetchone()
    cursor.close()
    conn.close()
    return user

# ==================== RESTAURANT QUERIES ====================

def get_all_restaurants():
    """Get all restaurants"""
    conn = get_db_connection()
    if not conn:
        return []
    
    cursor = conn.cursor(dictionary=True)
    query = """
        SELECT r.*, u.USER_NAME as OWNER_NAME
        FROM RESTAURANT r
        JOIN USERS u ON r.OWNER_ID = u.USER_ID
    """
    cursor.execute(query)
    restaurants = cursor.fetchall()
    cursor.close()
    conn.close()
    return restaurants

def get_restaurant_by_id(restaurant_id):
    """Get restaurant details by ID"""
    conn = get_db_connection()
    if not conn:
        return None
    
    cursor = conn.cursor(dictionary=True)
    query = """
        SELECT r.*, u.USER_NAME as OWNER_NAME
        FROM RESTAURANT r
        JOIN USERS u ON r.OWNER_ID = u.USER_ID
        WHERE r.RESTAURANT_ID = %s
    """
    cursor.execute(query, (restaurant_id,))
    restaurant = cursor.fetchone()
    cursor.close()
    conn.close()
    return restaurant

# ==================== MENU QUERIES ====================

def get_restaurant_menu(restaurant_id):
    """Get all menu items for a restaurant"""
    conn = get_db_connection()
    if not conn:
        return []
    
    cursor = conn.cursor(dictionary=True)
    query = """
        SELECT * FROM MENU
        WHERE RESTAURANT_ID = %s
        ORDER BY ITEM_NAME
    """
    cursor.execute(query, (restaurant_id,))
    menu_items = cursor.fetchall()
    cursor.close()
    conn.close()
    return menu_items

def get_menu_item_by_id(menu_item_id):
    """Get menu item by ID"""
    conn = get_db_connection()
    if not conn:
        return None
    
    cursor = conn.cursor(dictionary=True)
    query = "SELECT * FROM MENU WHERE MENU_ITEM_ID = %s"
    cursor.execute(query, (menu_item_id,))
    menu_item = cursor.fetchone()
    cursor.close()
    conn.close()
    return menu_item

# ==================== ORDER QUERIES ====================

def create_order(user_id, restaurant_id, subtotal, total_amount):
    """Create a new order with profit tracking"""
    conn = get_db_connection()
    if not conn:
        return None
    
    try:
        # Calculate commission and fees
        platform_commission = subtotal * 0.15
        service_fee = 2.99
        platform_profit = platform_commission + service_fee
        
        cursor = conn.cursor()
        query = """
            INSERT INTO ORDERS (
                USER_ID, RESTAURANT_ID, TOTAL_AMOUNT,
                PLATFORM_COMMISSION, SERVICE_FEE, PLATFORM_PROFIT_ORDER,
                STATUS
            )
            VALUES (%s, %s, %s, %s, %s, %s, 'DELIVERED')
        """
        cursor.execute(query, (
            user_id, restaurant_id, total_amount,
            platform_commission, service_fee, platform_profit
        ))
        conn.commit()
        order_id = cursor.lastrowid
        cursor.close()
        conn.close()
        return order_id
    except Exception as e:
        print(f"Error creating order: {e}")
        return None

def add_order_item(order_id, menu_item_id, quantity, price):
    """Add item to an order"""
    conn = get_db_connection()
    if not conn:
        return None
    
    try:
        cursor = conn.cursor()
        query = """
            INSERT INTO ORDER_ITEMS (ORDER_ID, MENU_ITEM_ID, QUANTITY, PRICE)
            VALUES (%s, %s, %s, %s)
        """
        cursor.execute(query, (order_id, menu_item_id, quantity, price))
        conn.commit()
        order_item_id = cursor.lastrowid
        cursor.close()
        conn.close()
        return order_item_id
    except Exception as e:
        print(f"Error adding order item: {e}")
        return None

def get_order_details(order_id):
    """Get complete order details with items and delivery info"""
    conn = get_db_connection()
    if not conn:
        return None
    
    cursor = conn.cursor(dictionary=True)
    
    # Get order info
    query = """
        SELECT o.*, u.USER_NAME, r.RESTAURANT_NAME
        FROM ORDERS o
        JOIN USERS u ON o.USER_ID = u.USER_ID
        JOIN RESTAURANT r ON o.RESTAURANT_ID = r.RESTAURANT_ID
        WHERE o.ORDER_ID = %s
    """
    cursor.execute(query, (order_id,))
    order = cursor.fetchone()
    
    if order:
        # Get order items
        query = """
            SELECT oi.*, m.ITEM_NAME, m.ITEM_DESCRIP
            FROM ORDER_ITEMS oi
            JOIN MENU m ON oi.MENU_ITEM_ID = m.MENU_ITEM_ID
            WHERE oi.ORDER_ID = %s
        """
        cursor.execute(query, (order_id,))
        order['items'] = cursor.fetchall()
        
        # Get delivery info (NEW)
        query = """
            SELECT 
                d.*,
                u.USER_NAME as DRIVER_NAME,
                u.PHONE as DRIVER_PHONE
            FROM DELIVERIES d
            LEFT JOIN USERS u ON d.DRIVER_ID = u.USER_ID
            WHERE d.ORDER_ID = %s
        """
        cursor.execute(query, (order_id,))
        order['delivery'] = cursor.fetchone()
    
    cursor.close()
    conn.close()
    return order

def get_user_orders(user_id):
    """Get all orders for a user"""
    conn = get_db_connection()
    if not conn:
        return []
    
    cursor = conn.cursor(dictionary=True)
    query = """
        SELECT o.*, r.RESTAURANT_NAME
        FROM ORDERS o
        JOIN RESTAURANT r ON o.RESTAURANT_ID = r.RESTAURANT_ID
        WHERE o.USER_ID = %s
        ORDER BY o.ORDER_DATE DESC
    """
    cursor.execute(query, (user_id,))
    orders = cursor.fetchall()
    cursor.close()
    conn.close()
    return orders

def get_orders_for_user(user_id: int):
    """Get order IDs for a specific user"""
    conn = get_db_connection()
    if not conn:
        return []

    cursor = conn.cursor(dictionary=True)
    cursor.execute(
        """
        SELECT ORDER_ID
        FROM ORDERS
        WHERE USER_ID = %s
        ORDER BY ORDER_ID DESC
        """,
        (user_id,),
    )
    rows = cursor.fetchall()
    cursor.close()
    conn.close()

    return [r["ORDER_ID"] for r in rows]

# ==================== PAYMENT QUERIES ====================

def create_payment(order_id, amount, method):
    """Create a payment record"""
    conn = get_db_connection()
    if not conn:
        return None
    
    try:
        cursor = conn.cursor()
        query = """
            INSERT INTO PAYMENTS (ORDER_ID, AMOUNT, METHOD, STATUS)
            VALUES (%s, %s, %s, 'COMPLETED')
        """
        cursor.execute(query, (order_id, amount, method))
        conn.commit()
        payment_id = cursor.lastrowid
        cursor.close()
        conn.close()
        return payment_id
    except Exception as e:
        print(f"Error creating payment: {e}")
        return None

# ==================== DELIVERY QUERIES ====================
def create_delivery(order_id, driver_id, delivery_address, estimated_time):
    """Create a new delivery record"""
    conn = get_db_connection()
    if not conn:
        return None
    
    try:
        # Calculate delivery fees
        delivery_fee_total = 3.99
        delivery_platform_cut = 0.60
        
        cursor = conn.cursor()
        query = """
            INSERT INTO DELIVERIES 
            (ORDER_ID, DRIVER_ID, ESTIMATED_TIME, DELIVERY_FEE_TOTAL, 
             DELIVERY_PLATFORM_CUT, DELIVERY_STATUS, ACTUAL_TIME)
            VALUES (%s, %s, %s, %s, %s, 'DELIVERED', NOW())
        """
        cursor.execute(query, (
            order_id, driver_id, estimated_time,
            delivery_fee_total, delivery_platform_cut
        ))
        conn.commit()
        delivery_id = cursor.lastrowid
        cursor.close()
        conn.close()
        return delivery_id
    except Exception as e:
        print(f"Error creating delivery: {e}")
        return None

# ==================== REVENUE REPORT QUERIES ====================

def get_revenue_details():
    """
    Get detailed revenue data (individual orders from INVESTOR_PROFIT_VIEW)
    Returns order-by-order profit breakdown
    """
    conn = get_db_connection()
    if not conn:
        return None
    
    cursor = conn.cursor(dictionary=True)
    
    try:
        query = """
            SELECT 
                ORDER_ID,
                RESTAURANT_NAME,
                ORDER_DATE,
                PLATFORM_COMMISSION,
                SERVICE_FEE,
                DELIVERY_PLATFORM_CUT,
                TOTAL_PLATFORM_PROFIT
            FROM INVESTOR_PROFIT_VIEW
            ORDER BY ORDER_DATE DESC
        """
        
        cursor.execute(query)
        results = cursor.fetchall()
        
        cursor.close()
        conn.close()
        
        return results
        
    except Exception as e:
        print(f"Error getting revenue details: {e}")
        cursor.close()
        conn.close()
        return None


def get_revenue_report():
    """Get revenue data with actual fees from database"""
    conn = get_db_connection()
    if not conn:
        return []
    
    cursor = conn.cursor(dictionary=True)
    
    query = """
        SELECT 
            r.RESTAURANT_NAME,
            COUNT(o.ORDER_ID) as TOTAL_ORDERS,
            SUM(o.TOTAL_AMOUNT) as TOTAL_REVENUE,
            AVG(o.TOTAL_AMOUNT) as AVG_ORDER_VALUE,
            COUNT(DISTINCT o.USER_ID) as UNIQUE_CUSTOMERS,
            SUM(o.PLATFORM_COMMISSION) as PLATFORM_COMMISSION,
            SUM(o.SERVICE_FEE) as SERVICE_FEES,
            SUM(COALESCE(d.DELIVERY_PLATFORM_CUT, 0)) as DELIVERY_PROFIT
        FROM ORDERS o
        JOIN RESTAURANT r ON o.RESTAURANT_ID = r.RESTAURANT_ID
        LEFT JOIN DELIVERIES d ON o.ORDER_ID = d.ORDER_ID
        WHERE o.STATUS = 'DELIVERED'
        GROUP BY r.RESTAURANT_ID, r.RESTAURANT_NAME
        ORDER BY TOTAL_REVENUE DESC
    """
    cursor.execute(query)
    report_data = cursor.fetchall()
    cursor.close()
    conn.close()
    return report_data

# ==================== DELIVERY QUERIES ====================

def get_delivery_by_order_id(order_id):
    """Get delivery information for an order"""
    conn = get_db_connection()
    if not conn:
        return None
    
    cursor = conn.cursor(dictionary=True)
    query = """
        SELECT 
            d.*,
            u.USER_NAME as DRIVER_NAME,
            u.PHONE as DRIVER_PHONE
        FROM DELIVERIES d
        LEFT JOIN USERS u ON d.DRIVER_ID = u.USER_ID
        WHERE d.ORDER_ID = %s
    """
    cursor.execute(query, (order_id,))
    delivery = cursor.fetchone()
    cursor.close()
    conn.close()
    return delivery

def get_delivery_by_id(delivery_id):
    """Get delivery by ID"""
    conn = get_db_connection()
    if not conn:
        return None
    
    cursor = conn.cursor(dictionary=True)
    query = """
        SELECT 
            d.*,
            u.USER_NAME as DRIVER_NAME,
            u.PHONE as DRIVER_PHONE,
            o.ORDER_ID,
            o.TOTAL_AMOUNT
        FROM DELIVERIES d
        LEFT JOIN USERS u ON d.DRIVER_ID = u.USER_ID
        LEFT JOIN ORDERS o ON d.ORDER_ID = o.ORDER_ID
        WHERE d.DELIVERY_ID = %s
    """
    cursor.execute(query, (delivery_id,))
    delivery = cursor.fetchone()
    cursor.close()
    conn.close()
    return delivery

def update_delivery_status(delivery_id, status):
    """Update delivery status"""
    conn = get_db_connection()
    if not conn:
        return False
    
    try:
        cursor = conn.cursor()
        query = """
            UPDATE DELIVERIES
            SET DELIVERY_STATUS = %s,
                ACTUAL_DELIVERY_TIME = CASE WHEN %s = 'DELIVERED' THEN NOW() ELSE ACTUAL_DELIVERY_TIME END
            WHERE DELIVERY_ID = %s
        """
        cursor.execute(query, (status, status, delivery_id))
        conn.commit()
        success = cursor.rowcount > 0
        cursor.close()
        conn.close()
        return success
    except Exception as e:
        print(f"Error updating delivery status: {e}")
        return False