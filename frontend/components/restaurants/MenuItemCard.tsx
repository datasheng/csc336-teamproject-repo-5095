"use client"

import Image from "next/image";
import { MenuItem } from "@/lib/types";
import { useCart } from "@/context/CartContext";
import { Plus } from "lucide-react";
import { useState } from "react";

interface MenuItemCardProps {
  item: MenuItem;
}

export default function MenuItemCard({ item }: MenuItemCardProps) {
  const { addToCart } = useCart();
  const [imageError, setImageError] = useState(false);

  // Map menu items to actual food images you have
  const getMenuItemImage = (itemId: number) => {
    const imageMap: { [key: number]: string } = {
      1: "/images/food/margherita.webp",  // Margherita Pizza
      2: "/images/food/rigatoni.webp",     // Rigatoni Carbonara
      3: "/images/food/burrata.jpg",       // Burrata Caprese
      // Items 5-10 don't have images, will be marked as sold out
    };
    
    // If no mapping exists, return null to trigger "sold out"
    return imageMap[itemId] || null;
  };

  // Map database fields to display fields with fallbacks
  const name = item.ITEM_NAME;
  const description = item.ITEM_DESCRIP || "Delicious menu item";
  const price = item.PRICE;
  const imageUrl = getMenuItemImage(item.MENU_ITEM_ID);
  const available = imageUrl !== null && !imageError; // Available only if image exists

  return (
    <div className={`bg-white rounded-2xl shadow-md p-5 flex gap-4 hover:shadow-xl transition-all duration-300 border border-gray-100 ${!available ? 'opacity-60' : ''}`}>
      <div className="w-24 h-24 rounded-xl flex-shrink-0 relative overflow-hidden bg-gradient-to-br from-[#F3EFF8] to-[#FFE5E0]">
        {imageUrl && !imageError ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover"
            sizes="96px"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Image
              src="/images/food/noimg.webp"
              alt="No image available"
              fill
              className="object-cover opacity-50"
              sizes="96px"
            />
          </div>
        )}
        {!available && (
          <div className="absolute inset-0 bg-red-500/80 flex items-center justify-center backdrop-blur-[2px]">
            <span className="text-white text-xs font-bold px-2 py-1 bg-red-600 rounded-md shadow-lg">
              SOLD OUT
            </span>
          </div>
        )}
      </div>

      <div className="flex-1">
        <div className="flex items-start justify-between mb-1">
          <h3 className="font-bold text-[#2C3E50] text-lg">{name}</h3>
          {!available && (
            <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded-full whitespace-nowrap ml-2">
              OUT OF STOCK
            </span>
          )}
        </div>
        <p className="text-sm text-[#7F8C8D] mb-3 line-clamp-2">{description}</p>
        <div className="flex items-center justify-between">
          <span className={`text-xl font-bold ${available ? 'bg-gradient-to-r from-[#5B2C91] to-[#8B6FB0] bg-clip-text text-transparent' : 'text-gray-400'}`}>
            ${price.toFixed(2)}
          </span>
          <button
            onClick={() => addToCart(item)}
            disabled={!available}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 font-semibold ${
              available 
                ? 'bg-gradient-to-r from-[#5B2C91] to-[#8B6FB0] text-white hover:shadow-lg hover:scale-105' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Plus size={18} />
            {available ? 'Add' : 'Sold Out'}
          </button>
        </div>
      </div>
    </div>
  );
}