"use client"

import { useState } from "react";
import Link from "next/link";
import { Mail, Lock, User, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login/signup logic here
    console.log("Form submitted:", formData);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#F5F5F7] via-white to-[#FFE5E0] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-[#FF5722] to-[#FF6B4A] rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-2xl">
            <User size={40} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold text-[#2C3E50] mb-2">
            {isLogin ? "Welcome Back!" : "Join Us"}
          </h1>
          <p className="text-[#7F8C8D]">
            {isLogin ? "Sign in to continue" : "Create your account"}
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label className="block text-sm font-semibold text-[#2C3E50] mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#7F8C8D]" size={20} />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-[#F5F5F7] border-2 border-transparent rounded-xl focus:border-[#FF5722] focus:bg-white transition-all duration-300 outline-none text-[#2C3E50]"
                    placeholder="John Doe"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-[#2C3E50] mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#7F8C8D]" size={20} />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 bg-[#F5F5F7] border-2 border-transparent rounded-xl focus:border-[#FF5722] focus:bg-white transition-all duration-300 outline-none text-[#2C3E50]"
                  placeholder="john@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#2C3E50] mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#7F8C8D]" size={20} />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 bg-[#F5F5F7] border-2 border-transparent rounded-xl focus:border-[#FF5722] focus:bg-white transition-all duration-300 outline-none text-[#2C3E50]"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {isLogin && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 accent-[#FF5722] rounded" />
                  <span className="text-[#7F8C8D]">Remember me</span>
                </label>
                <a href="#" className="text-[#FF5722] font-semibold hover:text-[#E64A19]">
                  Forgot password?
                </a>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#FF5722] to-[#FF6B4A] text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
            >
              {isLogin ? "Sign In" : "Create Account"}
              <ArrowRight size={20} />
            </button>
          </form>

          {/* Toggle Login/Signup */}
          <div className="mt-6 text-center">
            <p className="text-[#7F8C8D]">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-[#FF5722] font-bold hover:text-[#E64A19] transition-colors"
              >
                {isLogin ? "Sign Up" : "Sign In"}
              </button>
            </p>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-[#7F8C8D]">Or continue with</span>
            </div>
          </div>

          {/* Social Login Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 py-3 px-4 border-2 border-gray-200 rounded-xl hover:border-[#FF5722] hover:bg-[#FFE5E0] transition-all duration-300 font-semibold text-[#2C3E50]">
              <span className="text-xl">G</span> Google
            </button>
            <button className="flex items-center justify-center gap-2 py-3 px-4 border-2 border-gray-200 rounded-xl hover:border-[#FF5722] hover:bg-[#FFE5E0] transition-all duration-300 font-semibold text-[#2C3E50]">
              <span className="text-xl">f</span> Facebook
            </button>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link href="/" className="text-[#7F8C8D] hover:text-[#FF5722] transition-colors inline-flex items-center gap-2">
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}