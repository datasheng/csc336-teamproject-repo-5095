"use client"

import { useState } from "react";
import { Package, Clock, MapPin, Star, Heart, User, ArrowLeft, ShoppingBag } from "lucide-react";
import Link from "next/link";

// Mock customer data
const customerData = {
  name: "John Doe",
  email: "john.doe@email.com",
  phone: "(212) 555-0123",
  defaultAddress: "123 W 125th St, New York, NY 10027",
  memberSince: "January 2024",
  totalOrders: 24,
  totalSpent: 987.50,
};

// Mock order history
const mockOrderHistory = [
  {
    id: 1,
    orderNumber: "ORD-1001",
    restaurant: "FUMO Harlem",
    restaurantLogo: "🍕",
    items: ["Margherita Pizza x2", "Caesar Salad x1"],
    total: 42.97,
    status: "delivered",
    date: "2024-11-30T14:30:00",
    deliveryTime: "35 min",
    rating: 5,
  },
  {
    id: 2,
    orderNumber: "ORD-0987",
    restaurant: "Cafe One",
    restaurantLogo: "🍛",
    items: ["Jerk Chicken Plate", "Fried Plantains"],
    total: 19.98,
    status: "delivered",
    date: "2024-11-28T18:15:00",
    deliveryTime: "28 min",
    rating: 5,
  },
  {
    id: 3,
    orderNumber: "ORD-0965",
    restaurant: "Charles Pan Fried Chicken",
    restaurantLogo: "🍗",
    items: ["Fried Chicken Dinner", "Mac & Cheese", "Collard Greens"],
    total: 27.97,
    status: "delivered",
    date: "2024-11-25T19:00:00",
    deliveryTime: "31 min",
    rating: 4,
  },
  {
    id: 4,
    orderNumber: "ORD-0945",
    restaurant: "Burger & Shake Co",
    restaurantLogo: "🍔",
    items: ["BBQ Bacon Burger", "Chocolate Milkshake"],
    total: 19.98,
    status: "delivered",
    date: "2024-11-23T13:30:00",
    deliveryTime: "22 min",
    rating: 5,
  },
];

// Favorite restaurants
const favoriteRestaurants = [
  { id: 1, name: "FUMO Harlem", cuisine: "Italian", rating: 4.6, logo: "🍕" },
  { id: 2, name: "Cafe One", cuisine: "Indian", rating: 4.5, logo: "🍛" },
  { id: 5, name: "Charles Pan Fried Chicken", cuisine: "Southern", rating: 4.8, logo: "🍗" },
];

type OrderStatus = "delivered" | "in_progress" | "cancelled";

