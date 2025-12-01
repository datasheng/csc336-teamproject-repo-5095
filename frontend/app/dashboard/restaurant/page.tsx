"use client"

import { useState } from "react";
import { Package, Clock, CheckCircle, XCircle, DollarSign, TrendingUp, ArrowLeft } from "lucide-react";
import Link from "next/link";

// Mock orders data
const mockOrders = [
  {
    id: 1,
    orderNumber: "ORD-1001",
    customerName: "John Doe",
    items: [
      { name: "Margherita Pizza", quantity: 2, price: 16.99 },
      { name: "Caesar Salad", quantity: 1, price: 8.99 },
    ],
    total: 42.97,
    status: "pending",
    timestamp: "2024-11-30T14:30:00",
    deliveryAddress: "123 W 125th St, New York, NY",
  },
  {
    id: 2,
    orderNumber: "ORD-1002",
    customerName: "Jane Smith",
    items: [
      { name: "Rigatoni Bolognese", quantity: 1, price: 18.99 },
      { name: "Tiramisu", quantity: 2, price: 9.99 },
    ],
    total: 38.97,
    status: "preparing",
    timestamp: "2024-11-30T14:45:00",
    deliveryAddress: "456 Frederick Douglass Blvd, New York, NY",
  },
  {
    id: 3,
    orderNumber: "ORD-1003",
    customerName: "Mike Johnson",
    items: [
      { name: "Prosciutto e Arugula Pizza", quantity: 1, price: 19.99 },
      { name: "Burrata & Tomatoes", quantity: 1, price: 14.99 },
    ],
    total: 34.98,
    status: "ready",
    timestamp: "2024-11-30T15:00:00",
    deliveryAddress: "789 Adam Clayton Powell Jr Blvd, New York, NY",
  },
  {
    id: 4,
    orderNumber: "ORD-1004",
    customerName: "Sarah Williams",
    items: [
      { name: "Margherita Pizza", quantity: 1, price: 16.99 },
    ],
    total: 16.99,
    status: "delivered",
    timestamp: "2024-11-30T13:15:00",
    deliveryAddress: "321 Malcolm X Blvd, New York, NY",
  },
];

type OrderStatus = "pending" | "preparing" | "ready" | "delivered" | "cancelled";

