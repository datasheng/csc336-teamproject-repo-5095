// restaurant detail/menu
"use client"

import { use } from "react";
import { getRestaurantById, getMenuItemsByRestaurant } from "@/lib/mockData";
import MenuItemCard from "@/components/restaurants/MenuItemCard";
import { Star, Clock, DollarSign, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default function RestaurantDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const restaurant = getRestaurantById(parseInt(id));
  const menuItems = getMenuItemsByRestaurant(parseInt(id));

  if (!restaurant) {
    notFound();
  }

  // Map database fields to display fields
  const restaurantName = restaurant.name || restaurant.RESTAURANT_NAME;
  const restaurantDescription = restaurant.description || `Delicious food from ${restaurantName}`;
  const restaurantRating = restaurant.rating || 4.5;
  const restaurantDeliveryTime = restaurant.deliveryTime || "30-45 min";
  const restaurantDeliveryFee = restaurant.deliveryFee || 2.99;
  const restaurantCuisine = restaurant.cuisine || "Restaurant";
  console.log("Restaurant data:", { 
    id: restaurant.RESTAURANT_ID, 
    name: restaurantName, 
    cuisine: restaurant.cuisine,
    calculatedCuisine: restaurantCuisine 
  });
  const restaurantIsOpen = restaurant.isOpen ?? true;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F3EFF8] via-white to-[#FFE5E0]">
      {/* Header */}
      <div className="bg-white shadow-lg border-b-4 border-[#5B2C91]">
        <div className="container mx-auto px-4 py-6">
          <Link
            href="/restaurants"
            className="text-[#5B2C91] hover:text-[#8B6FB0] flex items-center gap-2 mb-4 font-semibold transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Restaurants
          </Link>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 text-[#2C3E50]">{restaurantName}</h1>
              <p className="text-[#7F8C8D] mb-4 text-lg">{restaurantDescription}</p>

              <div className="flex items-center gap-6 text-sm text-[#7F8C8D] mb-4">
                <div className="flex items-center gap-2">
                  <Star size={18} className="text-yellow-500 fill-yellow-500" />
                  <span className="font-semibold text-[#2C3E50]">{restaurantRating.toFixed(1)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={18} className="text-[#FF5722]" />
                  <span className="font-medium">{restaurantDeliveryTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign size={18} className="text-[#219d1b]" />
                  <span className="font-medium">${restaurantDeliveryFee.toFixed(2)} delivery</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="inline-block bg-gradient-to-r from-[#5B2C91] to-[#8B6FB0] text-white text-sm px-4 py-2 rounded-full font-bold">
                  {restaurantCuisine}
                </span>
                {restaurantIsOpen ? (
                  <span className="inline-flex items-center gap-2 bg-green-50 text-green-700 text-sm px-4 py-2 rounded-full font-bold">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    Open Now
                  </span>
                ) : (
                  <span className="inline-block bg-red-100 text-red-600 text-sm px-4 py-2 rounded-full font-bold">
                    Currently Closed
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6 text-[#2C3E50]">Menu</h2>

        {menuItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {menuItems.map((item) => (
              <MenuItemCard key={item.MENU_ITEM_ID} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl shadow-lg">
            <div className="text-6xl mb-4">🍽️</div>
            <h3 className="text-2xl font-bold text-[#2C3E50] mb-2">No Menu Items Available</h3>
            <p className="text-[#7F8C8D]">Check back soon for delicious options!</p>
          </div>
        )}
      </div>
    </div>
  );
}