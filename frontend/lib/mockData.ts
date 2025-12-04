// frontend/lib/mockData.ts

import {
  Restaurant,
  MenuItem,
  Order,
  OrderItem,
  Payment,
  Delivery,
  InvestorProfitView,
  RevenueMetrics,
  DailyRevenue,
  UserRole,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  DeliveryStatus
} from './types';

// ==================== MOCK RESTAURANTS ====================
// Matching database structure but with frontend display fields

export const mockRestaurants: Restaurant[] = [
  {
    RESTAURANT_ID: 1,
    OWNER_ID: 2,
    RESTAURANT_NAME: "Briccola",
    BUILDING_NUMBER: 123,
    STREET: "Lenox Avenue",
    CITY: "New York",
    STATE: "NY",
    ZIPCODE: 10027,
    PHONE: "(212) 555-0101",
    OWNER_NAME: "Maria Rossi",
    // Frontend display fields
    id: 1,
    name: "Briccola",
    image: "/images/briccola.jpg",
    description: "Authentic Italian cuisine with handmade pasta and wood-fired pizzas",
    cuisine: "Italian",
    rating: 4.8,
    deliveryTime: "30-45 min",
    deliveryFee: 2.99,
    isOpen: true
  },
  {
    RESTAURANT_ID: 2,
    OWNER_ID: 3,
    RESTAURANT_NAME: "Charles' Pan-Fried Chicken",
    BUILDING_NUMBER: 2841,
    STREET: "Frederick Douglass Blvd",
    CITY: "New York",
    STATE: "NY",
    ZIPCODE: 10039,
    PHONE: "(212) 555-0102",
    OWNER_NAME: "Charles Washington",
    // Frontend display fields
    id: 2,
    name: "Charles' Pan-Fried Chicken",
    image: "/images/charles_panfried_chicken.webp",
    description: "Famous soul food restaurant serving Harlem's best fried chicken since 1962",
    cuisine: "Soul Food",
    rating: 4.9,
    deliveryTime: "25-35 min",
    deliveryFee: 1.99,
    isOpen: true
  },
  {
    RESTAURANT_ID: 3,
    OWNER_ID: 4,
    RESTAURANT_NAME: "Fumo",
    BUILDING_NUMBER: 2156,
    STREET: "Frederick Douglass Blvd",
    CITY: "New York",
    STATE: "NY",
    ZIPCODE: 10026,
    PHONE: "(212) 555-0103",
    OWNER_NAME: "James Chen",
    // Frontend display fields
    id: 3,
    name: "Fumo",
    image: "/images/fumo.jpeg",
    description: "Modern Italian dining with creative cocktails and seasonal ingredients",
    cuisine: "Italian",
    rating: 4.7,
    deliveryTime: "35-50 min",
    deliveryFee: 3.99,
    isOpen: true
  },
  {
    RESTAURANT_ID: 4,
    OWNER_ID: 5,
    RESTAURANT_NAME: "Clove",
    BUILDING_NUMBER: 341,
    STREET: "West 145th Street",
    CITY: "New York",
    STATE: "NY",
    ZIPCODE: 10031,
    PHONE: "(212) 555-0104",
    OWNER_NAME: "Sarah Johnson",
    // Frontend display fields
    id: 4,
    name: "Clove",
    image: "/images/clove.webp",
    description: "Contemporary Indian cuisine with authentic and bold flavors",
    cuisine: "Indian",
    rating: 4.6,
    deliveryTime: "40-55 min",
    deliveryFee: 2.99,
    isOpen: false
  },
  {
    RESTAURANT_ID: 5,
    OWNER_ID: 6,
    RESTAURANT_NAME: "Burger & Shake",
    BUILDING_NUMBER: 2300,
    STREET: "Adam Clayton Powell Jr Blvd",
    CITY: "New York",
    STATE: "NY",
    ZIPCODE: 10030,
    PHONE: "(212) 555-0105",
    OWNER_NAME: "Mike Thompson",
    // Frontend display fields
    id: 5,
    name: "Burger & Shake",
    image: "/images/burger_and_shake.jpg",
    description: "Classic American burgers and hand-spun milkshakes",
    cuisine: "American",
    rating: 4.5,
    deliveryTime: "20-30 min",
    deliveryFee: 1.99,
    isOpen: true
  },
  {
    RESTAURANT_ID: 6,
    OWNER_ID: 7,
    RESTAURANT_NAME: "Cafe One",
    BUILDING_NUMBER: 2790,
    STREET: "Broadway",
    CITY: "New York",
    STATE: "NY",
    ZIPCODE: 10025,
    PHONE: "(212) 555-0106",
    OWNER_NAME: "Lisa Martinez",
    // Frontend display fields
    id: 6,
    name: "Cafe One",
    image: "/images/cafe_one.avif",
    description: "Cozy cafe serving fresh pastries, sandwiches, and specialty coffee",
    cuisine: "Cafe",
    rating: 4.4,
    deliveryTime: "15-25 min",
    deliveryFee: 0.99,
    isOpen: true
  }
];

