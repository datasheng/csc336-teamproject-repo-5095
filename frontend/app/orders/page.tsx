// order history

"use client"

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Package } from "lucide-react";

export default function OrdersPage() {
  const searchParams = useSearchParams();
  const success = searchParams.get("success");

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

        {/* Mock Order History */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-4">
            <Package size={20} className="text-gray-400" />
            <p className="text-gray-600">
              Order history will appear here once backend integration is complete.
            </p>
          </div>

          {success && (
            <div className="border-t pt-4">
              <p className="text-sm text-gray-600 mb-4">
                Your most recent order:
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold">Order #12345</p>
                    <p className="text-sm text-gray-600">
                      Placed on {new Date().toLocaleDateString()}
                    </p>
                  </div>
                  <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full">
                    Preparing
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Estimated delivery: 30-40 minutes
                </p>
              </div>
            </div>
          )}

          <Link
            href="/restaurants"
            className="inline-block mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Order More Food
          </Link>
        </div>
      </div>
    </div>
  );
}