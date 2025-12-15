# backend/populate_for_tableau.py
from database.connection import get_db_connection
import random
from datetime import datetime, timedelta
from decimal import Decimal

def populate_database():
    """Add data matching Krista's updated schema for Tableau dashboard"""

    conn = get_db_connection()
    cursor = conn.cursor()

    print("🚀 Populating database with Krista's new schema...\n")
    print("=" * 70)

    cursor.execute("SELECT COUNT(*) FROM USERS")
    user_count = cursor.fetchone()[0]
    print(f"\n👥 Users: {user_count} found ✅")

    cursor.execute("SELECT COUNT(*) FROM RESTAURANT")
    restaurant_count = cursor.fetchone()[0]
    print(f"🍽️  Restaurants: {restaurant_count} found ✅")

    cursor.execute("SELECT COUNT(*) FROM MENU")
    menu_count = cursor.fetchone()[0]

    if menu_count == 0:
        print("\n🍕 Adding menu items...")

        cursor.execute("SELECT RESTAURANT_ID FROM RESTAURANT ORDER BY RESTAURANT_ID")
        restaurants = [row[0] for row in cursor.fetchall()]

        menu_items = [
            (restaurants[0], "Margherita Pizza", "Fresh mozzarella, basil", 16.99),
            (restaurants[0], "Rigatoni Bolognese", "Slow-cooked meat sauce", 22.99),
            (restaurants[0], "Burrata", "Creamy burrata", 18.99),
            (restaurants[1], "Fried Chicken", "Crispy fried chicken", 28.00),
            (restaurants[1], "Shrimp & Grits", "Jumbo shrimp with grits", 32.00),
            (restaurants[1], "Meatballs", "Swedish meatballs", 24.00),
            (restaurants[2], "Soul Platter", "Chicken, mac, collards", 26.99),
            (restaurants[2], "BBQ Ribs", "Slow-cooked ribs", 29.99),
            (restaurants[2], "Catfish & Grits", "Pan-fried catfish", 24.99),
            (restaurants[3], "Chicken & Waffles", "Crispy chicken, waffles", 19.99),
            (restaurants[3], "Shrimp & Waffles", "Jumbo shrimp, waffles", 23.99),
            (restaurants[3], "Salmon Croquettes", "House-made salmon", 21.99),
            (restaurants[4], "Jerk Chicken", "Spicy jerk chicken", 22.00),
            (restaurants[4], "Oxtail Stew", "Braised oxtail", 28.00),
            (restaurants[4], "Curry Goat", "Tender goat curry", 25.00),
        ]

        for item in menu_items:
            cursor.execute(
                """
                INSERT INTO MENU (RESTAURANT_ID, ITEM_NAME, ITEM_DESCRIP, PRICE)
                VALUES (%s, %s, %s, %s)
                """,
                item,
            )

        print(f"   ✅ Added {len(menu_items)} items")
        conn.commit()
    else:
        print(f"\n🍕 Menu: {menu_count} items found (skipping)")

    print("\n📦 Generating 60 orders (with profit tracking)...")

    cursor.execute("SELECT RESTAURANT_ID FROM RESTAURANT")
    restaurants = [row[0] for row in cursor.fetchall()]

    cursor.execute("SELECT USER_ID FROM USERS WHERE ROLES = 'customer'")
    customers = [row[0] for row in cursor.fetchall()]

    cursor.execute("SELECT USER_ID FROM USERS WHERE ROLES = 'driver'")
    drivers = [row[0] for row in cursor.fetchall()]
    if not drivers:
        drivers = customers

    payment_methods = ["credit_card", "debit_card", "cash"]
    statuses = ["DELIVERED", "DELIVERED", "DELIVERED", "CANCELLED"]

    COMMISSION_RATE = Decimal("0.15")
    SERVICE_FEE = Decimal("2.99")
    DELIVERY_FEE_TOTAL = Decimal("3.99")
    DELIVERY_PLATFORM_RATE = Decimal("0.15")
    DELIVERY_PLATFORM_CUT = (DELIVERY_FEE_TOTAL * DELIVERY_PLATFORM_RATE).quantize(Decimal("0.01"))

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
                (restaurant_id,),
            )
            restaurant_menu = cursor.fetchall()
            if not restaurant_menu:
                continue

            num_items = random.randint(1, 3)
            order_total = Decimal("0.00")

            chosen_items = []
            for _ in range(num_items):
                menu_item_id, price_raw = random.choice(restaurant_menu)
                price = Decimal(str(price_raw))
                quantity = random.randint(1, 2)
                chosen_items.append((menu_item_id, quantity, price))
                order_total += price * quantity

            order_total = order_total.quantize(Decimal("0.01"))

            is_delivered = status == "DELIVERED"

            if is_delivered:
                platform_commission = (order_total * COMMISSION_RATE).quantize(Decimal("0.01"))
                service_fee = SERVICE_FEE
                delivery_fee_total = DELIVERY_FEE_TOTAL
                delivery_platform_cut = DELIVERY_PLATFORM_CUT
                platform_profit_order = (platform_commission + service_fee + delivery_platform_cut).quantize(Decimal("0.01"))
            else:
                platform_commission = Decimal("0.00")
                service_fee = Decimal("0.00")
                delivery_fee_total = Decimal("0.00")
                delivery_platform_cut = Decimal("0.00")
                platform_profit_order = Decimal("0.00")

            cursor.execute(
                """
                INSERT INTO ORDERS
                (USER_ID, RESTAURANT_ID, ORDER_DATE, STATUS, TOTAL_AMOUNT,
                 PLATFORM_COMMISSION, SERVICE_FEE, PLATFORM_PROFIT_ORDER)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                """,
                (
                    customer_id,
                    restaurant_id,
                    order_date,
                    status,
                    order_total,
                    platform_commission,
                    service_fee,
                    platform_profit_order,
                ),
            )

            order_id = cursor.lastrowid

            if is_delivered:
                for menu_item_id, quantity, price in chosen_items:
                    cursor.execute(
                        """
                        INSERT INTO ORDER_ITEMS (ORDER_ID, MENU_ITEM_ID, QUANTITY, PRICE)
                        VALUES (%s, %s, %s, %s)
                        """,
                        (order_id, menu_item_id, quantity, price),
                    )

                cursor.execute(
                    """
                    INSERT INTO PAYMENTS (ORDER_ID, AMOUNT, METHOD, STATUS, PAYMENT_DATE)
                    VALUES (%s, %s, %s, 'COMPLETED', %s)
                    """,
                    (order_id, order_total, random.choice(payment_methods), order_date),
                )

                driver_id = random.choice(drivers)
                estimated = order_date + timedelta(minutes=30)
                actual = order_date + timedelta(minutes=random.randint(25, 45))

                cursor.execute(
                    """
                    INSERT INTO DELIVERIES
                    (ORDER_ID, DRIVER_ID, DELIVERY_STATUS, ESTIMATED_TIME, ACTUAL_TIME,
                     DELIVERY_FEE_TOTAL, DELIVERY_PLATFORM_CUT)
                    VALUES (%s, %s, %s, %s, %s, %s, %s)
                    """,
                    (
                        order_id,
                        driver_id,
                        "DELIVERED",
                        estimated,
                        actual,
                        delivery_fee_total,
                        delivery_platform_cut,
                    ),
                )
            else:
                cursor.execute(
                    """
                    INSERT INTO PAYMENTS (ORDER_ID, AMOUNT, METHOD, STATUS, PAYMENT_DATE)
                    VALUES (%s, %s, %s, 'CANCELLED', %s)
                    """,
                    (order_id, Decimal("0.00"), random.choice(payment_methods), order_date),
                )

            orders_created += 1

            if orders_created % 10 == 0:
                print(f"   ✅ {orders_created}/60 orders...")
                conn.commit()

        except Exception as e:
            print(f"   ⚠️  Order {i+1}: {str(e)[:120]}")
            conn.rollback()

    conn.commit()

    print("\n" + "=" * 70)
    print("✅ DATABASE POPULATED!\n")

    cursor.execute("SELECT COUNT(*) FROM USERS")
    print(f"👥 Users: {cursor.fetchone()[0]}")

    cursor.execute("SELECT COUNT(*) FROM RESTAURANT")
    print(f"🍽️  Restaurants: {cursor.fetchone()[0]}")

    cursor.execute("SELECT COUNT(*) FROM MENU")
    print(f"🍕 Menu Items: {cursor.fetchone()[0]}")

    cursor.execute("SELECT COUNT(*) FROM ORDERS")
    print(f"📦 Orders: {cursor.fetchone()[0]}")

    cursor.execute("SELECT COUNT(*) FROM ORDER_ITEMS")
    print(f"🛒 Order Items: {cursor.fetchone()[0]}")

    cursor.execute("SELECT COUNT(*) FROM PAYMENTS")
    print(f"💳 Payments: {cursor.fetchone()[0]}")

    cursor.execute("SELECT COUNT(*) FROM DELIVERIES")
    print(f"🚗 Deliveries: {cursor.fetchone()[0]}")

    print("\n💰 INVESTOR_PROFIT_VIEW:")
    cursor.execute("SELECT COUNT(*) FROM INVESTOR_PROFIT_VIEW")
    view_count = cursor.fetchone()[0]
    print(f"   📊 {view_count} rows for Tableau")

    if view_count > 0:
        cursor.execute("SELECT SUM(TOTAL_PLATFORM_PROFIT) FROM INVESTOR_PROFIT_VIEW")
        total_profit = cursor.fetchone()[0]
        if total_profit is not None:
            print(f"   💵 Total Platform Profit: ${total_profit}")

    print("\n🎉 Krista's Tableau dashboard is ready!")
    print("=" * 70 + "\n")

    cursor.close()
    conn.close()

if __name__ == "__main__":
    populate_database()
