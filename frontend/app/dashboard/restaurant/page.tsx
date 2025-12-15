// frontend/app/dashboard/restaurant/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  TrendingUp,
  ShoppingBag,
  DollarSign,
  Users,
  Clock,
  ChefHat,
  LogIn,
  AlertCircle,
  Download,
} from "lucide-react";

interface Order {
  ORDER_ID: number;
  ORDER_DATE: string;
  TOTAL_AMOUNT: number;
  STATUS: string;
  USER_NAME?: string;
  items?: Array<{
    ITEM_NAME: string;
    QUANTITY: number;
    PRICE: number;
  }>;
}

interface RestaurantStats {
  RESTAURANT_NAME: string;
  TOTAL_ORDERS: number;
  TOTAL_REVENUE: number;
  AVG_ORDER_VALUE: number;
  UNIQUE_CUSTOMERS: number;
}

interface AuthUser {
  USER_ID: number;
  USER_NAME: string;
  EMAIL: string;
  ROLES: string;
  RESTAURANT_ID?: number;
}

type AccessState = "loading" | "unauthorized" | "not_logged_in" | "authorized";

const AUTH_STORAGE_KEY = "auth_user";

async function safeJson(res: Response) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

export default function RestaurantDashboardPage() {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

  const [accessState, setAccessState] = useState<AccessState>("loading");
  const [user, setUser] = useState<AuthUser | null>(null);

  const [stats, setStats] = useState<RestaurantStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [restaurantId, setRestaurantId] = useState<number | null>(null);
  const [restaurantName, setRestaurantName] = useState<string>("Your Restaurant");

  useEffect(() => {
    const authRaw = typeof window !== "undefined" ? localStorage.getItem(AUTH_STORAGE_KEY) : null;

    if (!authRaw) {
      setAccessState("not_logged_in");
      return;
    }

    try {
      const userData: AuthUser = JSON.parse(authRaw);
      setUser(userData);

      const role = (userData.ROLES ?? "").toString().toLowerCase();
      const isOwner = role === "restaurant_owner";

      if (!isOwner) {
        setAccessState("unauthorized");
        return;
      }

      setAccessState("authorized");

      const rid = Number(userData.RESTAURANT_ID ?? 2);
      setRestaurantId(Number.isFinite(rid) && rid > 0 ? rid : 2);
    } catch {
      setAccessState("not_logged_in");
    }
  }, []);

  useEffect(() => {
    if (accessState !== "authorized" || !restaurantId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const restaurantRes = await fetch(`${API_BASE}/api/restaurants/${restaurantId}`);
        const restaurantJson = await safeJson(restaurantRes);

        if (!restaurantRes.ok) {
          const msg =
            restaurantJson?.detail ||
            restaurantJson?.message ||
            `Failed to fetch restaurant details (HTTP ${restaurantRes.status})`;
          throw new Error(msg);
        }

        const myRestaurantName =
          restaurantJson?.restaurant?.RESTAURANT_NAME ||
          restaurantJson?.RESTAURANT_NAME ||
          "Your Restaurant";

        setRestaurantName(myRestaurantName);

        const revenueRes = await fetch(`${API_BASE}/api/reports/revenue`);
        const revenueJson = await safeJson(revenueRes);

        if (!revenueRes.ok) {
          const msg =
            revenueJson?.detail ||
            revenueJson?.message ||
            `Failed to fetch revenue data (HTTP ${revenueRes.status})`;
          throw new Error(msg);
        }

        const allStats: RestaurantStats[] = Array.isArray(revenueJson)
          ? revenueJson
          : Array.isArray(revenueJson?.data)
          ? revenueJson.data
          : [];

        const mine =
          allStats.find(
            (r) =>
              (r?.RESTAURANT_NAME ?? "").toString().toLowerCase() ===
              myRestaurantName.toLowerCase()
          ) ?? null;

        if (mine) {
          setStats(mine);
        } else {
          setStats({
            RESTAURANT_NAME: myRestaurantName,
            TOTAL_ORDERS: 0,
            TOTAL_REVENUE: 0,
            AVG_ORDER_VALUE: 0,
            UNIQUE_CUSTOMERS: 0,
          });
        }

        setRecentOrders([
          {
            ORDER_ID: 127,
            ORDER_DATE: new Date().toISOString(),
            TOTAL_AMOUNT: 52.97,
            STATUS: "PREPARING",
            USER_NAME: "Emily S.",
            items: [
              { ITEM_NAME: "Margherita Pizza", QUANTITY: 1, PRICE: 18.99 },
              { ITEM_NAME: "Pasta Carbonara", QUANTITY: 1, PRICE: 22.99 },
              { ITEM_NAME: "Tiramisu", QUANTITY: 1, PRICE: 10.99 },
            ],
          },
          {
            ORDER_ID: 126,
            ORDER_DATE: new Date(Date.now() - 25 * 60000).toISOString(),
            TOTAL_AMOUNT: 38.98,
            STATUS: "OUT_FOR_DELIVERY",
            USER_NAME: "David L.",
            items: [{ ITEM_NAME: "Pepperoni Pizza", QUANTITY: 2, PRICE: 19.49 }],
          },
          {
            ORDER_ID: 125,
            ORDER_DATE: new Date(Date.now() - 55 * 60000).toISOString(),
            TOTAL_AMOUNT: 45.99,
            STATUS: "DELIVERED",
            USER_NAME: "John D.",
            items: [
              { ITEM_NAME: "Lasagna", QUANTITY: 1, PRICE: 24.99 },
              { ITEM_NAME: "Caesar Salad", QUANTITY: 1, PRICE: 12.99 },
              { ITEM_NAME: "Garlic Bread", QUANTITY: 1, PRICE: 7.99 },
            ],
          },
        ]);

        setLoading(false);
      } catch (err: any) {
        setError(err?.message || "Failed to load dashboard data");
        setLoading(false);
      }
    };

    fetchData();
  }, [accessState, restaurantId, API_BASE]);

  const downloadRestaurantExcel = () => {
    if (!restaurantId) {
      alert("No restaurant ID found for this account.");
      return;
    }
    window.open(`${API_BASE}/api/reports/restaurant/${restaurantId}/excel`, "_blank");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PREPARING":
        return "bg-yellow-100 text-yellow-800";
      case "OUT_FOR_DELIVERY":
        return "bg-blue-100 text-blue-800";
      case "DELIVERED":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-purple-100 text-purple-800";
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return date.toLocaleDateString();
  };

  if (accessState === "not_logged_in") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F3EFF8] via-white to-[#FFE5E0] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-[#5B2C91] to-[#8B6FB0] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <LogIn size={40} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[#2C3E50] mb-3">Login Required</h1>
          <p className="text-[#7F8C8D] mb-6">
            Please sign in with your restaurant owner account to access this dashboard.
          </p>
          <Link
            href="/login?redirect=/dashboard/restaurant"
            className="inline-block w-full bg-gradient-to-r from-[#5B2C91] to-[#8B6FB0] text-white py-3 px-6 rounded-xl font-semibold hover:from-[#6B3CA1] hover:to-[#9B7FC0] transition-all shadow-lg"
          >
            Sign In
          </Link>
          <Link href="/dashboard" className="inline-block mt-4 text-[#5B2C91] hover:text-[#8B6FB0] font-medium">
            ← Back to Dashboards
          </Link>
        </div>
      </div>
    );
  }

  if (accessState === "unauthorized") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F3EFF8] via-white to-[#FFE5E0] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-[#FF5722] to-[#FF6B4A] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <AlertCircle size={40} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[#2C3E50] mb-3">Access Restricted</h1>
          <p className="text-[#7F8C8D] mb-2">This dashboard is only available to restaurant owners.</p>
          <p className="text-sm text-gray-500 mb-6">
            Logged in as: <span className="font-medium">{user?.EMAIL}</span>
          </p>

          <div className="flex gap-3">
            <Link
              href="/dashboard"
              className="flex-1 bg-gray-100 text-[#2C3E50] py-3 px-4 rounded-xl font-semibold hover:bg-gray-200 transition-all"
            >
              Back
            </Link>
            <button
              onClick={() => {
                localStorage.removeItem("auth_user");
                localStorage.removeItem("user_id");
                window.location.href = "/login?redirect=/dashboard/restaurant";
              }}
              className="flex-1 bg-gradient-to-r from-[#5B2C91] to-[#8B6FB0] text-white py-3 px-4 rounded-xl font-semibold hover:from-[#6B3CA1] hover:to-[#9B7FC0] transition-all"
            >
              Switch Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (accessState === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5B2C91] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <p className="text-red-800 font-semibold">Error loading dashboard</p>
          <p className="text-red-600 text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-[#FF5722] to-[#FF6B4A] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/dashboard" className="text-orange-200 hover:text-white transition-colors">
                <ArrowLeft size={20} />
              </Link>
              <ChefHat size={28} />
              <div>
                <h1 className="text-3xl font-bold">{restaurantName}</h1>
                <p className="text-orange-200 text-sm">Welcome Back, {user?.USER_NAME || "Owner"}</p>
              </div>
            </div>
            <div className="text-right text-sm text-orange-200">
              <p>Restaurant ID: {restaurantId}</p>
              <p>{user?.EMAIL}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Total Orders</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stats.TOTAL_ORDERS}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <ShoppingBag size={24} className="text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Total Revenue</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    ${Number(stats.TOTAL_REVENUE).toFixed(2)}
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <DollarSign size={24} className="text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Avg Order Value</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    ${Number(stats.AVG_ORDER_VALUE).toFixed(2)}
                  </p>
                </div>
                <div className="bg-orange-100 p-3 rounded-full">
                  <TrendingUp size={24} className="text-orange-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Unique Customers</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stats.UNIQUE_CUSTOMERS}</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <Users size={24} className="text-purple-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b bg-gray-50">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
              <span className="text-sm text-gray-500 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Live updates
              </span>
            </div>
          </div>

          <div className="divide-y">
            {recentOrders.map((order) => (
              <div key={order.ORDER_ID} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-gray-900">Order #{order.ORDER_ID}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.STATUS)}`}>
                        {order.STATUS.replace("_", " ")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                      <Clock size={14} />
                      <span>{formatTime(order.ORDER_DATE)}</span>
                      {order.USER_NAME && (
                        <>
                          <span>•</span>
                          <span>{order.USER_NAME}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <span className="text-lg font-bold text-green-600">${order.TOTAL_AMOUNT.toFixed(2)}</span>
                </div>

                {order.items && order.items.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-3 mt-2">
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Items</p>
                    <div className="space-y-1">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span className="text-gray-700">
                            {item.ITEM_NAME} × {item.QUANTITY}
                          </span>
                          <span className="text-gray-600">${(item.PRICE * item.QUANTITY).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {recentOrders.length === 0 && <div className="p-8 text-center text-gray-500">No recent orders to display</div>}
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={downloadRestaurantExcel}
            className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow flex items-center gap-4 text-left"
          >
            <div className="bg-green-100 p-3 rounded-full">
              <Download size={24} className="text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Download Your Revenue Report</h3>
              <p className="text-sm text-gray-500">Export Excel for Restaurant ID: {restaurantId}</p>
            </div>
          </button>

          <Link
            href="/restaurants"
            className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow flex items-center gap-4"
          >
            <div className="bg-orange-100 p-3 rounded-full">
              <ShoppingBag size={24} className="text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">View Your Menu</h3>
              <p className="text-sm text-gray-500">See how customers view your restaurant</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
