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

  // Group menu items by category
  const itemsByCategory = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof menuItems>);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-6">
          <Link
            href="/restaurants"
            className="text-blue-600 hover:text-blue-700 flex items-center gap-2 mb-4"
          >
            <ArrowLeft size={20} />
            Back to Restaurants
          </Link>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{restaurant.name}</h1>
              <p className="text-gray-600 mb-3">{restaurant.description}</p>

              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Star size={16} className="text-yellow-500 fill-yellow-500" />
                  <span>{restaurant.rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={16} />
                  <span>{restaurant.deliveryTime}</span>
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign size={16} />
                  <span>${restaurant.deliveryFee.toFixed(2)} delivery</span>
                </div>
              </div>

              <div className="mt-3">
                <span className="inline-block bg-blue-100 text-blue-600 text-sm px-3 py-1 rounded">
                  {restaurant.cuisine}
                </span>
                {!restaurant.isOpen && (
                  <span className="inline-block bg-red-100 text-red-600 text-sm px-3 py-1 rounded ml-2">
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
        <h2 className="text-2xl font-bold mb-6">Menu</h2>

        {Object.entries(itemsByCategory).map(([category, items]) => (
          <div key={category} className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">
              {category}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {items.map((item) => (
                <MenuItemCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        ))}

        {menuItems.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No menu items available at this time.
          </div>
        )}
      </div>
    </div>
  );
}