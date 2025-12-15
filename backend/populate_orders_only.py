# backend/populate_orders_only.py
from database.connection import get_db_connection
import random
from datetime import datetime, timedelta
from decimal import Decimal

def populate_orders_only():
    """Add orders and payments only (skip deliveries to avoid trigger issue)"""
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    print("🚀 Populating orders (without deliveries to avoid trigger)...\n")
    print("=" * 70)
    
    cursor.execute("SELECT RESTAURANT_ID FROM RESTAURANT")
    restaurants = [row[0] for row in cursor.fetchall()]
    
    cursor.execute("SELECT USER_ID FROM USERS WHERE ROLES = 'customer'")
    customers = [row[0] for row in cursor.fetchall()]
    if not customers:
        cursor.execute("SELECT USER_ID FROM USERS LIMIT 5")
        customers = [row[0] for row in cursor.fetchall()]
    
    payment_methods = ['credit_card', 'debit_card', 'cash']
    statuses = ['PENDING', 'CONFIRMED', 'PREPARING']  # Don't use DELIVERED (no delivery yet)
    
    orders_created = 0
    
    for i in range(60):
        try:
            days_ago = random.randint(0, 30)
            order_date = datetime.now() - timedelta(days=days_ago)
            
            restaurant_id = random.choice(restaurants)
            customer_id = random.choice(customers)
            status = random.choice(statuses)
            
            cursor.execute(
                "SELECT MENU_ITEM_ID, PRICE FROM MENU WHERE RESTAURANT_ID = %s", 
                (restaurant_id,)
            )
            restaurant_menu = cursor.fetchall()
            
            if not restaurant_menu:
                continue
            
            num_items = random.randint(1, 3)
            order_total = Decimal('0.00')
            
            for _ in range(num_items):
                menu_item = random.choice(restaurant_menu)
                price = Decimal(str(menu_item[1]))
                quantity = random.randint(1, 2)
                order_total += price * quantity
            
            platform_commission = (order_total * Decimal('0.10')).quantize(Decimal('0.01'))
            service_fee = Decimal('2.99')
            platform_profit_order = (platform_commission + service_fee).quantize(Decimal('0.01'))
            
            # Insert order
            cursor.execute("""
                INSERT INTO ORDERS 
                (USER_ID, RESTAURANT_ID, ORDER_DATE, STATUS, TOTAL_AMOUNT, 
                 PLATFORM_COMMISSION, SERVICE_FEE, PLATFORM_PROFIT_ORDER)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """, (customer_id, restaurant_id, order_date, status, order_total,
                  platform_commission, service_fee, platform_profit_order))
            
            order_id = cursor.lastrowid
            
            # Insert order items
            for _ in range(num_items):
                menu_item = random.choice(restaurant_menu)
                menu_item_id = menu_item[0]
                price = Decimal(str(menu_item[1]))
                quantity = random.randint(1, 2)
                
                cursor.execute("""
                    INSERT INTO ORDER_ITEMS (ORDER_ID, MENU_ITEM_ID, QUANTITY, PRICE)
                    VALUES (%s, %s, %s, %s)
                """, (order_id, menu_item_id, quantity, price))
            
            # Insert payment
            cursor.execute("""
                INSERT INTO PAYMENTS (ORDER_ID, AMOUNT, METHOD, STATUS, PAYMENT_DATE)
                VALUES (%s, %s, %s, 'COMPLETED', %s)
            """, (order_id, order_total, random.choice(payment_methods), order_date))
            
            # SKIP DELIVERIES (that's what's causing the trigger error)
            
            orders_created += 1
            
            if orders_created % 10 == 0:
                print(f"   ✅ {orders_created}/60 orders...")
                conn.commit()
                
        except Exception as e:
            print(f"   ⚠️  Order {i+1}: {str(e)[:80]}")
            conn.rollback()
    
    conn.commit()
    
    print("\n" + "=" * 70)
    print("✅ PARTIAL DATA POPULATED!\n")
    
    cursor.execute("SELECT COUNT(*) FROM ORDERS")
    print(f"📦 Orders: {cursor.fetchone()[0]}")
    
    cursor.execute("SELECT COUNT(*) FROM ORDER_ITEMS")
    print(f"🛒 Order Items: {cursor.fetchone()[0]}")
    
    cursor.execute("SELECT COUNT(*) FROM PAYMENTS")
    print(f"💳 Payments: {cursor.fetchone()[0]}")
    
    print("\n⚠️  Note: Deliveries skipped due to trigger issue")
    print("TRIGGER_NEW_DELIVERY")
    print("\n📊 This should give SOME data for Tableau testing")
    print("=" * 70 + "\n")
    
    cursor.close()
    conn.close()

if __name__ == "__main__":
    populate_orders_only()

    