// ==================== MOCK MENU ITEMS ====================

export const mockMenuItems: MenuItem[] = [
  // Briccola (Italian)
  {
    MENU_ITEM_ID: 1,
    ITEM_NAME: "Margherita Pizza",
    ITEM_DESCRIP: "Classic pizza with San Marzano tomatoes, fresh mozzarella, and basil",
    PRICE: 16.99,
    RESTAURANT_ID: 1
  },
  {
    MENU_ITEM_ID: 2,
    ITEM_NAME: "Rigatoni Carbonara",
    ITEM_DESCRIP: "House-made rigatoni with guanciale, pecorino, and black pepper",
    PRICE: 22.99,
    RESTAURANT_ID: 1
  },
  {
    MENU_ITEM_ID: 3,
    ITEM_NAME: "Burrata Caprese",
    ITEM_DESCRIP: "Creamy burrata with heirloom tomatoes, basil, and aged balsamic",
    PRICE: 14.99,
    RESTAURANT_ID: 1
  },
  // Charles' Pan-Fried Chicken
  {
    MENU_ITEM_ID: 4,
    ITEM_NAME: "Pan-Fried Chicken",
    ITEM_DESCRIP: "Signature crispy fried chicken with secret seasoning blend",
    PRICE: 18.99,
    RESTAURANT_ID: 2
  },
  {
    MENU_ITEM_ID: 5,
    ITEM_NAME: "Collard Greens",
    ITEM_DESCRIP: "Traditional Southern-style collard greens slow-cooked with smoked turkey",
    PRICE: 6.99,
    RESTAURANT_ID: 2
  },
  {
    MENU_ITEM_ID: 6,
    ITEM_NAME: "Mac & Cheese",
    ITEM_DESCRIP: "Creamy five-cheese mac and cheese baked to perfection",
    PRICE: 8.99,
    RESTAURANT_ID: 2
  },
  // Fumo
  {
    MENU_ITEM_ID: 7,
    ITEM_NAME: "Lamb Ragu",
    ITEM_DESCRIP: "Slow-braised lamb with pappardelle pasta and rosemary",
    PRICE: 26.99,
    RESTAURANT_ID: 3
  },
  {
    MENU_ITEM_ID: 8,
    ITEM_NAME: "Grilled Branzino",
    ITEM_DESCRIP: "Mediterranean sea bass with lemon, herbs, and olive oil",
    PRICE: 32.99,
    RESTAURANT_ID: 3
  },
  // Burger & Shake
  {
    MENU_ITEM_ID: 9,
    ITEM_NAME: "Classic Burger",
    ITEM_DESCRIP: "Angus beef patty with lettuce, tomato, onion, and special sauce",
    PRICE: 12.99,
    RESTAURANT_ID: 5
  },
  {
    MENU_ITEM_ID: 10,
    ITEM_NAME: "Chocolate Shake",
    ITEM_DESCRIP: "Hand-spun chocolate milkshake with whipped cream",
    PRICE: 5.99,
    RESTAURANT_ID: 5
  }
];

// ==================== MOCK ORDERS WITH PROFIT TRACKING ====================

