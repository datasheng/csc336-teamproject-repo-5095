// frontend/app/admin/revenue/page.tsx
'use client';
import { useState, useEffect } from 'react';

// Define the type for revenue data
interface RevenueData {
  RESTAURANT_NAME: string;
  TOTAL_ORDERS: number;
  TOTAL_REVENUE: number;
  AVG_ORDER_VALUE: number;
  UNIQUE_CUSTOMERS: number;
}

export default function AdminRevenuePage() {
  const [revenue, setRevenue] = useState<RevenueData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('Fetching revenue data...');
    
    fetch('http://localhost:8000/api/reports/revenue')
      .then(res => {
        console.log('Response status:', res.status);
        return res.json();
      })
      .then(data => {
        console.log('Received data:', data);
        console.log('Data type:', typeof data);
        console.log('Is array?', Array.isArray(data));
        
        // Check if data is an array
        if (Array.isArray(data)) {
          setRevenue(data);
        } else {
          console.error('Data is not an array:', data);
          setError('Invalid data format received from server');
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching revenue:', error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const downloadExcel = () => {
    window.open('http://localhost:8000/api/reports/revenue/excel', '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading revenue data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">Error loading revenue data</p>
          <p>{error}</p>
          <p className="mt-2 text-sm">Check console for details</p>
        </div>
      </div>
    );
  }

  if (!revenue || revenue.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">No revenue data available</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Platform Revenue Analytics
          </h1>
          <p className="text-gray-600">
            System-wide revenue reporting across all restaurants
          </p>
        </div>

        {/* Excel Download Button */}
        <div className="mb-6">
          <button
            onClick={downloadExcel}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition flex items-center gap-2"
          >
            <span className="text-xl">📥</span>
            Download Revenue Report (Excel)
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm mb-1">Total Restaurants</p>
            <p className="text-3xl font-bold text-orange-600">{revenue.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm mb-1">Total Orders</p>
            <p className="text-3xl font-bold text-blue-600">
              {revenue.reduce((sum, r) => sum + (r.TOTAL_ORDERS || 0), 0)}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm mb-1">Total Revenue</p>
            <p className="text-3xl font-bold text-green-600">
              ${revenue.reduce((sum, r) => sum + (r.TOTAL_REVENUE || 0), 0).toFixed(2)}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm mb-1">Total Customers</p>
            <p className="text-3xl font-bold text-purple-600">
              {revenue.reduce((sum, r) => sum + (r.UNIQUE_CUSTOMERS || 0), 0)}
            </p>
          </div>
        </div>

        {/* Revenue Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b">
            <h2 className="text-xl font-semibold">Revenue by Restaurant</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Restaurant
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">
                    Total Orders
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">
                    Total Revenue
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">
                    Avg Order Value
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">
                    Unique Customers
                  </th>
                </tr>
              </thead>
              <tbody>
                {revenue.map((restaurant, index) => (
                  <tr 
                    key={restaurant.RESTAURANT_NAME}
                    className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {restaurant.RESTAURANT_NAME}
                    </td>
                    <td className="px-6 py-4 text-sm text-right text-gray-700">
                      {restaurant.TOTAL_ORDERS}
                    </td>
                    <td className="px-6 py-4 text-sm text-right font-semibold text-green-600">
                      ${restaurant.TOTAL_REVENUE.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm text-right text-gray-700">
                      ${restaurant.AVG_ORDER_VALUE.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm text-right text-gray-700">
                      {restaurant.UNIQUE_CUSTOMERS}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}