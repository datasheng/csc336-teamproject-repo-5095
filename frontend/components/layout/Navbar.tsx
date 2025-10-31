"use client"

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { ShoppingCart, User, Home, Store, Bell } from "lucide-react";

export default function Navbar() {
  const { cartItems } = useCart();
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50 border-b-2 border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 bg-gradient-to-br from-[#FF5722] to-[#FF6B4A] rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
              <Store size={24} className="text-white" />
            </div>
            <div className="hidden md:block">
              <div className="text-xl font-bold text-[#2C3E50]">Team 5095</div>
              <div className="text-xs text-[#FF5722] font-semibold">Delivery</div>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-2 md:gap-4">
            <Link 
              href="/" 
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-[#2C3E50] hover:bg-[#FFE5E0] hover:text-[#FF5722] transition-all duration-300 font-medium"
            >
              <Home size={20} />
              <span className="hidden sm:inline">Home</span>
            </Link>
            
            <Link 
              href="/restaurants" 
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-[#2C3E50] hover:bg-[#FFE5E0] hover:text-[#FF5722] transition-all duration-300 font-medium"
            >
              <Store size={20} />
              <span className="hidden sm:inline">Restaurants</span>
            </Link>
            
            <Link 
              href="/orders" 
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl text-[#2C3E50] hover:bg-[#FFE5E0] hover:text-[#FF5722] transition-all duration-300 font-medium"
            >
              Orders
            </Link>

            {/* Notifications */}
            <button className="relative p-2 rounded-xl hover:bg-[#FFE5E0] transition-all duration-300 group">
              <Bell size={20} className="text-[#7F8C8D] group-hover:text-[#FF5722]" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#FF5722] rounded-full"></span>
            </button>
            
            {/* Cart */}
            <Link 
              href="/cart" 
              className="relative flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#FF5722] to-[#FF6B4A] text-white hover:from-[#E64A19] hover:to-[#FF5722] transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
            >
              <ShoppingCart size={20} />
              <span className="hidden sm:inline">Cart</span>
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#219d1b] text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-lg animate-bounce">
                  {itemCount}
                </span>
              )}
            </Link>
            
            {/* User Profile */}
            <Link 
              href="/login" 
              className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-[#FF5722] text-[#FF5722] hover:bg-[#FF5722] hover:text-white transition-all duration-300 font-semibold"
            >
              <User size={18} />
              <span className="hidden md:inline">Login</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}