export const mockOrders: Order[] = [
  {
    ORDER_ID: 1,
    USER_ID: 1,
    RESTAURANT_ID: 1,
    ORDER_DATE: "2024-12-01T18:30:00Z",
    STATUS: "DELIVERED",
    TOTAL_AMOUNT: 54.97,
    PLATFORM_COMMISSION: 8.25, // 15% of total
    SERVICE_FEE: 2.99,
    PLATFORM_PROFIT_ORDER: 11.24, // Commission + Service Fee
    USER_NAME: "John Doe",
    RESTAURANT_NAME: "Briccola"
  },
  {
    ORDER_ID: 2,
    USER_ID: 2,
    RESTAURANT_ID: 2,
    ORDER_DATE: "2024-12-01T19:15:00Z",
    STATUS: "DELIVERED",
    TOTAL_AMOUNT: 34.97,
    PLATFORM_COMMISSION: 5.25,
    SERVICE_FEE: 2.99,
    PLATFORM_PROFIT_ORDER: 8.24,
    USER_NAME: "Jane Smith",
    RESTAURANT_NAME: "Charles' Pan-Fried Chicken"
  },
  {
    ORDER_ID: 3,
    USER_ID: 3,
    RESTAURANT_ID: 3,
    ORDER_DATE: "2024-12-02T12:00:00Z",
    STATUS: "OUT_FOR_DELIVERY",
    TOTAL_AMOUNT: 59.98,
    PLATFORM_COMMISSION: 9.00,
    SERVICE_FEE: 2.99,
    PLATFORM_PROFIT_ORDER: 11.99,
    USER_NAME: "Michael Brown",
    RESTAURANT_NAME: "Fumo"
  },
  {
    ORDER_ID: 4,
    USER_ID: 1,
    RESTAURANT_ID: 5,
    ORDER_DATE: "2024-12-02T20:30:00Z",
    STATUS: "PREPARING",
    TOTAL_AMOUNT: 18.98,
    PLATFORM_COMMISSION: 2.85,
    SERVICE_FEE: 2.99,
    PLATFORM_PROFIT_ORDER: 5.84,
    USER_NAME: "John Doe",
    RESTAURANT_NAME: "Burger & Shake"
  },
  {
    ORDER_ID: 5,
    USER_ID: 4,
    RESTAURANT_ID: 1,
    ORDER_DATE: "2024-12-03T13:45:00Z",
    STATUS: "CONFIRMED",
    TOTAL_AMOUNT: 39.98,
    PLATFORM_COMMISSION: 6.00,
    SERVICE_FEE: 2.99,
    PLATFORM_PROFIT_ORDER: 8.99,
    USER_NAME: "Sarah Wilson",
    RESTAURANT_NAME: "Briccola"
  }
];

// ==================== MOCK DELIVERIES WITH PROFIT TRACKING ====================

export const mockDeliveries: Delivery[] = [
  {
    DELIVERY_ID: 1,
    ORDER_ID: 1,
    DRIVER_ID: 8,
    DELIVERY_STATUS: "DELIVERED",
    ESTIMATED_TIME: "2024-12-01T19:15:00Z",
    ACTUAL_TIME: "2024-12-01T19:10:00Z",
    DELIVERY_FEE_TOTAL: 5.99,
    DELIVERY_PLATFORM_CUT: 1.80 // Platform keeps 30% of delivery fee
  },
  {
    DELIVERY_ID: 2,
    ORDER_ID: 2,
    DRIVER_ID: 9,
    DELIVERY_STATUS: "DELIVERED",
    ESTIMATED_TIME: "2024-12-01T20:00:00Z",
    ACTUAL_TIME: "2024-12-01T19:55:00Z",
    DELIVERY_FEE_TOTAL: 5.99,
    DELIVERY_PLATFORM_CUT: 1.80
  },
  {
    DELIVERY_ID: 3,
    ORDER_ID: 3,
    DRIVER_ID: 8,
    DELIVERY_STATUS: "IN_TRANSIT",
    ESTIMATED_TIME: "2024-12-02T12:45:00Z",
    ACTUAL_TIME: null,
    DELIVERY_FEE_TOTAL: 5.99,
    DELIVERY_PLATFORM_CUT: 1.80
  }
];

// ==================== MOCK INVESTOR PROFIT VIEW ====================
// This is CRITICAL for the presentation - shows platform profitability

