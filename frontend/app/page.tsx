import Link from "next/link";
import { Utensils, Clock, Star, ArrowRight } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#F3EFF8] via-white to-[#FFE5E0]">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-left space-y-6">
            <h1 className="text-5xl md:text-6xl lg:text-8xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-[#5B2C91] to-[#8B6FB0] bg-clip-text text-transparent">
                Taste of Harlem
              </span>
            </h1>

            <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-[#2C3E50] max-w-xl leading-snug mt-6">
              Bringing People Together, One Plate at a Time
            </h2>

            <p className="text-base md:text-lg text-[#7F8C8D] max-w-md mt-4">
              Let's explore the best food Harlem has to offer!
            </p>

            <div className="pt-4">
              <Link
                href="/restaurants"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#5B2C91] to-[#8B6FB0] text-white px-10 py-4 rounded-full font-semibold shadow-lg hover:from-[#6B3CA1] hover:to-[#9B7FC0] transition-all duration-300 text-lg"
              >
                Get Started
                <ArrowRight size={20} />
              </Link>
            </div>

            <div className="pt-8 text-sm text-gray-500">
              <p>CSC33600 Database Systems Project</p>
              <p className="font-semibold text-[#5B2C91]">Team 5095</p>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative flex justify-center">
            <div className="w-96 h-96 bg-white rounded-full shadow-2xl flex items-center justify-center">
              <Image
                src="/images/logo/taste-of-harlem-logo.png"
                alt="Taste of Harlem Logo"
                width={400}
                height={400}
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          <span className="text-[#2C3E50]">Why Choose </span>
          <span className="text-[#5B2C91]">Us?</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card p-8 text-center">
            <Utensils size={48} className="mx-auto text-[#362c5f] mb-4" />
            <h3 className="text-xl font-bold mb-3">Browse Restaurants</h3>
            <p className="text-gray-600">
              Discover local restaurants and their delicious menus
            </p>
          </div>

          <div className="card p-8 text-center">
            <Clock size={48} className="mx-auto text-[#a37cf0] mb-4" />
            <h3 className="text-xl font-bold mb-3">Quick Delivery</h3>
            <p className="text-gray-600">
              Get your food delivered fast with real-time tracking
            </p>
          </div>

          <div className="card p-8 text-center">
            <Star size={48} className="mx-auto text-[#EFBF04] mb-4" />
            <h3 className="text-xl font-bold mb-3">Quality Service</h3>
            <p className="text-gray-600">
              Rated highly by customers for excellent service
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-[#5B2C91] to-[#8B6FB0] rounded-3xl p-12 text-center shadow-2xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Order?
          </h2>
          <p className="text-white/90 text-lg mb-8">
            Browse our selection of amazing local restaurants
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/restaurants"
              className="bg-white text-[#5B2C91] px-8 py-4 rounded-full font-semibold hover:scale-105 transition-all shadow-lg"
            >
              Browse Restaurants
            </Link>
            <Link
              href="/login"
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-[#5B2C91] transition-all"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-[#2C3E50] text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm mb-2">Developed by Team 5095</p>
          <p className="text-xs text-white/60">
            Krista • Jing • Alisha • Diana • Angus • Brianna
          </p>
        </div>
      </div>
    </main>
  );
}