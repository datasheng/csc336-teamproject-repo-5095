// frontend/lib/types.ts
// TypeScript types matching database schema EXACTLY

// ==================== DATABASE ENUMS ====================

export type UserRole = 'customer' | 'restaurant_owner' | 'driver';

export type OrderStatus = 
  | 'PENDING' 
  | 'CONFIRMED' 
  | 'PREPARING' 
  | 'OUT_FOR_DELIVERY' 
  | 'DELIVERED' 
  | 'CANCELLED';

export type PaymentMethod = 'CREDIT_CARD' | 'DEBIT_CARD' | 'PAYPAL' | 'CASH';

export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';

export type DeliveryStatus = 
  | 'ASSIGNED' 
  | 'PICKED_UP' 
  | 'IN_TRANSIT' 
  | 'DELIVERED' 
  | 'FAILED';

// ==================== DATABASE TABLES ====================

// USERS TABLE
export interface User {
  USER_ID: number;
  USER_NAME: string;
  PASS_WORD: string; // Don't expose this to frontend usually
  EMAIL: string;
  PHONE: string;
  ROLES: UserRole;
  ACCOUNT_CREATED_AT: string; // ISO date string
}

// Safe user (without password)
export interface UserSafe extends Omit<User, 'PASS_WORD'> {}

// RESTAURANT TABLE
export interface Restaurant {
  RESTAURANT_ID: number;
  OWNER_ID: number;
  RESTAURANT_NAME: string;
  BUILDING_NUMBER: number | null;
  STREET: string | null;
  CITY: string | null;
  STATE: string | null;
  ZIPCODE: number | null;
  PHONE: string | null;
  // Fields from JOIN
  OWNER_NAME?: string;
  
  // Frontend display fields (for mock data or API transformation)
  id?: number;
  name?: string;
  image?: string;
  description?: string;
  cuisine?: string;
  rating?: number;
  deliveryTime?: string;
  deliveryFee?: number;
  isOpen?: boolean;
}

// MENU TABLE
export interface MenuItem {
  MENU_ITEM_ID: number;
  ITEM_NAME: string;
  ITEM_DESCRIP: string | null;
  PRICE: number;
  RESTAURANT_ID: number;
}

// ORDERS TABLE
export interface Order {
  ORDER_ID: number;
  USER_ID: number;
  RESTAURANT_ID: number;
  ORDER_DATE: string; // ISO date string
  STATUS: OrderStatus;
  TOTAL_AMOUNT: number;
  PLATFORM_COMMISSION: number | null;
  SERVICE_FEE: number | null;
  PLATFORM_PROFIT_ORDER: number | null;
  // Fields from JOIN
  USER_NAME?: string;
  RESTAURANT_NAME?: string;
}

// ORDER_ITEMS TABLE
export interface OrderItem {
  ORDER_ITEM_ID: number;
  ORDER_ID: number;
  MENU_ITEM_ID: number;
  QUANTITY: number;
  PRICE: number;
  // Fields from JOIN
  ITEM_NAME?: string;
  ITEM_DESCRIP?: string;
}

// PAYMENTS TABLE
export interface Payment {
  PAYMENT_ID: number;
  ORDER_ID: number;
  AMOUNT: number;
  METHOD: PaymentMethod;
  STATUS: PaymentStatus;
  PAYMENT_DATE: string; // ISO date string
}

// DELIVERIES TABLE
export interface Delivery {
  DELIVERY_ID: number;
  ORDER_ID: number;
  DRIVER_ID: number;
  DELIVERY_STATUS: DeliveryStatus;
  ESTIMATED_TIME: string | null; // ISO date string
  ACTUAL_TIME: string | null; // ISO date string
  DELIVERY_FEE_TOTAL: number | null;
  DELIVERY_PLATFORM_CUT: number | null;
}

// ==================== VIEWS ====================

// INVESTOR_PROFIT_VIEW
export interface InvestorProfitView {
  ORDER_ID: number;
  RESTAURANT_NAME: string;
  ORDER_DATE: string;
  PLATFORM_COMMISSION: number;
  SERVICE_FEE: number;
  DELIVERY_PLATFORM_CUT: number | null;
  TOTAL_PLATFORM_PROFIT: number;
}

// ==================== COMPOSITE TYPES (with JOINs) ====================

// Restaurant with menu items
export interface RestaurantWithMenu extends Restaurant {
  menu_items: MenuItem[];
}

// Order with all related data
export interface OrderWithDetails extends Order {
  items: OrderItem[];
  delivery?: Delivery;
  payment?: Payment;
}

// ==================== API REQUEST/RESPONSE TYPES ====================

// Registration request
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  phone: string;
  role?: UserRole;
}

// Login request
export interface LoginRequest {
  email: string;
  password: string;
}

// Auth response
export interface AuthResponse {
  success: boolean;
  message: string;
  user_id?: number;
  access_token?: string;
}

// Order creation request
export interface CreateOrderRequest {
  RESTAURANT_ID: number;
  USER_ID: number;
  items: Array<{
    MENU_ITEM_ID: number;
    QUANTITY: number;
    PRICE: number;
  }>;
  PAYMENT_METHOD: PaymentMethod;
}

// Order creation response
export interface CreateOrderResponse {
  success: boolean;
  ORDER_ID: number;
  TOTAL_AMOUNT: number;
  message: string;
}

// ==================== DASHBOARD/REPORT TYPES ====================

// Revenue metrics for dashboard
export interface RevenueMetrics {
  totalRevenue: number;
  totalOrders: number;
  platformCommission: number;
  serviceFees: number;
  deliveryRevenue: number;
  platformProfit: number;
  averageOrderValue: number;
}

// Daily revenue data for charts
export interface DailyRevenue {
  date: string;
  revenue: number;
  orders: number;
  commission: number;
  serviceFee: number;
  deliveryProfit: number;
  totalProfit: number;
}

// Restaurant performance metrics
export interface RestaurantMetrics {
  RESTAURANT_ID: number;
  RESTAURANT_NAME: string;
  TOTAL_ORDERS: number;
  TOTAL_REVENUE: number;
  AVG_ORDER_VALUE: number;
  UNIQUE_CUSTOMERS: number;
}

// Platform-wide metrics
export interface PlatformMetrics {
  totalRevenue: number;
  totalOrders: number;
  totalRestaurants: number;
  totalCustomers: number;
  totalDrivers: number;
  averageOrderValue: number;
  platformProfit: number;
  revenueGrowth: number; // percentage
}

// ==================== FRONTEND-ONLY TYPES ====================

// Cart item (for shopping cart context)
export interface CartItem extends MenuItem {
  quantity: number;
}

// Restaurant display (with extra frontend fields)
export interface RestaurantDisplay extends Restaurant {
  // Add these if you need them for UI
  cuisine?: string;
  rating?: number;
  deliveryTime?: string;
  image?: string;
  isOpen?: boolean;
}

// Menu item display (with extra frontend fields)
export interface MenuItemDisplay extends MenuItem {
  // Add these if you need them for UI
  category?: string;
  image?: string;
  isAvailable?: boolean;
}

// ==================== UTILITY TYPES ====================

// API response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Pagination
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Date range filter
export interface DateRange {
  startDate: string;
  endDate: string;
}

// Export all types
export type {
  // Re-export for convenience
  User as DatabaseUser,
  Restaurant as DatabaseRestaurant,
  MenuItem as DatabaseMenuItem,
  Order as DatabaseOrder,
  OrderItem as DatabaseOrderItem,
  Payment as DatabasePayment,
  Delivery as DatabaseDelivery,
};