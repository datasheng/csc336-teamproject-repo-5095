"use client"

import Image from "next/image";
import { CartItem as CartItemType } from "@/lib/types";
import { useCart } from "@/context/CartContext";
import { Minus, Plus, Trash2 } from "lucide-react";

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex gap-4">
      {/* Image Container */}
      <div className="w-20 h-20 rounded-lg flex-shrink-0 relative overflow-hidden">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover"
          sizes="80px"
        />
      </div>

      <div className="flex-1">
        <h3 className="font-semibold mb-1">{item.name}</h3>
        <p className="text-sm text-gray-600 mb-2">${item.price.toFixed(2)} each</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              className="p-1 bg-gray-200 rounded hover:bg-gray-300"
            >
              <Minus size={16} />
            </button>
            <span className="w-8 text-center font-semibold">{item.quantity}</span>
            <button
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="p-1 bg-gray-200 rounded hover:bg-gray-300"
            >
              <Plus size={16} />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-bold text-blue-600">
              ${(item.price * item.quantity).toFixed(2)}
            </span>
            <button
              onClick={() => removeFromCart(item.id)}
              className="p-1 text-red-600 hover:bg-red-50 rounded"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}