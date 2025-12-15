"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { ShoppingCart, User, Home, Store, LayoutDashboard, BarChart3, Receipt } from "lucide-react";
import { logout } from "@/lib/auth";
import { useEffect, useState } from "react";

function LogoutButton() {
  const handleLogout = () => {
    logout();
    // Force full page reload to reset all React state
    window.location.href = "/";
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-all duration-300 font-semibold"
    >
      Logout
    </button>
  );
}

export default function Navbar() {
  const { cartItems } = useCart();
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    // Check auth state on mount and when localStorage changes
    const checkAuth = () => {
      const raw = localStorage.getItem("auth_user");
      setIsLoggedIn(!!raw);
      
      if (raw) {
        try {
          const user = JSON.parse(raw);
          setUserRole(user?.ROLES || null);
        } catch {
          setUserRole(null);
        }
      } else {
        setUserRole(null);
      }
    };

    checkAuth();

    // Listen for storage changes (useful if logout happens in another tab)
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50 border-b-2 border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-16 h-30 relative group-hover:scale-110 transition-all duration-300">
              <Image
                src="/images/logo/taste-of-harlem-logo.png"
                alt="Taste of Harlem"
                width={80}
                height={80}
                className="object-contain"
              />
            </div>
            <div className="hidden md:block">
              <div className="text-xl font-bold text-[#2C3E50]">Taste of Harlem</div>
              <div className="text-xs text-[#5B2C91] font-semibold">Delivery</div>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-2 md:gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-[#2C3E50] hover:bg-[#F3EFF8] hover:text-[#5B2C91] transition-all duration-300 font-medium"
            >
              <Home size={20} />
              <span className="hidden sm:inline">Home</span>
            </Link>

            <Link
              href="/restaurants"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-[#2C3E50] hover:bg-[#F3EFF8] hover:text-[#5B2C91] transition-all duration-300 font-medium"
            >
              <Store size={20} />
              <span className="hidden sm:inline">Restaurants</span>
            </Link>

            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-[#2C3E50] hover:bg-[#F3EFF8] hover:text-[#5B2C91] transition-all duration-300 font-medium"
            >
              <LayoutDashboard size={20} />
              <span className="hidden lg:inline">Dashboards</span>
            </Link>

            {/* Admin Revenue - visible for demo purposes */}
            <Link
              href="/admin/revenue"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-[#2C3E50] hover:bg-[#F3EFF8] hover:text-[#5B2C91] transition-all duration-300 font-medium"
            >
              <BarChart3 size={20} />
              <span className="hidden lg:inline">Revenue</span>
            </Link>

            <Link
              href="/orders"
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl text-[#2C3E50] hover:bg-[#F3EFF8] hover:text-[#5B2C91] transition-all duration-300 font-medium"
            >
              <Receipt size={20} className="text-[#7F8C8D] group-hover:text-[#5B2C91]" />
              <span>Orders</span>
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#5B2C91] to-[#5B2C91] text-white hover:from-[#6B3CA1] hover:to-[#9B7FC0] transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
            >
              <ShoppingCart size={20} />
              <span className="hidden sm:inline">Cart</span>
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#FF5722] text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-lg animate-bounce">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Login vs Logout */}
            {isLoggedIn ? (
              <LogoutButton />
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-[#5B2C91] text-[#5B2C91] hover:bg-[#5B2C91] hover:text-white transition-all duration-300 font-semibold"
              >
                <User size={18} />
                <span className="hidden md:inline">Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}