export default function RestaurantDashboard() {
  const [orders, setOrders] = useState(mockOrders);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  // Calculate metrics
  const todayRevenue = orders
    .filter(order => order.status === "delivered")
    .reduce((sum, order) => sum + order.total, 0);
  
  const restaurantEarnings = todayRevenue * 0.8; // Restaurant gets 80% (platform takes 20%)
  const pendingOrders = orders.filter(o => o.status === "pending").length;
  const activeOrders = orders.filter(o => ["pending", "preparing", "ready"].includes(o.status)).length;

  const updateOrderStatus = (orderId: number, newStatus: OrderStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "pending": return "from-[#F4B942] to-[#FFB74D]";
      case "preparing": return "from-[#FF5722] to-[#FF6B4A]";
      case "ready": return "from-[#5B2C91] to-[#8B6FB0]";
      case "delivered": return "from-[#219d1b] to-[#2ecc71]";
      case "cancelled": return "from-gray-500 to-gray-600";
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case "pending": return <Clock size={20} />;
      case "preparing": return <Package size={20} />;
      case "ready": return <CheckCircle size={20} />;
      case "delivered": return <CheckCircle size={20} />;
      case "cancelled": return <XCircle size={20} />;
    }
  };

  const filteredOrders = selectedStatus === "all" 
    ? orders 
    : orders.filter(order => order.status === selectedStatus);

  const MetricCard = ({ icon: Icon, title, value, subtitle, color }: any) => (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center gap-4 mb-2">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}>
          <Icon size={24} className="text-white" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-[#2C3E50]">{value}</p>
        </div>
      </div>
      {subtitle && <p className="text-sm text-gray-500 mt-2">{subtitle}</p>}
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
          <h1 className="text-4xl font-bold text-[#2C3E50] mb-2">
            Restaurant <span className="text-purple-gradient">Dashboard</span>
          </h1>
          <p className="text-[#7F8C8D] text-lg">FUMO Harlem - Order Management</p>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            icon={DollarSign}
            title="Today's Revenue"
            value={`$${restaurantEarnings.toFixed(2)}`}
            subtitle="Your earnings (80% of orders)"
            color="from-[#5B2C91] to-[#8B6FB0]"
          />
          <MetricCard
            icon={Package}
            title="Pending Orders"
            value={pendingOrders}
            subtitle="Need confirmation"
            color="from-[#F4B942] to-[#FFB74D]"
          />
          <MetricCard
            icon={TrendingUp}
            title="Active Orders"
            value={activeOrders}
            subtitle="In progress"
            color="from-[#FF5722] to-[#FF6B4A]"
          />
          <MetricCard
            icon={CheckCircle}
            title="Total Orders Today"
            value={orders.length}
            subtitle="All statuses"
            color="from-[#219d1b] to-[#2ecc71]"
          />
        </div>

        {/* Status Filter */}
        <div className="mb-6">
          <div className="flex gap-3 overflow-x-auto pb-2">
            {["all", "pending", "preparing", "ready", "delivered"].map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-6 py-3 rounded-full font-semibold whitespace-nowrap transition-all duration-300 ${
                  selectedStatus === status
                    ? 'bg-gradient-to-r from-[#5B2C91] to-[#8B6FB0] text-white shadow-lg scale-105'
                    : 'bg-white text-[#7F8C8D] hover:bg-[#F3EFF8] hover:text-[#5B2C91] shadow-md'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
                {status === "all" && ` (${orders.length})`}
                {status !== "all" && ` (${orders.filter(o => o.status === status).length})`}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <Package size={64} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-bold text-gray-700 mb-2">No orders found</h3>
              <p className="text-gray-500">
                {selectedStatus === "all" 
                  ? "You don't have any orders yet." 
                  : `No ${selectedStatus} orders at the moment.`}
              </p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="p-6">
                  {/* Order Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-[#2C3E50] mb-1">
                        {order.orderNumber}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {order.customerName} • {new Date(order.timestamp).toLocaleTimeString('en-US', { 
                          hour: 'numeric', 
                          minute: '2-digit',
                          hour12: true 
                        })}
                      </p>
                    </div>
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${getStatusColor(order.status)} text-white font-semibold shadow-lg`}>
                      {getStatusIcon(order.status)}
                      <span className="capitalize">{order.status}</span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="bg-[#F3EFF8] rounded-xl p-4 mb-4">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center py-2">
                        <span className="text-[#2C3E50]">
                          <span className="font-semibold">{item.quantity}x</span> {item.name}
                        </span>
                        <span className="font-semibold text-[#5B2C91]">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                    <div className="border-t border-[#8B6FB0]/20 mt-2 pt-2 flex justify-between items-center">
                      <span className="font-bold text-[#2C3E50]">Order Total</span>
                      <span className="font-bold text-[#5B2C91] text-lg">
                        ${order.total.toFixed(2)}
                      </span>
                    </div>
                    <div className="mt-2 pt-2 flex justify-between items-center text-sm">
                      <span className="text-gray-600">Your Earnings (80%)</span>
                      <span className="font-semibold text-[#219d1b]">
                        ${(order.total * 0.8).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Delivery Address */}
                  <div className="mb-4 text-sm text-gray-600">
                    <span className="font-semibold">Delivery to:</span> {order.deliveryAddress}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    {order.status === "pending" && (
                      <>
                        <button
                          onClick={() => updateOrderStatus(order.id, "preparing")}
                          className="flex-1 bg-gradient-to-r from-[#5B2C91] to-[#8B6FB0] text-white py-3 rounded-xl font-semibold hover:from-[#6B3CA1] hover:to-[#9B7FC0] transition-all shadow-lg"
                        >
                          Confirm & Start Preparing
                        </button>
                        <button
                          onClick={() => updateOrderStatus(order.id, "cancelled")}
                          className="px-6 bg-white border-2 border-red-500 text-red-500 py-3 rounded-xl font-semibold hover:bg-red-50 transition-all"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                    {order.status === "preparing" && (
                      <button
                        onClick={() => updateOrderStatus(order.id, "ready")}
                        className="flex-1 bg-gradient-to-r from-[#5B2C91] to-[#8B6FB0] text-white py-3 rounded-xl font-semibold hover:from-[#6B3CA1] hover:to-[#9B7FC0] transition-all shadow-lg"
                      >
                        Mark as Ready for Pickup
                      </button>
                    )}
                    {order.status === "ready" && (
                      <div className="flex-1 bg-gradient-to-r from-[#8B6FB0] to-[#9B7FC0] text-white py-3 rounded-xl font-semibold text-center">
                        Waiting for Driver Pickup
                      </div>
                    )}
                    {order.status === "delivered" && (
                      <div className="flex-1 bg-gradient-to-r from-[#219d1b] to-[#2ecc71] text-white py-3 rounded-xl font-semibold text-center flex items-center justify-center gap-2">
                        <CheckCircle size={20} />
                        Delivered Successfully
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}