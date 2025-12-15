"use client"

import Link from "next/link";
import { BarChart3, Store, ArrowLeft } from "lucide-react";

export default function DashboardNav() {
  const dashboards = [
    {
      name: "Revenue Analytics",
      description: "Platform profit & investor metrics",
      href: "/admin/revenue",
      icon: BarChart3,
      color: "from-[#5B2C91] to-[#8B6FB0]",
      role: "Investor/Admin",
      emoji: "📊"
    },
    {
      name: "Restaurant Portal",
      description: "Manage orders & view performance",
      href: "/dashboard/restaurant",
      icon: Store,
      color: "from-[#FF5722] to-[#FF6B4A]",
      role: "Restaurant Owner",
      emoji: "🍽️"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F3EFF8] via-white to-[#FFE5E0] py-12">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-[#5B2C91] hover:text-[#8B6FB0] transition-colors mb-6 font-semibold"
        >
          <ArrowLeft size={20} />
          Back to Home
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-[#2C3E50] mb-4">
            Dashboard <span className="text-[#5B2C91]">Access</span>
          </h1>
          <p className="text-xl text-[#7F8C8D]">
            Select your dashboard to view analytics and manage operations
          </p>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {dashboards.map((dashboard) => (
            <Link
              key={dashboard.href}
              href={dashboard.href}
              className="group"
            >
              <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2 h-full">
                {/* Color Header */}
                <div className={`h-2 bg-gradient-to-r ${dashboard.color}`}></div>
                
                {/* Content */}
                <div className="p-8">
                  {/* Icon & Emoji */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${dashboard.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <dashboard.icon size={32} className="text-white" />
                    </div>
                    <div className="text-5xl">{dashboard.emoji}</div>
                  </div>
                  
                  <div>
                    <h2 className="text-2xl font-bold text-[#2C3E50] mb-2 group-hover:text-[#5B2C91] transition-colors">
                      {dashboard.name}
                    </h2>
                    <p className="text-[#7F8C8D] text-sm mb-3">
                      {dashboard.description}
                    </p>
                    <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-[#F3EFF8] to-[#FFE5E0] text-[#5B2C91] text-xs font-bold rounded-full">
                      {dashboard.role}
                    </span>
                  </div>

                  {/* Arrow */}
                  <div className="flex justify-end mt-6">
                    <div className="w-10 h-10 rounded-full bg-[#F3EFF8] flex items-center justify-center group-hover:bg-gradient-to-r group-hover:from-[#5B2C91] group-hover:to-[#8B6FB0] transition-all duration-300">
                      <span className="text-[#5B2C91] group-hover:text-white font-bold text-xl">→</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Info Note */}
        <div className="mt-12 max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-6 border-l-4 border-[#5B2C91]">
          <h3 className="font-bold text-[#2C3E50] mb-2 flex items-center gap-2">
            💡 Access Information
          </h3>
          <p className="text-[#7F8C8D]">
            <span className="font-semibold text-[#5B2C91]">Revenue Analytics</span> is available to all users for demo purposes. 
            <span className="font-semibold text-[#FF5722]"> Restaurant Portal</span> requires a restaurant owner account.
          </p>
        </div>
      </div>
    </div>
  );
}