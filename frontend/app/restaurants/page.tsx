"use client"

import RestaurantCard from "@/components/restaurants/RestaurantCard";
import { api } from "@/lib/api";
import { Restaurant } from "@/lib/types";
import { Search, Filter } from "lucide-react";
import { useState, useEffect } from "react";

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch restaurants from API on component mount
  useEffect(() => {
    async function fetchRestaurants() {
      try {
        setLoading(true);
        const response = await api.restaurants.getAll();
        
        // Transform backend data to include frontend display fields
        const transformedRestaurants = response.restaurants.map((r: any) => ({
          ...r,
          // Add display fields for UI
          id: r.RESTAURANT_ID,
          name: r.RESTAURANT_NAME,
          // You can add images later, for now use placeholders based on ID
          image: getRestaurantImage(r.RESTAURANT_ID),
          description: getRestaurantDescription(r.RESTAURANT_NAME),
          cuisine: getRestaurantCuisine(r.RESTAURANT_NAME),
          rating: 4.5 + (r.RESTAURANT_ID % 10) / 10, // Generate rating based on ID
          deliveryTime: "30-45 min",
          deliveryFee: 2.99,
          isOpen: true
        }));
        
        setRestaurants(transformedRestaurants);
        setError(null);
      } catch (err) {
        console.error('Error fetching restaurants:', err);
        setError('Failed to load restaurants. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    fetchRestaurants();
  }, []);

  // Helper functions to add display data
  function getRestaurantImage(id: number): string {
    const images: { [key: number]: string } = {
      2: "/images/fumo.jpeg",           // FUMO Harlem
      3: "/images/red_rooster.webp",   // Red Rooster
      4: "/images/sylvias.jpg",        // Sylvia's
      5: "/images/amy_ruths.jpg",     // Amy Ruth's
      6: "/images/corner_social.jpg"   // Corner Social
    };
    return images[id] || "/images/briccola.jpg";
  }

  function getRestaurantDescription(name: string): string {
    const descriptions: { [key: string]: string } = {
      "FUMO Harlem": "Modern Italian dining with creative cocktails and seasonal ingredients",
      "Red Rooster": "Vibrant soul food and live music in the heart of Harlem",
      "Sylvia's": "The Queen of Soul Food - A Harlem institution since 1962",
      "Amy Ruth's": "Home-style Southern cooking and famous chicken & waffles",
      "Corner Social": "Contemporary American cuisine in a stylish setting"
    };
    return descriptions[name] || `Delicious food from ${name}`;
  }

  function getRestaurantCuisine(name: string): string {
    const cuisines: { [key: string]: string } = {
      "FUMO Harlem": "Italian",
      "Red Rooster": "Soul Food",
      "Sylvia's": "Soul Food",
      "Amy Ruth's": "Southern",
      "Corner Social": "American"
    };
    return cuisines[name] || "Restaurant";
  }

  // Filter restaurants
  const filteredRestaurants = restaurants.filter(restaurant => 
    restaurant.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    restaurant.RESTAURANT_NAME.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F3EFF8] via-white to-[#FFE5E0] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#5B2C91] mx-auto mb-4"></div>
          <p className="text-[#7F8C8D] text-lg">Loading restaurants from database...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F3EFF8] via-white to-[#FFE5E0] flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-3xl shadow-lg max-w-md">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-[#2C3E50] mb-2">Oops!</h2>
          <p className="text-[#7F8C8D] mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-[#5B2C91] to-[#8B6FB0] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F3EFF8] via-white to-[#FFE5E0] py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-[#2C3E50] mb-4">
            Discover <span className="bg-gradient-to-r from-[#5B2C91] to-[#FF5980] bg-clip-text text-transparent">Harlem's Best</span>
          </h1>
          <p className="text-xl text-[#7F8C8D] mb-8">
            {restaurants.length} restaurants loaded from database
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#7F8C8D]" size={20} />
              <input
                type="text"
                placeholder="Search restaurants..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-[#5B2C91] focus:outline-none transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-[#7F8C8D]">
            Showing <span className="font-bold text-[#5B2C91]">{filteredRestaurants.length}</span> {filteredRestaurants.length === 1 ? 'restaurant' : 'restaurants'}
          </p>
        </div>

        {/* Restaurant Grid */}
        {filteredRestaurants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRestaurants.map((restaurant) => (
              <RestaurantCard 
                key={restaurant.RESTAURANT_ID} 
                restaurant={restaurant} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-[#2C3E50] mb-2">No restaurants found</h3>
            <p className="text-[#7F8C8D]">Try adjusting your search</p>
          </div>
        )}

        {/* Database Connection Indicator */}
        <div className="mt-12 max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500">
          <h3 className="font-bold text-[#2C3E50] mb-2 flex items-center gap-2">
            ✅ Live Database Connection
          </h3>
          <p className="text-[#7F8C8D] text-sm">
            Data loaded from AWS RDS MySQL database via FastAPI backend. 
            {restaurants.length > 0 && ` Successfully retrieved ${restaurants.length} restaurants.`}
          </p>
        </div>
      </div>
    </div>
  );
}