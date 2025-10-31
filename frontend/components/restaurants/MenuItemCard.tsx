"use client"

import { MenuItem } from "@/lib/types";
import { useCart } from "@/context/CartContext";
import { Plus } from "lucide-react";

interface MenuItemCardProps {
  item: MenuItem;
}

export default function MenuItemCard({ item }: MenuItemCardProps) {
  const { addToCart } = useCart();

  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex gap-4">
      <div className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0 flex items-center justify-center">
        <span className="text-xs text-gray-400">Food Image</span>
      </div>

      <div className="flex-1">
        <h3 className="font-semibold mb-1">{item.name}</h3>
        <p className="text-sm text-gray-600 mb-2">{item.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-blue-600">
            ${item.price.toFixed(2)}
          </span>
          <button
            onClick={() => addToCart(item)}
            disabled={!item.available}
            className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
          >
            <Plus size={16} />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}