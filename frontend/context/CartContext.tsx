"use client";

import React, { createContext, useContext, useMemo, useState, ReactNode } from "react";
import { CartItem, MenuItem } from "@/lib/types";

type AddToCartResult =
  | { ok: true }
  | {
      ok: false;
      reason: "DIFFERENT_RESTAURANT";
      cartRestaurantId: number;
      attemptedRestaurantId: number;
      cartRestaurantName: string;
    };

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: MenuItem, restaurantName: string) => AddToCartResult;
  removeFromCart: (itemId: number) => void;
  updateQuantity: (itemId: number, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartRestaurant, setCartRestaurant] = useState<{ id: number; name: string } | null>(null);

  const addToCart = (item: MenuItem, restaurantName: string): AddToCartResult => {
    if (cartRestaurant && cartRestaurant.id !== item.RESTAURANT_ID) {
      return {
        ok: false,
        reason: "DIFFERENT_RESTAURANT",
        cartRestaurantId: cartRestaurant.id,
        attemptedRestaurantId: item.RESTAURANT_ID,
        cartRestaurantName: cartRestaurant.name,
      };
    }

    if (!cartRestaurant) {
      setCartRestaurant({ id: item.RESTAURANT_ID, name: restaurantName });
    }

    setCartItems((prev) => {
      const existing = prev.find((ci) => ci.MENU_ITEM_ID === item.MENU_ITEM_ID);
      if (existing) {
        return prev.map((ci) =>
          ci.MENU_ITEM_ID === item.MENU_ITEM_ID ? { ...ci, quantity: ci.quantity + 1 } : ci
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });

    return { ok: true };
  };

  const removeFromCart = (itemId: number) => {
    setCartItems((prev) => {
      const next = prev.filter((it) => it.MENU_ITEM_ID !== itemId);
      if (next.length === 0) setCartRestaurant(null);
      return next;
    });
  };

  const updateQuantity = (itemId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCartItems((prev) =>
      prev.map((it) => (it.MENU_ITEM_ID === itemId ? { ...it, quantity } : it))
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setCartRestaurant(null);
  };

  const getCartTotal = () => cartItems.reduce((sum, it) => sum + it.PRICE * it.quantity, 0);
  const getCartItemCount = () => cartItems.reduce((sum, it) => sum + it.quantity, 0);

  const value = useMemo(
    () => ({
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      getCartItemCount,
    }),
    [cartItems, cartRestaurant]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}