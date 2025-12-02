// API Integration for Restaurant Ordering System
// Base URL for backend API

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// ==================== HELPER FUNCTIONS ====================

async function fetchAPI(endpoint: string, options?: RequestInit) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Request failed' }));
    throw new Error(error.detail || `HTTP ${response.status}`);
  }

  return response.json();
}

// ==================== HEALTH CHECK ====================

export async function checkHealth() {
  return fetchAPI('/api/health');
}

export async function testDatabase() {
  return fetchAPI('/api/test-db');
}

// ==================== AUTH ENDPOINTS ====================

export async function register(data: {
  username: string;
  email: string;
  password: string;
  phone: string;
  role?: string;
}) {
  return fetchAPI('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// TODO: Add when backend implements
export async function login(email: string, password: string) {
  // return fetchAPI('/api/auth/login', {
  //   method: 'POST',
  //   body: JSON.stringify({ email, password }),
  // });
  throw new Error('Login endpoint not implemented yet');
}

// ==================== RESTAURANT ENDPOINTS ====================
// These will work once backend implements routes/restaurants.py

export async function getAllRestaurants() {
  // TODO: Uncomment when backend ready
  // return fetchAPI('/api/restaurants');
  
  // For now, use mock data
  throw new Error('Restaurant endpoints not implemented yet - using mock data');
}

export async function getRestaurantById(id: number) {
  // TODO: Uncomment when backend ready
  // return fetchAPI(`/api/restaurants/${id}`);
  
  throw new Error('Restaurant endpoints not implemented yet - using mock data');
}

export async function getRestaurantMenu(restaurantId: number) {
  // TODO: Uncomment when backend ready
  // return fetchAPI(`/api/restaurants/${restaurantId}/menu`);
  
  throw new Error('Menu endpoints not implemented yet - using mock data');
}

// ==================== ORDER ENDPOINTS ====================
// These will work once backend implements routes/orders.py

export async function createOrder(data: {
  RESTAURANT_ID: number;
  USER_ID: number;
  items: Array<{
    MENU_ITEM_ID: number;
    QUANTITY: number;
    PRICE: number;
  }>;
  PAYMENT_METHOD: string;
}) {
  // TODO: Uncomment when backend ready
  // return fetchAPI('/api/orders', {
  //   method: 'POST',
  //   body: JSON.stringify(data),
  // });
  
  throw new Error('Order endpoints not implemented yet - using mock data');
}

export async function getOrderById(orderId: number) {
  // TODO: Uncomment when backend ready
  // return fetchAPI(`/api/orders/${orderId}`);
  
  throw new Error('Order endpoints not implemented yet - using mock data');
}

export async function getUserOrders(userId: number) {
  // TODO: Uncomment when backend ready
  // return fetchAPI(`/api/users/${userId}/orders`);
  
  throw new Error('Order endpoints not implemented yet - using mock data');
}

// ==================== REVENUE/DASHBOARD ENDPOINTS ====================
// These will work once backend implements routes/reports.py

export async function getRevenueReport() {
  // TODO: Uncomment when backend ready
  // This should query the INVESTOR_PROFIT_VIEW
  // return fetchAPI('/api/reports/revenue');
  
  throw new Error('Revenue endpoints not implemented yet - using mock data');
}

export async function getPlatformMetrics(params?: {
  startDate?: string;
  endDate?: string;
}) {
  // TODO: Uncomment when backend ready
  // const queryString = new URLSearchParams(params as any).toString();
  // return fetchAPI(`/api/reports/platform-metrics?${queryString}`);
  
  throw new Error('Metrics endpoints not implemented yet - using mock data');
}

export async function getRestaurantDashboard(restaurantId: number) {
  // TODO: Uncomment when backend ready
  // return fetchAPI(`/api/dashboard/restaurant/${restaurantId}`);
  
  throw new Error('Dashboard endpoints not implemented yet - using mock data');
}

// ==================== EXPORT UTILITIES ====================

export const api = {
  health: {
    check: checkHealth,
    testDb: testDatabase,
  },
  auth: {
    register,
    login,
  },
  restaurants: {
    getAll: getAllRestaurants,
    getById: getRestaurantById,
    getMenu: getRestaurantMenu,
  },
  orders: {
    create: createOrder,
    getById: getOrderById,
    getUserOrders: getUserOrders,
  },
  reports: {
    revenue: getRevenueReport,
    metrics: getPlatformMetrics,
  },
  dashboard: {
    restaurant: getRestaurantDashboard,
  },
};

export default api;