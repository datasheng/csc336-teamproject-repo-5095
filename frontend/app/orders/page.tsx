"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Package, ChevronDown, ChevronUp } from "lucide-react";
import { api } from "@/lib/api";

type OrderItem = {
  MENU_ITEM_ID: number;
  ITEM_NAME: string;
  ITEM_DESCRIP?: string;
  QUANTITY: number;
  PRICE: number;
};

type Order = {
  ORDER_ID: number;
  ORDER_DATE: string;
  TOTAL_AMOUNT: number;
  STATUS?: string;
  RESTAURANT_NAME?: string;
  items?: OrderItem[];
};

// Helper to format date in local timezone
function formatOrderDate(dateString: string): string {
  // If the date string doesn't have timezone info, treat it as UTC
  const date = new Date(dateString.endsWith("Z") ? dateString : dateString + "Z");
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export default function OrdersPage() {
  const searchParams = useSearchParams();
  const success = searchParams.get("success");
  const orderIdFromQS = searchParams.get("orderId");

  const [userId, setUserId] = useState<number | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [expandedOrders, setExpandedOrders] = useState<Set<number>>(new Set());

  // Toggle order expansion
  const toggleExpand = (orderId: number) => {
    setExpandedOrders((prev) => {
      const next = new Set(prev);
      if (next.has(orderId)) {
        next.delete(orderId);
      } else {
        next.add(orderId);
      }
      return next;
    });
  };

  // Load user id from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;

    const rawAuth = localStorage.getItem("auth_user");
    if (rawAuth) {
      try {
        const u = JSON.parse(rawAuth);
        const id = Number(u?.USER_ID);
        if (Number.isFinite(id)) {
          setUserId(id);
          return;
        }
      } catch {}
    }

    const rawId = localStorage.getItem("user_id");
    const id2 = rawId ? Number(rawId) : NaN;
    if (Number.isFinite(id2)) {
      setUserId(id2);
      return;
    }

    setUserId(null);
  }, []);

  // Fetch orders once we have userId
  useEffect(() => {
    const run = async () => {
      if (!userId) {
        setOrders([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setErrorMsg(null);
        const data = await api.orders.getUserOrders(userId);
        setOrders(Array.isArray(data) ? data : []);
        
        // Auto-expand the most recent order or the one from query string
        if (data && data.length > 0) {
          const targetId = orderIdFromQS ? Number(orderIdFromQS) : data[0]?.ORDER_ID;
          if (targetId) {
            setExpandedOrders(new Set([targetId]));
          }
        }
      } catch (err: any) {
        setErrorMsg(err?.message || "Failed to load orders.");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [userId, orderIdFromQS]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
            <div className="flex items-center gap-3">
              <CheckCircle size={24} className="text-green-600" />
              <div>
                <h2 className="text-lg font-semibold text-green-900">
                  Order Placed Successfully!
                </h2>
                <p className="text-green-700">
                  Your order has been confirmed and will be delivered soon.
                </p>
              </div>
            </div>
          </div>
        )}

        <h1 className="text-3xl font-bold mb-6">Your Orders</h1>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-4">
            <Package size={20} className="text-gray-400" />
            <p className="text-gray-600">
              {loading
                ? "Loading your orders..."
                : userId
                ? "Here is your order history."
                : "Sign in to view your order history."}
            </p>
          </div>

          {errorMsg && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMsg}
            </div>
          )}

          {!loading && userId && orders.length === 0 && (
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
              No orders yet.
            </div>
          )}

          {!loading && orders.length > 0 && (
            <div className="space-y-3">
              {orders.map((o) => {
                const oid = o?.ORDER_ID ?? (o as any)?.order_id;
                const total = o?.TOTAL_AMOUNT ?? (o as any)?.total_amount;
                const status = o?.STATUS ?? (o as any)?.status ?? "PENDING";
                const restaurantName = o?.RESTAURANT_NAME ?? (o as any)?.restaurant_name;
                const items = o?.items ?? [];
                const isExpanded = expandedOrders.has(oid);

                return (
                  <div
                    key={String(oid)}
                    className="border rounded-lg overflow-hidden"
                  >
                    {/* Order Header - Clickable */}
                    <div
                      className="p-4 flex items-start justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => toggleExpand(oid)}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">Order #{oid}</p>
                          {restaurantName && (
                            <span className="text-sm text-gray-500">
                              • {restaurantName}
                            </span>
                          )}
                        </div>
                        {o?.ORDER_DATE && (
                          <p className="text-sm text-gray-600">
                            {formatOrderDate(o.ORDER_DATE)}
                          </p>
                        )}
                        {total != null && (
                          <p className="text-sm font-medium text-gray-800 mt-1">
                            Total: ${Number(total).toFixed(2)}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="bg-purple-800 text-white text-xs px-3 py-1 rounded-full">
                          {status}
                        </span>
                        {isExpanded ? (
                          <ChevronUp size={20} className="text-gray-400" />
                        ) : (
                          <ChevronDown size={20} className="text-gray-400" />
                        )}
                      </div>
                    </div>

                    {/* Order Items - Expandable */}
                    {isExpanded && items.length > 0 && (
                      <div className="border-t bg-gray-50 px-4 py-3">
                        <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                          Order Items
                        </p>
                        <div className="space-y-2">
                          {items.map((item, idx) => (
                            <div
                              key={item.MENU_ITEM_ID ?? idx}
                              className="flex justify-between items-center text-sm"
                            >
                              <div>
                                <span className="font-medium">
                                  {item.ITEM_NAME ?? `Item #${item.MENU_ITEM_ID}`}
                                </span>
                                <span className="text-gray-500 ml-2">
                                  × {item.QUANTITY}
                                </span>
                              </div>
                              <span className="text-gray-700">
                                ${(Number(item.PRICE) * item.QUANTITY).toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Show message if no items */}
                    {isExpanded && items.length === 0 && (
                      <div className="border-t bg-gray-50 px-4 py-3 text-sm text-gray-500">
                        No item details available
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <Link
            href="/restaurants"
            className="inline-block mt-6 bg-purple-800 text-white px-6 py-2 rounded-lg hover:bg-purple-900 transition"
          >
            Order More Food
          </Link>
        </div>
      </div>
    </div>
  );
}