export const mockInvestorProfitData: InvestorProfitView[] = [
  {
    ORDER_ID: 1,
    RESTAURANT_NAME: "Briccola",
    ORDER_DATE: "2024-12-01T18:30:00Z",
    PLATFORM_COMMISSION: 8.25,
    SERVICE_FEE: 2.99,
    DELIVERY_PLATFORM_CUT: 1.80,
    TOTAL_PLATFORM_PROFIT: 13.04 // Commission + Service Fee + Delivery Cut
  },
  {
    ORDER_ID: 2,
    RESTAURANT_NAME: "Charles' Pan-Fried Chicken",
    ORDER_DATE: "2024-12-01T19:15:00Z",
    PLATFORM_COMMISSION: 5.25,
    SERVICE_FEE: 2.99,
    DELIVERY_PLATFORM_CUT: 1.80,
    TOTAL_PLATFORM_PROFIT: 10.04
  },
  {
    ORDER_ID: 3,
    RESTAURANT_NAME: "Fumo",
    ORDER_DATE: "2024-12-02T12:00:00Z",
    PLATFORM_COMMISSION: 9.00,
    SERVICE_FEE: 2.99,
    DELIVERY_PLATFORM_CUT: 1.80,
    TOTAL_PLATFORM_PROFIT: 13.79
  },
  {
    ORDER_ID: 4,
    RESTAURANT_NAME: "Burger & Shake",
    ORDER_DATE: "2024-12-02T20:30:00Z",
    PLATFORM_COMMISSION: 2.85,
    SERVICE_FEE: 2.99,
    DELIVERY_PLATFORM_CUT: 1.80,
    TOTAL_PLATFORM_PROFIT: 7.64
  },
  {
    ORDER_ID: 5,
    RESTAURANT_NAME: "Briccola",
    ORDER_DATE: "2024-12-03T13:45:00Z",
    PLATFORM_COMMISSION: 6.00,
    SERVICE_FEE: 2.99,
    DELIVERY_PLATFORM_CUT: 1.80,
    TOTAL_PLATFORM_PROFIT: 10.79
  }
];

// ==================== REVENUE METRICS FOR DASHBOARD ====================

export const mockRevenueMetrics: RevenueMetrics = {
  totalRevenue: 208.88, // Sum of all order totals
  totalOrders: 5,
  platformCommission: 31.35, // Sum of all commissions
  serviceFees: 14.95, // Sum of all service fees
  deliveryRevenue: 9.00, // Sum of all delivery platform cuts
  platformProfit: 55.30, // Total platform profit
  averageOrderValue: 41.78 // Average order size
};

// ==================== DAILY REVENUE FOR CHARTS ====================

export const mockDailyRevenue: DailyRevenue[] = [
  {
    date: "2024-11-25",
    revenue: 156.50,
    orders: 4,
    commission: 23.48,
    serviceFee: 11.96,
    deliveryProfit: 7.20,
    totalProfit: 42.64
  },
  {
    date: "2024-11-26",
    revenue: 189.75,
    orders: 5,
    commission: 28.46,
    serviceFee: 14.95,
    deliveryProfit: 9.00,
    totalProfit: 52.41
  },
  {
    date: "2024-11-27",
    revenue: 234.20,
    orders: 6,
    commission: 35.13,
    serviceFee: 17.94,
    deliveryProfit: 10.80,
    totalProfit: 63.87
  },
  {
    date: "2024-11-28",
    revenue: 178.90,
    orders: 4,
    commission: 26.84,
    serviceFee: 11.96,
    deliveryProfit: 7.20,
    totalProfit: 46.00
  },
  {
    date: "2024-11-29",
    revenue: 298.45,
    orders: 8,
    commission: 44.77,
    serviceFee: 23.92,
    deliveryProfit: 14.40,
    totalProfit: 83.09
  },
  {
    date: "2024-11-30",
    revenue: 212.60,
    orders: 5,
    commission: 31.89,
    serviceFee: 14.95,
    deliveryProfit: 9.00,
    totalProfit: 55.84
  },
  {
    date: "2024-12-01",
    revenue: 89.94,
    orders: 2,
    commission: 13.50,
    serviceFee: 5.98,
    deliveryProfit: 3.60,
    totalProfit: 23.08
  },
  {
    date: "2024-12-02",
    revenue: 78.96,
    orders: 2,
    commission: 11.85,
    serviceFee: 5.98,
    deliveryProfit: 3.60,
    totalProfit: 21.43
  },
  {
    date: "2024-12-03",
    revenue: 39.98,
    orders: 1,
    commission: 6.00,
    serviceFee: 2.99,
    deliveryProfit: 1.80,
    totalProfit: 10.79
  }
];

// ==================== HELPER FUNCTIONS ====================

export function getRestaurantById(id: number): Restaurant | undefined {
  return mockRestaurants.find(r => r.RESTAURANT_ID === id || r.id === id);
}

export function getMenuItemsByRestaurant(restaurantId: number): MenuItem[] {
  return mockMenuItems.filter(m => m.RESTAURANT_ID === restaurantId);
}

export function getOrdersByUser(userId: number): Order[] {
  return mockOrders.filter(o => o.USER_ID === userId);
}

export function calculateTotalProfit(): number {
  return mockInvestorProfitData.reduce((sum, item) => sum + item.TOTAL_PLATFORM_PROFIT, 0);
}

export function getRevenueByDateRange(startDate: string, endDate: string): DailyRevenue[] {
  return mockDailyRevenue.filter(d => d.date >= startDate && d.date <= endDate);
}