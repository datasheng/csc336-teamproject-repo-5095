"use client"

import { useState } from "react";
import RestaurantCard from "@/components/restaurants/RestaurantCard";
import { mockRestaurants } from "@/lib/mockData";
import { Search } from "lucide-react";

export default function RestaurantsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState<string>("All");

  const cuisines = ["All", "Italian", "Mexican", "Asian", "American", "Japanese", "Thai"];

  const filteredRestaurants = mockRestaurants.filter((restaurant) => {
    const matchesSearch = restaurant.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCuisine =
      selectedCuisine === "All" || restaurant.cuisine === selectedCuisine;
    return matchesSearch && matchesCuisine;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F5F7] via-white to-[#FFE5E0] py-8">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-[#2C3E50] mb-2">
                Discover <span className="text-[#FF5722]">Restaurants</span>
              </h1>
              <p className="text-[#7F8C8D] text-lg">Grab your delicious meal!</p>
            </div>
            <button className="p-3 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-br from-[#FF5722] to-[#FF6B4A] rounded-xl flex items-center justify-center text-white text-lg font-bold shadow-lg">
                J
              </div>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-[#7F8C8D]" size={22} />
            <input
              type="text"
              placeholder="Search restaurants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-white border-0 rounded-2xl shadow-lg focus:shadow-xl transition-all duration-300 text-[#2C3E50] placeholder:text-[#BDC3C7] text-lg focus:outline-none focus:ring-2 focus:ring-[#FF5722] focus:ring-opacity-50"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {cuisines.map((cuisine) => (
              <button
                key={cuisine}
                onClick={() => setSelectedCuisine(cuisine)}
                className={`px-6 py-3 rounded-full font-semibold whitespace-nowrap transition-all duration-300 text-base ${
                  selectedCuisine === cuisine
                    ? 'bg-gradient-to-r from-[#FF5722] to-[#FF6B4A] text-white shadow-lg scale-105'
                    : 'bg-white text-[#7F8C8D] hover:bg-[#FFE5E0] hover:text-[#FF5722] shadow-md hover:shadow-lg'
                }`}
              >
                {cuisine}
              </button>
            ))}
          </div>
        </div>

        {/* Section Title */}
        <h2 className="text-2xl font-bold text-[#2C3E50] mb-6">
          Select <span className="text-[#FF5722]">your choices!</span>
        </h2>

        {/* Restaurant Grid */}
        {filteredRestaurants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl shadow-lg">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-xl text-[#7F8C8D] mb-2 font-semibold">No restaurants found</p>
            <p className="text-sm text-[#BDC3C7]">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}