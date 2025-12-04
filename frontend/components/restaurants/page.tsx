// app/restaurants/page.tsx
"use client"

import RestaurantCard from "@/components/restaurants/RestaurantCard";
import { mockRestaurants } from "@/lib/mockData";
import { Search, Filter } from "lucide-react";
import { useState } from "react";

export default function RestaurantsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("All");

  // Get unique cuisines for filter
  const cuisines = ["All", ...new Set(mockRestaurants.map(r => r.cuisine || "Other"))];

  // Filter restaurants
  const filteredRestaurants = mockRestaurants.filter(restaurant => {
    const matchesSearch = restaurant.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         restaurant.RESTAURANT_NAME.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCuisine = selectedCuisine === "All" || restaurant.cuisine === selectedCuisine;
    return matchesSearch && matchesCuisine;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F3EFF8] via-white to-[#FFE5E0] py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-[#2C3E50] mb-4">
            Discover <span className="bg-gradient-to-r from-[#5B2C91] to-[#FF5980] bg-clip-text text-transparent">Harlem's Best</span>
          </h1>
          <p className="text-xl text-[#7F8C8D] mb-8">
            {mockRestaurants.length} restaurants ready to deliver
          </p>

          {/* Search & Filter */}
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#7F8C8D]" size={20} />
              <input
                type="text"
                placeholder="Search restaurants..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-[#5B2C91] focus:outline-none transition-colors"
              />
            </div>

            {/* Cuisine Filter */}
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#7F8C8D]" size={20} />
              <select
                value={selectedCuisine}
                onChange={(e) => setSelectedCuisine(e.target.value)}
                className="pl-12 pr-8 py-4 rounded-2xl border-2 border-gray-200 focus:border-[#5B2C91] focus:outline-none transition-colors appearance-none bg-white cursor-pointer min-w-[200px]"
              >
                {cuisines.map(cuisine => (
                  <option key={cuisine} value={cuisine}>{cuisine}</option>
                ))}
              </select>
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
            <p className="text-[#7F8C8D]">Try adjusting your search or filter</p>
          </div>
        )}

        {/* Demo Note */}
        <div className="mt-12 max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-6 border-l-4 border-[#5B2C91]">
          <h3 className="font-bold text-[#2C3E50] mb-2 flex items-center gap-2">
            💡 Presentation Mode
          </h3>
          <p className="text-[#7F8C8D] text-sm">
            Currently displaying mock data that matches our database schema exactly. 
            All restaurants shown here correspond to entries in the RESTAURANT table with proper profit tracking fields.
          </p>
        </div>
      </div>
    </div>
  );
}