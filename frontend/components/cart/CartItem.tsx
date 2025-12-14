"use client"

import { useCart } from "@/context/CartContext";
import { Minus, Plus, Trash2 } from "lucide-react";
import { CartItem as CartItemType } from "@/lib/types";
import Image from "next/image";

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart();

  // Map database fields to display fields
  const name = item.ITEM_NAME;
  const price = item.PRICE;
  const description = item.ITEM_DESCRIP || "";
  const quantity = item.quantity;
  const getCartItemImage = (restaurantId: number, menuItemId: number) => {
    return `/images/food/${restaurantId}_${menuItemId}.jpg`;
  };


  return (
    <div className="bg-white rounded-2xl shadow-md p-6 flex items-center gap-4 hover:shadow-lg transition-shadow duration-300">
      {/*Image*/}
      <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-[#F3EFF8] to-[#FFE5E0]">
        <Image
          src={getCartItemImage(item.RESTAURANT_ID, item.MENU_ITEM_ID)}
          alt={item.ITEM_NAME}
          fill
          className="object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/images/food/noimg.webp";
          }}
        />
      </div>
      
      {/* Item Info */}
      <div className="flex-1">
        <h3 className="text-lg font-bold text-[#2C3E50] mb-1">{name}</h3>
        {description && (
          <p className="text-sm text-[#7F8C8D] mb-2 line-clamp-1">{description}</p>
        )}
        <p className="text-xl font-bold bg-gradient-to-r from-[#5B2C91] to-[#8B6FB0] bg-clip-text text-transparent">
          ${price.toFixed(2)}
        </p>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => updateQuantity(item.MENU_ITEM_ID, quantity - 1)}
          className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          aria-label="Decrease quantity"
        >
          <Minus size={16} className="text-[#2C3E50]" />
        </button>

        <span className="text-lg font-semibold text-[#2C3E50] w-8 text-center">
          {quantity}
        </span>

        <button
          onClick={() => updateQuantity(item.MENU_ITEM_ID, quantity + 1)}
          className="w-8 h-8 rounded-full bg-gradient-to-r from-[#5B2C91] to-[#8B6FB0] hover:opacity-90 flex items-center justify-center transition-opacity"
          aria-label="Increase quantity"
        >
          <Plus size={16} className="text-white" />
        </button>
      </div>

      {/* Item Total */}
      <div className="text-right min-w-[100px]">
        <p className="text-sm text-[#7F8C8D] mb-1">Total</p>
        <p className="text-xl font-bold text-[#2C3E50]">
          ${(price * quantity).toFixed(2)}
        </p>
      </div>

      {/* Remove Button */}
      <button
        onClick={() => removeFromCart(item.MENU_ITEM_ID)}
        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
        aria-label="Remove item"
      >
        <Trash2 size={20} />
      </button>
    </div>
  );
}