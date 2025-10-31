// mock data for development

import { Restaurant, MenuItem } from "./types";

export const mockRestaurants: Restaurant[] = [
  {
    id: 1,
    name: "Pizza Palace",
    cuisine: "Italian",
    description: "Authentic Italian pizzas and pastas",
    rating: 4.5,
    deliveryTime: "30-40 min",
    deliveryFee: 3.99,
    image: "/placeholder-restaurant.jpg",
    isOpen: true,
  },
  {
    id: 2,
    name: "Sushi Master",
    cuisine: "Japanese",
    description: "Fresh sushi and Japanese cuisine",
    rating: 4.8,
    deliveryTime: "25-35 min",
    deliveryFee: 4.99,
    image: "/placeholder-restaurant.jpg",
    isOpen: true,
  },
  {
    id: 3,
    name: "Burger Barn",
    cuisine: "American",
    description: "Gourmet burgers and fries",
    rating: 4.3,
    deliveryTime: "20-30 min",
    deliveryFee: 2.99,
    image: "/placeholder-restaurant.jpg",
    isOpen: true,
  },
  {
    id: 4,
    name: "Thai Spice",
    cuisine: "Thai",
    description: "Authentic Thai curries and noodles",
    rating: 4.6,
    deliveryTime: "35-45 min",
    deliveryFee: 3.49,
    image: "/placeholder-restaurant.jpg",
    isOpen: false,
  },
  {
    id: 5,
    name: "Taco Fiesta",
    cuisine: "Mexican",
    description: "Fresh tacos and Mexican favorites",
    rating: 4.4,
    deliveryTime: "25-35 min",
    deliveryFee: 2.49,
    image: "/placeholder-restaurant.jpg",
    isOpen: true,
  },
];

export const mockMenuItems: MenuItem[] = [
  // Pizza Palace Menu
  {
    id: 1,
    restaurantId: 1,
    name: "Margherita Pizza",
    description: "Fresh mozzarella, tomatoes, and basil",
    price: 12.99,
    category: "Pizza",
    image: "/placeholder-food.jpg",
    available: true,
  },
  {
    id: 2,
    restaurantId: 1,
    name: "Pepperoni Pizza",
    description: "Classic pepperoni with mozzarella",
    price: 14.99,
    category: "Pizza",
    image: "/placeholder-food.jpg",
    available: true,
  },
  {
    id: 3,
    restaurantId: 1,
    name: "Pasta Carbonara",
    description: "Creamy pasta with bacon and parmesan",
    price: 13.99,
    category: "Pasta",
    image: "/placeholder-food.jpg",
    available: true,
  },
  // Sushi Master Menu
  {
    id: 4,
    restaurantId: 2,
    name: "California Roll",
    description: "Crab, avocado, and cucumber",
    price: 8.99,
    category: "Rolls",
    image: "/placeholder-food.jpg",
    available: true,
  },
  {
    id: 5,
    restaurantId: 2,
    name: "Spicy Tuna Roll",
    description: "Fresh tuna with spicy mayo",
    price: 10.99,
    category: "Rolls",
    image: "/placeholder-food.jpg",
    available: true,
  },
  {
    id: 6,
    restaurantId: 2,
    name: "Salmon Nigiri",
    description: "Fresh salmon over rice (2 pieces)",
    price: 7.99,
    category: "Nigiri",
    image: "/placeholder-food.jpg",
    available: true,
  },
  // Burger Barn Menu
  {
    id: 7,
    restaurantId: 3,
    name: "Classic Cheeseburger",
    description: "Beef patty with cheese, lettuce, tomato",
    price: 9.99,
    category: "Burgers",
    image: "/placeholder-food.jpg",
    available: true,
  },
  {
    id: 8,
    restaurantId: 3,
    name: "Bacon Burger",
    description: "Beef patty with crispy bacon and cheese",
    price: 11.99,
    category: "Burgers",
    image: "/placeholder-food.jpg",
    available: true,
  },
  {
    id: 9,
    restaurantId: 3,
    name: "Crispy Fries",
    description: "Golden crispy french fries",
    price: 4.99,
    category: "Sides",
    image: "/placeholder-food.jpg",
    available: true,
  },
];

export function getRestaurantById(id: number): Restaurant | undefined {
  return mockRestaurants.find((r) => r.id === id);
}

export function getMenuItemsByRestaurant(restaurantId: number): MenuItem[] {
  return mockMenuItems.filter((item) => item.restaurantId === restaurantId);
}