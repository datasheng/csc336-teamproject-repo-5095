"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Lock, User, ArrowRight, Phone } from "lucide-react";

type AuthUser = {
  USER_ID: number;
  USER_NAME: string;
  EMAIL: string;
  ROLES: string;
};

const AUTH_STORAGE_KEY = "auth_user";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || searchParams.get("next") || "/";


  const [isLogin, setIsLogin] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
  });

  // Optional: if already logged in, bounce away
  useEffect(() => {
    try {
      const raw = localStorage.getItem(AUTH_STORAGE_KEY);
      if (raw) {
        window.location.href = redirectTo;
      }
    } catch {
      // ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setField = (key: keyof typeof formData) => (value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";

      const payload = isLogin
        ? {
            email: formData.email,
            password: formData.password,
          }
        : {
            username: formData.name, // backend expects username
            email: formData.email,
            password: formData.password,
            phone: formData.phone,
            role: "customer",
          };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000"}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        // FastAPI typically returns { detail: "..." }
        const detail = typeof data?.detail === "string" ? data.detail : null;
        const message = typeof data?.message === "string" ? data.message : null;
        throw new Error(detail || message || "Request failed");
      }

      // On register, your backend returns { success, message, user_id }
      // On login (recommended), return { success, message, user: { USER_ID, USER_NAME, EMAIL, ROLES } }
      if (!isLogin) {
        const createdId = data?.user_id;
        if (!createdId) {
          throw new Error("Register succeeded but no user_id returned.");
        }
        // After register, auto-login behavior:
        // Store minimal user info so checkout can use USER_ID (until you implement full login response)
        const createdUser: AuthUser = {
          USER_ID: createdId,
          USER_NAME: formData.name || "Customer",
          EMAIL: formData.email,
          ROLES: "customer",
        };
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(createdUser));
        window.location.href = redirectTo;
        return;
      }

      const user: AuthUser | undefined = data?.user;
      if (!user?.USER_ID) {
        throw new Error("Login succeeded but no user payload returned.");
      }

      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      localStorage.setItem("user_id", String(user.USER_ID));
      window.location.href = redirectTo;
    } catch (err: any) {
      setErrorMsg(err?.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#F5F5F7] via-white to-[#FFE5E0] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-[#FF5722] to-[#5B2C91] rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-2xl">
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
          {errorMsg && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-[#2C3E50] mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#7F8C8D]" size={20} />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setField("name")(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-[#F5F5F7] border-2 border-transparent rounded-xl focus:border-[#5B2C91] focus:bg-white transition-all duration-300 outline-none text-[#2C3E50]"
                      placeholder="John Doe"
                      required={!isLogin}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#2C3E50] mb-2">
                    Phone
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#7F8C8D]" size={20} />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setField("phone")(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-[#F5F5F7] border-2 border-transparent rounded-xl focus:border-[#5B2C91] focus:bg-white transition-all duration-300 outline-none text-[#2C3E50]"
                      placeholder="(555) 123-4567"
                      required={!isLogin}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </>
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
                  onChange={(e) => setField("email")(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-[#F5F5F7] border-2 border-transparent rounded-xl focus:border-[#5B2C91] focus:bg-white transition-all duration-300 outline-none text-[#2C3E50]"
                  placeholder="john@example.com"
                  required
                  disabled={isSubmitting}
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
                  onChange={(e) => setField("password")(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-[#F5F5F7] border-2 border-transparent rounded-xl focus:border-[#5B2C91] focus:bg-white transition-all duration-300 outline-none text-[#2C3E50]"
                  placeholder="••••••••"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {isLogin && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 accent-[#5B2C91] rounded" />
                  <span className="text-[#7F8C8D]">Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={() => setErrorMsg("Forgot password is not implemented yet.")}
                  className="text-[#5B2C91] font-semibold hover:text-[#E64A19]"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-[#5B2C91] to-[#5B2C91] text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-60 disabled:hover:scale-100"
            >
              {isSubmitting
                ? isLogin
                  ? "Signing In..."
                  : "Creating Account..."
                : isLogin
                ? "Sign In"
                : "Create Account"}
              <ArrowRight size={20} />
            </button>
          </form>

          {/* Toggle Login/Signup */}
          <div className="mt-6 text-center">
            <p className="text-[#7F8C8D]">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                onClick={() => {
                  setErrorMsg(null);
                  setIsLogin(!isLogin);
                }}
                className="text-[#5B2C91] font-bold hover:text-[#E64A19] transition-colors"
                disabled={isSubmitting}
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
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link href="/" className="text-[#7F8C8D] hover:text-[#5B2C91] transition-colors inline-flex items-center gap-2">
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
