import Link from "next/link";
import Image from "next/image";
import { Restaurant } from "@/lib/types";
import { Star, Clock, DollarSign } from "lucide-react";

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export default function RestaurantCard({ restaurant }: RestaurantCardProps) {
  return (
    <Link href={`/restaurants/${restaurant.id}`}>
      <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer transform hover:-translate-y-2">
        {/* Image Container */}
        <div className="relative h-56 overflow-hidden">
          {/* Restaurant Image */}
          <Image
            src={restaurant.image}
            alt={restaurant.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>

          {/* Status Badge */}
          {!restaurant.isOpen && (
            <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs px-4 py-2 rounded-full font-bold shadow-lg z-10">
              Closed
            </div>
          )}

          {/* Rating Badge */}
          <div className="absolute bottom-4 right-4 bg-white rounded-2xl px-4 py-2 shadow-lg flex items-center gap-2 group-hover:scale-110 transition-transform duration-300 z-10">
            <Star size={16} className="text-yellow-500 fill-yellow-500" />
            <span className="text-sm font-bold text-[#2C3E50]">{restaurant.rating}</span>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6">
          <h3 className="text-2xl font-bold text-[#2C3E50] mb-2 group-hover:text-[#FF5722] transition-colors duration-300">
            {restaurant.name}
          </h3>
          
          <p className="text-sm text-[#7F8C8D] mb-4 line-clamp-2">
            {restaurant.description}
          </p>
          
          {/* Info Row */}
          <div className="flex items-center gap-4 text-sm text-[#7F8C8D] mb-4">
            <div className="flex items-center gap-1.5">
              <Clock size={18} className="text-[#FF5722]" />
              <span className="font-medium">{restaurant.deliveryTime}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <DollarSign size={18} className="text-[#219d1b]" />
              <span className="font-medium">${restaurant.deliveryFee.toFixed(2)}</span>
            </div>
          </div>
          
          {/* Cuisine Badge & Status */}
          <div className="flex items-center justify-between">
            <span className="bg-gradient-to-r from-[#FFE5E0] to-[#FFD5D0] text-[#FF5722] px-4 py-2 rounded-full text-sm font-bold">
              {restaurant.cuisine}
            </span>
            
            {restaurant.isOpen && (
              <span className="text-xs text-[#219d1b] font-bold flex items-center gap-2">
                <div className="w-2.5 h-2.5 bg-[#219d1b] rounded-full animate-pulse"></div>
                Open Now
              </span>
            )}
          </div>
        </div>

        {/* Bottom accent line */}
        <div className="h-1.5 bg-gradient-to-r from-[#FF5722] via-[#FF6B4A] to-[#219d1b] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
      </div>
    </Link>
  );
}