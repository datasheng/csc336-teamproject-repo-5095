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
    estimated_time = datetime.now() + timedelta(minutes=30)
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

# ==================== GET MENU ITEM BY ID ====================
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

def create_order(user_id, restaurant_id, total_amount):
    """Create a new order"""
    conn = get_db_connection()
    if not conn:
        return None
    
    try:
        cursor = conn.cursor()
        query = """
            INSERT INTO ORDERS (USER_ID, RESTAURANT_ID, TOTAL_AMOUNT)
            VALUES (%s, %s, %s)
        """
        cursor.execute(query, (user_id, restaurant_id, total_amount))
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
    """Get complete order details with items"""
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

# ==================== CREATE DELIVERY ====================

def create_delivery(order_id, driver_id, delivery_address, estimated_time):
    """Create a new delivery record"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        query = """
            INSERT INTO DELIVERIES 
            (ORDER_ID, DRIVER_ID, DELIVERY_ADDRESS, ESTIMATED_DELIVERY_TIME, STATUS)
            VALUES (%s, %s, %s, %s, 'ASSIGNED')
        """
        
        cursor.execute(query, (order_id, driver_id, delivery_address, estimated_time))
        conn.commit()
        
        delivery_id = cursor.lastrowid
        cursor.close()
        conn.close()
        
        return delivery_id
        
    except mysql.connector.Error as err:
        print(f"Database Error: {err}")
        return None

# ==================== REVENUE REPORT QUERIES ====================

def get_revenue_report():
    """Get revenue data for Excel export (MANDATORY feature)"""
    conn = get_db_connection()
    if not conn:
        return []
    
    cursor = conn.cursor(dictionary=True)

    query = """
        SELECT 
            r.RESTAURANT_NAME,
            COUNT(DISTINCT o.ORDER_ID) as TOTAL_ORDERS,
            SUM(o.TOTAL_AMOUNT) as TOTAL_REVENUE,
            AVG(o.TOTAL_AMOUNT) as AVG_ORDER_VALUE,
            COUNT(DISTINCT o.USER_ID) as UNIQUE_CUSTOMERS
        FROM ORDERS o
        JOIN RESTAURANT r ON o.RESTAURANT_ID = r.RESTAURANT_ID
        JOIN PAYMENTS p ON o.ORDER_ID = p.ORDER_ID
        WHERE p.STATUS = 'COMPLETED'
        GROUP BY r.RESTAURANT_ID, r.RESTAURANT_NAME
        ORDER BY TOTAL_REVENUE DESC
    """
    cursor.execute(query)
    report_data = cursor.fetchall()
    cursor.close()
    conn.close()
    return report_data