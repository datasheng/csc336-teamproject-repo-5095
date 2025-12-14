"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { Restaurant, MenuItem } from "@/lib/types";
import MenuItemCard from "@/components/restaurants/MenuItemCard";
import { Star, Clock, DollarSign, ArrowLeft } from "lucide-react";
import Link from "next/link";


export default function RestaurantDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const restaurantId = Number(id);

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id || !Number.isFinite(restaurantId)) {
      setError("Invalid restaurant id");
      setLoading(false);
      return;
    }
    
    async function fetchData() {
      try {
        setLoading(true);

        // Fetch restaurant details
        const restaurantData = await api.restaurants.getById(restaurantId);
        if (!restaurantData) throw new Error("No restaurant returned from API");

        console.log("Restaurant data from API:", restaurantData);

        // Transform restaurant data to include display fields
        const transformedRestaurant = {
          ...restaurantData,
          id: restaurantData.RESTAURANT_ID,
          name: restaurantData.RESTAURANT_NAME,
          image: getRestaurantImage(restaurantData.RESTAURANT_ID),
          description: getRestaurantDescription(restaurantData.RESTAURANT_NAME),
          cuisine: getRestaurantCuisine(restaurantData.RESTAURANT_NAME),
          rating: 4.5 + (restaurantData.RESTAURANT_ID % 10) / 10,
          deliveryTime: "30-45 min",
          deliveryFee: 2.99,
          isOpen: true,
        };

        console.log("Transformed restaurant:", transformedRestaurant);

        setRestaurant(transformedRestaurant);

        // Fetch menu items
        const menuData = await api.restaurants.getMenu(restaurantId);
        setMenuItems(menuData?.menu_items ?? []);

        setError(null);
      } catch (err) {
        console.error("Error fetching restaurant data:", err);
        setError("Failed to load restaurant details");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [restaurantId]);

  // Helper functions
  function getRestaurantImage(restaurantId: number): string {
    const images: { [key: number]: string } = {
      2: "/images/fumo.jpeg",
      3: "/images/red_rooster.webp",
      4: "/images/sylvias.jpg",
      5: "/images/amy_ruths.jpg",
      6: "/images/corner_social.jpg",
    };
    return images[restaurantId] || "/images/fumo.jpeg";
  }

  function getRestaurantDescription(restaurantName: string): string {
    if (!restaurantName) return "Delicious food";

    const descriptions: { [key: string]: string } = {
      "FUMO Harlem":
        "Modern Italian dining with creative cocktails and seasonal ingredients",
      "Red Rooster": "Vibrant soul food and live music in the heart of Harlem",
      "Sylvia's": "The Queen of Soul Food - A Harlem institution since 1962",
      "Amy Ruth's": "Home-style Southern cooking and famous chicken & waffles",
      "Corner Social": "Contemporary American cuisine in a stylish setting",
    };

    return descriptions[restaurantName] || `Delicious food from ${restaurantName}`;
  }

  function getRestaurantCuisine(restaurantName: string): string {
    if (!restaurantName) return "Restaurant";

    const cuisines: { [key: string]: string } = {
      "FUMO Harlem": "Italian",
      "Red Rooster": "Soul Food",
      "Sylvia's": "Soul Food",
      "Amy Ruth's": "Southern",
      "Corner Social": "American",
    };
    return cuisines[restaurantName] || "Restaurant";
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F3EFF8] via-white to-[#FFE5E0] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#5B2C91] mx-auto mb-4"></div>
          <p className="text-[#7F8C8D] text-lg">Loading restaurant details...</p>
        </div>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F3EFF8] via-white to-[#FFE5E0] flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-3xl shadow-lg max-w-md">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-[#2C3E50] mb-2">
            Restaurant Not Found
          </h2>
          <p className="text-[#7F8C8D] mb-4">
            {error || "This restaurant doesn't exist"}
          </p>
          <Link
            href="/restaurants"
            className="inline-block bg-gradient-to-r from-[#5B2C91] to-[#8B6FB0] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            Back to Restaurants
          </Link>
        </div>
      </div>
    );
  }

  // Map database fields to display fields - with proper fallbacks
  const restaurantName =
    restaurant.RESTAURANT_NAME || restaurant.name || "Restaurant";
  const restaurantDescription =
    restaurant.description || `Delicious food from ${restaurantName}`;
  const restaurantRating = restaurant.rating || 4.5;
  const restaurantDeliveryTime = restaurant.deliveryTime || "30-45 min";
  const restaurantDeliveryFee = restaurant.deliveryFee || 2.99;
  const restaurantCuisine = restaurant.cuisine || "Restaurant";
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
              <h1 className="text-4xl font-bold mb-2 text-[#2C3E50]">
                {restaurantName}
              </h1>
              <p className="text-[#7F8C8D] mb-4 text-lg">
                {restaurantDescription}
              </p>

              <div className="flex items-center gap-6 text-sm text-[#7F8C8D] mb-4">
                <div className="flex items-center gap-2">
                  <Star size={18} className="text-yellow-500 fill-yellow-500" />
                  <span className="font-semibold text-[#2C3E50]">
                    {restaurantRating.toFixed(1)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={18} className="text-[#FF5722]" />
                  <span className="font-medium">{restaurantDeliveryTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign size={18} className="text-[#219d1b]" />
                  <span className="font-medium">
                    ${restaurantDeliveryFee.toFixed(2)} delivery
                  </span>
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
          <>
            <p className="text-[#7F8C8D] mb-6">
              {menuItems.length} {menuItems.length === 1 ? "item" : "items"}{" "}
              available
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {menuItems.map((item) => (
                <MenuItemCard
                  key={item.MENU_ITEM_ID}
                  item={item}
                  restaurantId={restaurantId}
                  restaurantName={restaurantName}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl shadow-lg">
            <div className="text-6xl mb-4">🍽️</div>
            <h3 className="text-2xl font-bold text-[#2C3E50] mb-2">
              No Menu Items Available
            </h3>
            <p className="text-[#7F8C8D]">
              Check back soon for delicious options!
            </p>
          </div>
        )}

        {/* Database Connection Indicator */}
        <div className="mt-8 p-4 bg-white rounded-xl shadow-md border-l-4 border-green-500">
          <p className="text-sm text-[#7F8C8D]">
            ✅ Menu loaded from database - Restaurant:{" "}
            <span className="font-semibold text-[#2C3E50]">{restaurantName}</span>{" "}
            (ID: {restaurant.RESTAURANT_ID})
          </p>
        </div>
      </div>
    </div>
  );
}
