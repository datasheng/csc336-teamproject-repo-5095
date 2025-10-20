import mysql.connector
from mysql.connector import Error

def get_db_connection():
    """Create and return database connection"""
    try:
        conn = mysql.connector.connect(
            host="restaurant-ordering-db.cloa0iio2j0o.us-east-2.rds.amazonaws.com",
            port=3306,
            user="admin",
            password="dbProject5095!",
            database="restaurant_ordering"
        )
        if conn.is_connected():
            print("✅ Successfully connected to database")
            return conn
    except Error as e:
        print(f"❌ Error connecting to database: {e}")
        return None

def test_connection():
    """Test database connection and show tables"""
    conn = get_db_connection()
    if conn:
        cursor = conn.cursor()
        cursor.execute("SHOW TABLES;")
        tables = cursor.fetchall()
        print("\n📊 Available tables:")
        for table in tables:
            print(f"   • {table[0]}")
        cursor.close()
        conn.close()
        return True
    return False

if __name__ == "__main__":
    print("🔍 Testing database connection...\n")
    test_connection()