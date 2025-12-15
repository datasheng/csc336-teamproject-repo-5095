// frontend/app/admin/revenue/page.tsx
"use client";

import { useState, useEffect } from "react";
import { BarChart3, Table, Download, TrendingUp, LogIn, AlertCircle } from "lucide-react";
import Link from "next/link";

type AuthUser = {
  USER_ID: number;
  USER_NAME: string;
  EMAIL: string;
  ROLES: "customer" | "restaurant_owner" | "driver" | "investor" | string;
};

function getAuthUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("auth_user");
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    const role = (parsed?.ROLES ?? parsed?.role ?? "").toString().toLowerCase();
    if (!role) return null;
    return { ...parsed, ROLES: role } as AuthUser;
  } catch {
    return null;
  }
}

interface RevenueData {
  RESTAURANT_NAME: string;
  TOTAL_ORDERS: number;
  TOTAL_REVENUE: number;
  AVG_ORDER_VALUE: number;
  UNIQUE_CUSTOMERS: number;
  PLATFORM_COMMISSION: number;
}

type ViewMode = "table" | "tableau";
type AccessState = "loading" | "not_logged_in" | "unauthorized" | "authorized";

async function safeJson(res: Response) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

export default function AdminRevenuePage() {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

  const [accessState, setAccessState] = useState<AccessState>("loading");
  const [user, setUser] = useState<AuthUser | null>(null);

  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [revenue, setRevenue] = useState<RevenueData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const DELIVERY_COMMISSION_PER_ORDER = 0.60;
  const SERVICE_FEE_PER_ORDER = 2.99;

  // Investor-only guard (NO redirect; show UI states)
  useEffect(() => {
    const u = getAuthUser();

    if (!u) {
      setAccessState("not_logged_in");
      return;
    }

    setUser(u);

    const role = (u.ROLES ?? "").toString().toLowerCase();
    if (role !== "investor") {
      setAccessState("unauthorized");
      return;
    }

    setAccessState("authorized");
  }, []);

  // Fetch only after authorized
  useEffect(() => {
    if (accessState !== "authorized") return;

    const fetchRevenue = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`${API_BASE}/api/reports/revenue`);
        const data = await safeJson(res);

        if (!res.ok) {
          const msg =
            data?.detail || data?.message || `Failed to load revenue data (HTTP ${res.status})`;
          throw new Error(msg);
        }

        if (Array.isArray(data)) {
          setRevenue(data);
        } else if (data?.data && Array.isArray(data.data)) {
          setRevenue(data.data);
        } else {
          throw new Error("Invalid data format received from server");
        }
      } catch (err: any) {
        setError(err?.message || "Failed to load revenue data");
      } finally {
        setLoading(false);
      }
    };

    fetchRevenue();
  }, [accessState, API_BASE]);

  const downloadExcel = () => {
    window.open(`${API_BASE}/api/reports/revenue/excel`, "_blank");
  };

  // Totals
  const totals = {
    restaurants: revenue.length,

    orders: revenue.reduce((sum, r) => sum + (r.TOTAL_ORDERS || 0), 0),

    revenue: revenue.reduce((sum, r) => sum + (r.TOTAL_REVENUE || 0), 0),

    customers: revenue.reduce((sum, r) => sum + (r.UNIQUE_CUSTOMERS || 0), 0),

    platformCommission: revenue.reduce((sum, r) => sum + (r.PLATFORM_COMMISSION || 0), 0),
  };

  const serviceFeeRevenue = totals.orders * SERVICE_FEE_PER_ORDER;
  const deliveryCommissionRevenue = totals.orders * DELIVERY_COMMISSION_PER_ORDER;
  const totalPlatformRevenue = totals.platformCommission + serviceFeeRevenue + deliveryCommissionRevenue;


  // Login Required UI (no redirect)
  if (accessState === "not_logged_in") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F3EFF8] via-white to-[#FFE5E0] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-[#5B2C91] to-[#8B6FB0] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <LogIn size={40} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[#2C3E50] mb-3">Login Required</h1>
          <p className="text-[#7F8C8D] mb-6">
            Please sign in with an investor account to view platform revenue analytics.
          </p>
          <Link
            href="/login"
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

  // Unauthorized UI (no redirect)
  if (accessState === "unauthorized") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F3EFF8] via-white to-[#FFE5E0] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-[#FF5722] to-[#FF6B4A] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <AlertCircle size={40} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[#2C3E50] mb-3">Access Restricted</h1>
          <p className="text-[#7F8C8D] mb-2">This page is only available to investors.</p>
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
                window.location.href = "/login";
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

  // Loading gate
  if (accessState === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Checking access...
      </div>
    );
  }

  // Authorized render
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <TrendingUp className="text-[#5B2C91]" size={32} />
                Platform Revenue Analytics
              </h1>
              <p className="text-gray-600 mt-1">
                System-wide revenue reporting across all restaurants
              </p>
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl">
              <button
                onClick={() => setViewMode("table")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  viewMode === "table"
                    ? "bg-white text-[#5B2C91] shadow-md"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Table size={18} />
                <span>Data Table</span>
              </button>
              <button
                onClick={() => setViewMode("tableau")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  viewMode === "tableau"
                    ? "bg-white text-[#5B2C91] shadow-md"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <BarChart3 size={18} />
                <span>Tableau</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-md p-5 border-l-4 border-orange-500">
            <p className="text-gray-500 text-sm font-medium">Restaurants</p>
            <p className="text-3xl font-bold text-orange-600 mt-1">
              {totals.restaurants}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-5 border-l-4 border-blue-500">
            <p className="text-gray-500 text-sm font-medium">Total Orders</p>
            <p className="text-3xl font-bold text-blue-600 mt-1">
              {totals.orders}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-5 border-l-4 border-green-500">
            <p className="text-gray-500 text-sm font-medium">Gross Order Revenue</p>
            <p className="text-3xl font-bold text-green-600 mt-1">
              ${totals.revenue.toFixed(2)}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-5 border-l-4 border-purple-500">
            <p className="text-gray-500 text-sm font-medium">Restaurant Commissions</p>
            <p className="text-3xl font-bold text-purple-600 mt-1">
              ${totals.platformCommission.toFixed(2)}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-5 border-l-4 border-yellow-500">
            <p className="text-gray-500 text-sm font-medium">Service Fees</p>
            <p className="text-3xl font-bold text-yellow-600 mt-1">
              ${serviceFeeRevenue.toFixed(2)}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-5 border-l-4 border-red-500">
            <p className="text-gray-500 text-sm font-medium">Delivery Commission</p>
            <p className="text-3xl font-bold text-red-600 mt-1">
              ${deliveryCommissionRevenue.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-[#5B2C91] to-[#7B4CB1] text-white rounded-xl p-6 mb-6 shadow-lg">
          <p className="text-sm opacity-90">Total Platform Revenue</p>
          <p className="text-4xl font-bold mt-1">
            ${totalPlatformRevenue.toFixed(2)}
          </p>
          <p className="text-sm opacity-80 mt-1">
            Includes restaurant commissions, service fees, and delivery commission
          </p>
        </div>        
        
        {viewMode === "table" ? (
          <div className="space-y-6">
            <button
              onClick={downloadExcel}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all hover:shadow-xl"
            >
              <Download size={20} />
              Download Revenue Report (Excel)
            </button>

            {loading && (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5B2C91] mx-auto mb-4"></div>
                <p className="text-gray-600">Loading revenue data...</p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <p className="text-red-800 font-semibold">Error loading revenue data</p>
                <p className="text-red-600 text-sm mt-1">{error}</p>
              </div>
            )}

            {!loading && !error && revenue.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="px-6 py-4 bg-gray-50 border-b">
                  <h2 className="text-xl font-semibold text-gray-900">Revenue by Restaurant</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-100 border-b">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Restaurant</th>
                        <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Total Orders</th>
                        <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Total Revenue</th>
                        <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Avg Order Value</th>
                        <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Unique Customers</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {revenue.map((restaurant) => (
                        <tr key={restaurant.RESTAURANT_NAME} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">{restaurant.RESTAURANT_NAME}</td>
                          <td className="px-6 py-4 text-sm text-right text-gray-700">{restaurant.TOTAL_ORDERS}</td>
                          <td className="px-6 py-4 text-sm text-right font-semibold text-green-600">
                            ${restaurant.TOTAL_REVENUE.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 text-sm text-right text-gray-700">
                            ${restaurant.AVG_ORDER_VALUE.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 text-sm text-right text-gray-700">{restaurant.UNIQUE_CUSTOMERS}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50 border-t-2 border-gray-200">
                      <tr>
                        <td className="px-6 py-4 text-sm font-bold text-gray-900">TOTAL</td>
                        <td className="px-6 py-4 text-sm text-right font-bold text-gray-900">{totals.orders}</td>
                        <td className="px-6 py-4 text-sm text-right font-bold text-green-600">${totals.revenue.toFixed(2)}</td>
                        <td className="px-6 py-4 text-sm text-right text-gray-500">—</td>
                        <td className="px-6 py-4 text-sm text-right font-bold text-gray-900">{totals.customers}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            )}

            {!loading && !error && revenue.length === 0 && (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <p className="text-gray-500">No revenue data available</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="px-6 py-4 bg-gradient-to-r from-[#5B2C91] to-[#7B4CB1] text-white">
                <div className="flex items-center gap-2">
                  <BarChart3 size={24} />
                  <h2 className="text-xl font-semibold">Interactive Dashboard</h2>
                </div>
                <p className="text-purple-200 text-sm mt-1">
                  Powered by Tableau - Click and interact with the visualizations
                </p>
              </div>

              <div className="p-4">
                <div className="w-full" style={{ minHeight: "700px" }}>
                  <iframe
                    src="https://public.tableau.com/views/TasteOfHarlem/Dashboard1?:language=en-US&:display_count=n&:origin=viz_share_link&:showVizHome=no&:embed=true"
                    width="100%"
                    height="700"
                    frameBorder="0"
                    allowFullScreen
                    className="rounded-lg"
                  ></iframe>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg shadow-md p-4">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <span>📊</span> What This Shows
                </h3>
                <p className="text-sm text-gray-600">
                  Platform-wide metrics including total orders, revenue distribution,
                  and restaurant performance comparisons.
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-4">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <span>👥</span> Who Uses This
                </h3>
                <p className="text-sm text-gray-600">
                  Platform administrators and investors tracking overall business health
                  and growth metrics.
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-4">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <span>💡</span> Pro Tip
                </h3>
                <p className="text-sm text-gray-600">
                  Click on chart elements to filter data. Hover for details. Use the
                  toolbar for additional options.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