export default function CustomerDashboard() {
  const [activeTab, setActiveTab] = useState<"orders" | "favorites" | "profile">("orders");

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "delivered": return "from-[#219d1b] to-[#2ecc71]";
      case "in_progress": return "from-[#5B2C91] to-[#8B6FB0]";
      case "cancelled": return "from-gray-500 to-gray-600";
    }
  };

  const MetricCard = ({ icon: Icon, title, value, color }: any) => (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}>
          <Icon size={24} className="text-white" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-[#2C3E50]">{value}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F3EFF8] via-white to-[#FFE5E0] py-8">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <Link 
          href="/dashboard"
          className="inline-flex items-center gap-2 text-[#5B2C91] hover:text-[#8B6FB0] transition-colors mb-6 font-semibold"
        >
          <ArrowLeft size={20} />
          Back to Dashboards
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-[#5B2C91] to-[#8B6FB0] rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-xl">
              {customerData.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-4xl font-bold text-[#2C3E50]">
                Welcome back, <span className="text-purple-gradient">{customerData.name.split(' ')[0]}</span>
              </h1>
              <p className="text-[#7F8C8D] text-lg">Member since {customerData.memberSince}</p>
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <MetricCard
            icon={ShoppingBag}
            title="Total Orders"
            value={customerData.totalOrders}
            color="from-[#5B2C91] to-[#8B6FB0]"
          />
          <MetricCard
            icon={Package}
            title="Total Spent"
            value={`$${customerData.totalSpent.toFixed(2)}`}
            color="from-[#FF5722] to-[#FF6B4A]"
          />
          <MetricCard
            icon={Heart}
            title="Favorite Restaurants"
            value={favoriteRestaurants.length}
            color="from-[#F4B942] to-[#FFB74D]"
          />
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex gap-3 border-b-2 border-gray-200">
            {[
              { key: "orders", label: "Order History", icon: Package },
              { key: "favorites", label: "Favorites", icon: Heart },
              { key: "profile", label: "Profile", icon: User },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as any)}
                className={`flex items-center gap-2 px-6 py-3 font-semibold transition-all duration-300 ${
                  activeTab === key
                    ? 'text-[#5B2C91] border-b-4 border-[#5B2C91] -mb-0.5'
                    : 'text-[#7F8C8D] hover:text-[#5B2C91]'
                }`}
              >
                <Icon size={20} />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {/* Order History Tab */}
          {activeTab === "orders" && (
            <div className="space-y-4">
              {mockOrderHistory.map((order) => (
                <div key={order.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <div className="p-6">
                    {/* Order Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-[#F3EFF8] to-[#FFE5E0] rounded-xl flex items-center justify-center text-4xl">
                          {order.restaurantLogo}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-[#2C3E50] mb-1">
                            {order.restaurant}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {order.orderNumber} • {new Date(order.date).toLocaleDateString('en-US', { 
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                      <div className={`flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${getStatusColor(order.status)} text-white font-semibold text-sm shadow-lg`}>
                        {order.status === "delivered" && "✓ Delivered"}
                        {order.status === "in_progress" && "🚗 In Progress"}
                        {order.status === "cancelled" && "✗ Cancelled"}
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="bg-[#F3EFF8] rounded-xl p-4 mb-4">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="text-[#2C3E50] py-1">
                          • {item}
                        </div>
                      ))}
                    </div>

                    {/* Order Footer */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock size={16} />
                          {order.deliveryTime}
                        </div>
                        <div className="flex items-center gap-1">
                          <Star size={16} className="fill-[#F4B942] text-[#F4B942]" />
                          {order.rating}/5
                        </div>
                      </div>
                      <div>
                        <span className="text-2xl font-bold text-[#5B2C91]">
                          ${order.total.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-4 flex gap-3">
                      <button className="flex-1 bg-gradient-to-r from-[#5B2C91] to-[#8B6FB0] text-white py-2 rounded-xl font-semibold hover:from-[#6B3CA1] hover:to-[#9B7FC0] transition-all">
                        Reorder
                      </button>
                      <button className="px-6 bg-white border-2 border-[#5B2C91] text-[#5B2C91] py-2 rounded-xl font-semibold hover:bg-[#F3EFF8] transition-all">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Favorites Tab */}
          {activeTab === "favorites" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteRestaurants.map((restaurant) => (
                <div key={restaurant.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#F3EFF8] to-[#FFE5E0] rounded-xl flex items-center justify-center text-4xl">
                      {restaurant.logo}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-[#2C3E50] mb-1">
                        {restaurant.name}
                      </h3>
                      <p className="text-sm text-gray-600">{restaurant.cuisine}</p>
                    </div>
                    <Heart className="text-[#FF5722] fill-[#FF5722]" size={24} />
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                      <Star size={18} className="fill-[#F4B942] text-[#F4B942]" />
                      <span className="font-semibold text-[#2C3E50]">{restaurant.rating}</span>
                    </div>
                  </div>

                  <Link
                    href={`/restaurants/${restaurant.id}`}
                    className="block w-full bg-gradient-to-r from-[#5B2C91] to-[#8B6FB0] text-white text-center py-3 rounded-xl font-semibold hover:from-[#6B3CA1] hover:to-[#9B7FC0] transition-all"
                  >
                    Order Now
                  </Link>
                </div>
              ))}
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="max-w-2xl">
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-[#2C3E50] mb-6">Account Information</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-2">Full Name</label>
                    <div className="flex items-center gap-3 p-4 bg-[#F3EFF8] rounded-xl">
                      <User size={20} className="text-[#5B2C91]" />
                      <span className="text-[#2C3E50] font-medium">{customerData.name}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-2">Email</label>
                    <div className="flex items-center gap-3 p-4 bg-[#F3EFF8] rounded-xl">
                      <span className="text-2xl">📧</span>
                      <span className="text-[#2C3E50] font-medium">{customerData.email}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-2">Phone</label>
                    <div className="flex items-center gap-3 p-4 bg-[#F3EFF8] rounded-xl">
                      <span className="text-2xl">📱</span>
                      <span className="text-[#2C3E50] font-medium">{customerData.phone}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-2">Default Delivery Address</label>
                    <div className="flex items-center gap-3 p-4 bg-[#F3EFF8] rounded-xl">
                      <MapPin size={20} className="text-[#5B2C91]" />
                      <span className="text-[#2C3E50] font-medium">{customerData.defaultAddress}</span>
                    </div>
                  </div>

                  <button className="w-full bg-gradient-to-r from-[#5B2C91] to-[#8B6FB0] text-white py-3 rounded-xl font-semibold hover:from-[#6B3CA1] hover:to-[#9B7FC0] transition-all shadow-lg mt-6">
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}