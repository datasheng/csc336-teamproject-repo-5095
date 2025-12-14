"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { MapPin, CreditCard } from "lucide-react";
import { api } from "@/lib/api";

export default function CheckoutPage() {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Only fields required by backend
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card"); // "card" | "cash"
  const [userId, setUserId] = useState<number | null>(null);

 useEffect(() => {
  if (typeof window === "undefined") return;

  // 1) Preferred: auth_user JSON
  const rawAuth = localStorage.getItem("auth_user");
  if (rawAuth) {
    try {
      const user = JSON.parse(rawAuth);
      const id = Number(user?.USER_ID);
      if (Number.isFinite(id)) {
        setUserId(id);
        return;
      }
    } catch {
      // ignore and try fallback
    }
  }

  // 2) Fallback: user_id string
  const rawId = localStorage.getItem("user_id");
  const id2 = rawId ? Number(rawId) : NaN;
  if (Number.isFinite(id2)) {
    setUserId(id2);
    return;
  }

  // 3) Not logged in
  router.push("/login?next=/checkout");
}, [router]);


  // Redirect to cart if empty (do this in an effect to avoid render-side navigation)
  useEffect(() => {
    if (userId === null) return; // wait for auth guard
    if (cartItems.length === 0) router.push("/cart");
  }, [cartItems.length, router]);

  // Pricing UI (frontend-only; not sent to backend)
  const subtotal = getCartTotal();
  const deliveryFee = 3.99;
  const tax = subtotal * 0.08;
  const total = subtotal + deliveryFee + tax;

  // Backend-required fields derived from cart
  const restaurantId = useMemo(() => {
    return cartItems.length > 0 ? cartItems[0].RESTAURANT_ID : null;
  }, [cartItems]);

  // Backend only needs MENU_ITEM_ID + QUANTITY (it looks up price server-side)
  const itemsPayload = useMemo(() => {
    return cartItems.map((item) => ({
      MENU_ITEM_ID: item.MENU_ITEM_ID,
      QUANTITY: item.quantity,
    }));
  }, [cartItems]);

  // Optional guard: backend supports ONE restaurant per order
  const hasMultipleRestaurants = useMemo(() => {
    if (cartItems.length === 0) return false;
    const first = cartItems[0].RESTAURANT_ID;
    return cartItems.some((i) => i.RESTAURANT_ID !== first);
  }, [cartItems]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!userId) {
      setError("Please sign in before checking out.");
      router.push("/login?next=/checkout");
      return;
    }

    if (!restaurantId) {
      setError("Missing restaurant ID. Please go back and try again.");
      return;
    }

    if (hasMultipleRestaurants) {
      setError("Please checkout items from only one restaurant per order.");
      return;
    }

    if (!deliveryAddress.trim()) {
      setError("Delivery address is required.");
      return;
    }

    try {
      setIsSubmitting(true);

      const orderPayload = {
        user_id: userId,
        RESTAURANT_ID: restaurantId,
        PAYMENT_METHOD: paymentMethod,
        delivery_address: deliveryAddress.trim(),
        items: itemsPayload,
      };

      // Uses your api.ts createOrder (which should now match backend schema)
      const created = await api.orders.create(orderPayload as any);

      // Backend returns get_order_details(order_id) which should include ORDER_ID
      const orderId =
        created?.ORDER_ID ??
        created?.order_id ??
        created?.ORDER?.ORDER_ID ??
        null;

      clearCart();

      const qs = orderId ? `?success=true&orderId=${orderId}` : `?success=true`;
      router.push(`/orders${qs}`);
    } catch (err: any) {
      console.error("Place order error:", err);
      setError(err?.message || "Failed to place order.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // While auth guard is resolving, render nothing (prevents flicker)
  if (userId === null) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Minimal required form */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <MapPin size={20} />
                  Delivery Address
                </h2>

                <input
                  type="text"
                  name="delivery_address"
                  placeholder="e.g., 123 Main St, Brooklyn, NY"
                  required
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <CreditCard size={20} />
                  Payment Method
                </h2>

                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="card">Card</option>
                  <option value="cash">Cash</option>
                </select>

                <p className="text-xs text-gray-500 mt-2">
                  This is a demo. Payment details are not collected; this field is only used to satisfy the backend order contract.
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
                  {error}
                </div>
              )}
            </div>

            {/* Order Summary (not sent to backend) */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>

                <div className="space-y-2 mb-4">
                  <div className="text-sm">
                    <p className="text-gray-600 mb-2">
                      {cartItems.length} item{cartItems.length > 1 ? "s" : ""}
                    </p>

                    {cartItems.map((item) => (
                      <div
                        key={item.MENU_ITEM_ID}
                        className="flex justify-between mb-1"
                      >
                        <span className="text-gray-600">
                          {item.quantity}x {item.ITEM_NAME}
                        </span>
                        <span>${(item.PRICE * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-2 mt-2 space-y-1">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Delivery Fee</span>
                      <span>${deliveryFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Tax</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between text-lg font-bold text-[#7F8C8D]:">
                      <span>Total</span>
                      <span className="text-purple-800">${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-purple-800 text-white py-3 rounded-lg hover:bg-purple-900 transition font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Placing order..." : "Place Order"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
