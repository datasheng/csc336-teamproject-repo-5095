"use client"

import { useCart } from "@/context/CartContext";
import CartItem from "@/components/cart/CartItem";
import Link from "next/link";
import { ShoppingBag, ArrowLeft } from "lucide-react";

export default function CartPage() {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const subtotal = getCartTotal();
  const deliveryFee = cartItems.length > 0 ? 3.99 : 0;
  const serviceFee = cartItems.length > 0 ? 2.99 : 0; // Platform service fee
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + deliveryFee + serviceFee + tax;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F3EFF8] via-white to-[#FFE5E0] flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag size={80} className="mx-auto text-[#8B6FB0] mb-6" />
          <h2 className="text-3xl font-bold text-[#2C3E50] mb-3">
            Your cart is empty
          </h2>
          <p className="text-[#7F8C8D] mb-8 text-lg">
            Add some delicious items from our restaurants!
          </p>
          <Link
            href="/restaurants"
            className="inline-block bg-gradient-to-r from-[#5B2C91] to-[#8B6FB0] text-white px-8 py-4 rounded-xl hover:shadow-lg transition-all duration-300 font-semibold"
          >
            Browse Restaurants
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F3EFF8] via-white to-[#FFE5E0] py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/restaurants"
            className="text-[#5B2C91] hover:text-[#8B6FB0] flex items-center gap-2 mb-4 font-semibold transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Restaurants
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-[#2C3E50]">Your Cart</h1>
              <p className="text-[#7F8C8D] mt-1">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}</p>
            </div>
            <button
              onClick={clearCart}
              className="text-red-500 hover:text-red-600 text-sm font-semibold hover:underline transition-colors"
            >
              Clear Cart
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <CartItem key={item.MENU_ITEM_ID} item={item} />
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-lg p-8 sticky top-4 border-t-4 border-[#5B2C91]">
              <h2 className="text-2xl font-bold text-[#2C3E50] mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-[#7F8C8D]">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#2C3E50]">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#7F8C8D]">
                  <span>Delivery Fee</span>
                  <span className="font-semibold text-[#2C3E50]">${deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#7F8C8D]">
                  <span>Service Fee</span>
                  <span className="font-semibold text-[#2C3E50]">${serviceFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#7F8C8D]">
                  <span>Tax (8%)</span>
                  <span className="font-semibold text-[#2C3E50]">${tax.toFixed(2)}</span>
                </div>
                <div className="border-t-2 border-[#F3EFF8] pt-3 mt-3">
                  <div className="flex justify-between text-xl font-bold">
                    <span className="text-[#2C3E50]">Total</span>
                    <span className="bg-gradient-to-r from-[#5B2C91] to-[#8B6FB0] bg-clip-text text-transparent">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <Link
                href="/checkout"
                className="block w-full bg-gradient-to-r from-[#5B2C91] to-[#8B6FB0] text-white text-center py-4 rounded-xl hover:shadow-lg transition-all duration-300 font-bold mb-3"
              >
                Proceed to Checkout
              </Link>

              <Link
                href="/restaurants"
                className="block w-full text-center text-[#5B2C91] hover:text-[#8B6FB0] font-semibold transition-colors"
              >
                Add more items
              </Link>

              {/* Platform Profit Info */}
              <div className="mt-6 p-4 bg-gradient-to-r from-[#F3EFF8] to-[#FFE5E0] rounded-xl">
                <p className="text-xs text-[#7F8C8D] text-center">
                  💡 Platform earns ${(subtotal * 0.15 + serviceFee + deliveryFee * 0.30).toFixed(2)} from this order
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}