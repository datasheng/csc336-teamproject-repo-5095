// frontend/app/dashboard/revenue/page.tsx
"use client";

import { useState, useEffect } from "react";
import { DollarSign, TrendingUp, ShoppingBag, Users, ArrowLeft } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

type AuthUser = {
  USER_ID: number;
  USER_NAME: string;
  EMAIL: string;
  ROLES: "customer" | "restaurant_owner" | "driver" | "investor";
};

function getAuthUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("auth_user");
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    const role = parsed?.ROLES ?? parsed?.role;
    if (!role) return null;
    return { ...parsed, ROLES: role } as AuthUser;
  } catch {
    return null;
  }
}

// Mock revenue data - in production, this would come from your backend
const generateMockRevenueData = () => {
  const today = new Date();
  const dailyData: Array<{ date: string; revenue: number; orders: number; commission: number }> = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    dailyData.push({
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      revenue: Math.floor(Math.random() * 3000) + 2000,
      orders: Math.floor(Math.random() * 50) + 30,
      commission: Math.floor(Math.random() * 600) + 400,
    });
  }

  return dailyData;
};

export default function RevenueDashboard() {
  const router = useRouter();
  const pathname = usePathname();

  // Investor-only gate
  const [allowed, setAllowed] = useState(false);

  // Dashboard data
  const [revenueData, setRevenueData] = useState(generateMockRevenueData());

  // 1) Investor-only route guard
  useEffect(() => {
    const user = getAuthUser();

    if (!user) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }

    if (user.ROLES !== "investor") {
      router.replace("/dashboard");
      return;
    }

    setAllowed(true);
  }, [router, pathname]);

  // 2) Real-time demo updates only after allowed
  useEffect(() => {
    if (!allowed) return;

    const interval = setInterval(() => {
      setRevenueData((prevData) => {
        const newData = [...prevData];
        const lastDay = { ...newData[newData.length - 1] };

        // Simulate new order adding revenue
        lastDay.revenue += Math.floor(Math.random() * 50) + 20;
        lastDay.orders += 1;
        lastDay.commission += Math.floor(Math.random() * 10) + 5;

        newData[newData.length - 1] = lastDay;
        return newData;
      });
    }, 10000);

    return () => clearInterval(interval);
  }, [allowed]);

  // Block render until authorized
  if (!allowed) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Checking access...
      </div>
    );
  }

  // Calculate totals
  const totalRevenue = revenueData.reduce((sum, day) => sum + day.revenue, 0);
  const totalOrders = revenueData.reduce((sum, day) => sum + day.orders, 0);
  const totalCommission = revenueData.reduce((sum, day) => sum + day.commission, 0);
  const avgOrderValue = totalOrders === 0 ? 0 : totalRevenue / totalOrders;

  // Commission breakdown (mock logic)
  const restaurantCommission = totalCommission * 0.7; // 70% from restaurant fees
  const deliveryFees = totalCommission * 0.3; // 30% from delivery fees
  const serviceFees = totalRevenue * 0.05; // 5% service fee

  const MetricCard = ({
    icon: Icon,
    title,
    value,
    subtitle,
    trend,
    color,
  }: {
    icon: any;
    title: string;
    value: string | number;
    subtitle: string;
    trend?: number;
    color: string;
  }) => (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div
          className={`w-14 h-14 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}
        >
          <Icon size={28} className="text-white" />
        </div>
        {typeof trend === "number" && (
          <div
            className={`flex items-center gap-1 text-sm font-semibold ${
              trend > 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            <TrendingUp size={16} className={trend < 0 ? "rotate-180" : ""} />
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
      <p className="text-3xl font-bold text-[#2C3E50] mb-1">{value}</p>
      <p className="text-sm text-gray-500">{subtitle}</p>
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
            Revenue <span className="text-purple-gradient">Analytics</span>
          </h1>
          <p className="text-[#7F8C8D] text-lg">Platform performance and profit metrics</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            icon={DollarSign}
            title="Total Revenue (7 Days)"
            value={`$${totalRevenue.toLocaleString()}`}
            subtitle="Platform earnings"
            trend={12.5}
            color="from-[#5B2C91] to-[#8B6FB0]"
          />
          <MetricCard
            icon={ShoppingBag}
            title="Total Orders"
            value={totalOrders}
            subtitle="Past week"
            trend={8.3}
            color="from-[#219d1b] to-[#2ecc71]"
          />
          <MetricCard
            icon={TrendingUp}
            title="Commission Earned"
            value={`$${totalCommission.toLocaleString()}`}
            subtitle="Restaurant & delivery fees"
            trend={15.2}
            color="from-[#FF5722] to-[#FF6B4A]"
          />
          <MetricCard
            icon={Users}
            title="Average Order Value"
            value={`$${avgOrderValue.toFixed(2)}`}
            subtitle="Per transaction"
            trend={5.7}
            color="from-[#F4B942] to-[#FFB74D]"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Trend Chart */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-[#2C3E50] mb-6">Revenue Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#7F8C8D" />
                <YAxis stroke="#7F8C8D" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#5B2C91"
                  strokeWidth={3}
                  name="Revenue ($)"
                  dot={{ fill: "#5B2C91", r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Orders & Commission Chart */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-[#2C3E50] mb-6">Orders & Commission</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#7F8C8D" />
                <YAxis stroke="#7F8C8D" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Bar dataKey="orders" fill="#219d1b" name="Orders" radius={[8, 8, 0, 0]} />
                <Bar dataKey="commission" fill="#8B6FB0" name="Commission ($)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Sources */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-[#2C3E50] mb-6">Revenue Sources</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#F3EFF8] to-white rounded-xl">
                <div>
                  <p className="text-sm font-medium text-[#7F8C8D]">Restaurant Commission (20%)</p>
                  <p className="text-2xl font-bold text-[#5B2C91]">
                    ${restaurantCommission.toFixed(2)}
                  </p>
                </div>
                <div className="text-4xl">🍽️</div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#FFE5E0] to-white rounded-xl">
                <div>
                  <p className="text-sm font-medium text-[#7F8C8D]">Delivery Fees</p>
                  <p className="text-2xl font-bold text-[#FF5722]">${deliveryFees.toFixed(2)}</p>
                </div>
                <div className="text-4xl">🚗</div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#FFF8E1] to-white rounded-xl">
                <div>
                  <p className="text-sm font-medium text-[#7F8C8D]">Service Fees (5%)</p>
                  <p className="text-2xl font-bold text-[#F4B942]">${serviceFees.toFixed(2)}</p>
                </div>
                <div className="text-4xl">⚙️</div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#5B2C91] to-[#8B6FB0] rounded-xl mt-4">
                <div>
                  <p className="text-sm font-medium text-white/80">Total Platform Profit</p>
                  <p className="text-3xl font-bold text-white">
                    ${(restaurantCommission + deliveryFees + serviceFees).toFixed(2)}
                  </p>
                </div>
                <div className="text-4xl">💰</div>
              </div>
            </div>
          </div>

          {/* Performance Insights */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-[#2C3E50] mb-6">Performance Insights</h2>
            <div className="space-y-4">
              <div className="p-4 border-l-4 border-[#5B2C91] bg-[#F3EFF8] rounded-lg">
                <h3 className="font-bold text-[#5B2C91] mb-1">📈 Revenue Growth</h3>
                <p className="text-sm text-[#7F8C8D]">
                  Platform revenue increased by 12.5% this week compared to last week. Strong
                  performance from Italian and Indian cuisines.
                </p>
              </div>

              <div className="p-4 border-l-4 border-[#219d1b] bg-[#d5f4e6] rounded-lg">
                <h3 className="font-bold text-[#219d1b] mb-1">✅ High Order Volume</h3>
                <p className="text-sm text-[#7F8C8D]">
                  {totalOrders} orders processed this week. Peak times: 6-8 PM on weekdays, 12-2 PM
                  on weekends.
                </p>
              </div>

              <div className="p-4 border-l-4 border-[#FF5722] bg-[#FFE5E0] rounded-lg">
                <h3 className="font-bold text-[#FF5722] mb-1">🎯 Average Order Value</h3>
                <p className="text-sm text-[#7F8C8D]">
                  ${avgOrderValue.toFixed(2)} per order. Consider promotions to increase basket size
                  to $50+ target.
                </p>
              </div>

              <div className="p-4 border-l-4 border-[#F4B942] bg-[#FFF8E1] rounded-lg">
                <h3 className="font-bold text-[#F4B942] mb-1">💡 Optimization Opportunity</h3>
                <p className="text-sm text-[#7F8C8D]">
                  5 restaurants consistently deliver in under 25 minutes. Feature them as "Quick
                  Delivery" to boost orders.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Real-time Updates Note */}
        <div className="mt-8 bg-gradient-to-r from-[#5B2C91] to-[#8B6FB0] rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
            <h3 className="text-lg font-bold">Live Revenue Tracking</h3>
          </div>
          <p className="text-white/90">
            This dashboard updates in real-time as orders are placed and processed across the
            platform. All metrics reflect the investor perspective on platform profitability.
          </p>
        </div>
      </div>
    </div>
  );
}
