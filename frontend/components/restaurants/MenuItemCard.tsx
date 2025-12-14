"use client"

import Image from "next/image";
import { MenuItem } from "@/lib/types";
import { useCart } from "@/context/CartContext";
import { Plus, Check } from "lucide-react";
import { useState } from "react";

interface MenuItemCardProps {
  item: MenuItem;
  restaurantId: number;
  restaurantName: string;
}

export default function MenuItemCard({ item, restaurantId, restaurantName }: MenuItemCardProps) {
  const { addToCart } = useCart();
  const [imageError, setImageError] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  // Map menu items to actual food images you have
  const getMenuItemImage = (restaurantId: number, menuItemId: number) => {
    const key = `${restaurantId}_${menuItemId}`;
    const knownImages = new Set([
      "2_4","2_2","2_3",
      "3_5","3_7","3_6",
      "4_9","4_10","4_8",
      "5_11","5_13","5_12",
      "6_16","6_14","6_15",
      // etc
    ]);

    return knownImages.has(key)
      ? `/images/food/${key}.jpg`
      : "/images/food/noimg.webp";
  };


  // Map database fields to display fields with fallbacks
  const name = item.ITEM_NAME;
  const description = item.ITEM_DESCRIP || "Delicious menu item";
  const price = item.PRICE;
  const imageUrl = getMenuItemImage(restaurantId, item.MENU_ITEM_ID);
  const available = true;
  const handleAdd = () => {
    const result = addToCart(item, restaurantName);

    if (!result.ok && result.reason == "DIFFERENT_RESTAURANT") {
      alert(
        `Your cart already has items from ${result.cartRestaurantName}. Please clear your cart before ordering from another restaurant.`
      );
      return;
    }
    setJustAdded(true);

    setTimeout(() => {
      setJustAdded(false);
    }, 1200); // duration in ms
  };


  return (
    <div
      className={`bg-white rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden ${
        !available ? "opacity-60" : ""
      }`}
    >
      {/* Image header (restaurant-card style) */}
      <div className="relative w-full h-44 md:h-52 bg-gradient-to-br from-[#F3EFF8] to-[#FFE5E0]">
        {!imageError ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            onError={() => setImageError(true)}
            priority={false}
          />
        ) : (
          <Image
            src="/images/food/noimg.webp"
            alt="No image available"
            fill
            className="object-cover opacity-70"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        )}

        {/* Optional badge overlay (top-right) */}
        <div className="absolute top-3 right-3">
          {!available ? (
            <span className="text-xs font-bold text-white bg-red-600/90 px-3 py-1 rounded-full shadow">
              SOLD OUT
            </span>
          ) : (
            <span className="text-xs font-bold text-[#2C3E50] bg-white/90 px-3 py-1 rounded-full shadow">
              ${price.toFixed(2)}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="font-bold text-[#2C3E50] text-xl md:text-2xl leading-tight">
            {name}
          </h3>

          {!available && (
            <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded-full whitespace-nowrap">
              OUT OF STOCK
            </span>
          )}
        </div>

        <p className="text-base text-[#7F8C8D] mb-5 line-clamp-2">
          {description}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-xl font-extrabold bg-gradient-to-r from-[#5B2C91] to-[#8B6FB0] bg-clip-text text-transparent">
            ${price.toFixed(2)}
          </span>

          <button
            onClick={handleAdd}
            disabled={!available}
            className={`flex items-center gap-2 px-6 py-3 md:text-xl rounded-xl transition-all duration-300 font-semibold ${
              !available
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : justAdded
                ? "bg-green-500 text-white scale-105"
                : "bg-gradient-to-r from-[#5B2C91] to-[#8B6FB0] text-white hover:shadow-lg hover:scale-105"
            }`}
          >
            {justAdded ? <Check size={18} /> : <Plus size={18} />}
            {justAdded ? "Added" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}