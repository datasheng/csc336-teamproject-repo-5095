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

// ==================== RESTAURANT ENDPOINTS ====================

export async function getAllRestaurants() {
  try {
    return await fetchAPI('/api/restaurants/');
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    throw error;
  }
}

export async function getRestaurantById(id: number) {
  try {
    const response = await fetchAPI(`/api/restaurants/${id}`);
    // Backend returns { success: true, restaurant: {...} }
    // We just want the restaurant object
    return response.restaurant;
  } catch (error) {
    console.error(`Error fetching restaurant ${id}:`, error);
    throw error;
  }
}

export async function getRestaurantMenu(restaurantId: number) {
  try {
    return await fetchAPI(`/api/restaurants/${restaurantId}/menu`);
  } catch (error) {
    console.error(`Error fetching menu for restaurant ${restaurantId}:`, error);
    throw error;
  }
}

// ==================== ORDER ENDPOINTS ====================

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
  try {
    return await fetchAPI('/api/orders/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
}

export async function getOrderById(orderId: number) {
  try {
    return await fetchAPI(`/api/orders/${orderId}`);
  } catch (error) {
    console.error(`Error fetching order ${orderId}:`, error);
    throw error;
  }
}

export async function getUserOrders(userId: number) {
  // This endpoint might not be implemented yet
  // Fall back gracefully if it fails
  try {
    return await fetchAPI(`/api/users/${userId}/orders`);
  } catch (error) {
    console.warn('User orders endpoint not available');
    return [];
  }
}

// ==================== REVENUE/DASHBOARD ENDPOINTS ====================

export async function getRevenueReport() {
  try {
    return await fetchAPI('/api/reports/revenue');
  } catch (error) {
    console.error('Error fetching revenue report:', error);
    throw error;
  }
}

export async function getPlatformMetrics(params?: {
  startDate?: string;
  endDate?: string;
}) {
  try {
    const queryString = params ? new URLSearchParams(params as any).toString() : '';
    const endpoint = queryString ? `/api/reports/platform-metrics?${queryString}` : '/api/reports/platform-metrics';
    return await fetchAPI(endpoint);
  } catch (error) {
    console.warn('Platform metrics endpoint not available');
    return null;
  }
}

export async function getRestaurantDashboard(restaurantId: number) {
  try {
    return await fetchAPI(`/api/dashboard/restaurant/${restaurantId}`);
  } catch (error) {
    console.warn('Restaurant dashboard endpoint not available');
    return null;
  }
}

// ==================== EXPORT UTILITIES ====================

export const api = {
  health: {
    check: checkHealth,
    testDb: testDatabase,
  },
  auth: {
    register,
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