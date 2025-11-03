// TypeScript types

export interface Restaurant {
  id: number;
  name: string;
  cuisine: string;
  description: string;
  rating: number;
  deliveryTime: string;
  deliveryFee: number;
  image: string;
  isOpen: boolean;
}

export interface MenuItem {
  id: number;
  restaurantId: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  available: boolean;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface Order {
  id: number;
  userId: number;
  restaurantId: number;
  items: CartItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
  deliveryAddress: string;
  orderDate: string;
  estimatedDeliveryTime: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'customer' | 'restaurant' | 'driver' | 'admin';
}