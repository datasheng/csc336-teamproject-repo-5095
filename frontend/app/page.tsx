import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-blue-600">
          Restaurant Delivery App 🍽️
        </h1>

        <p className="text-gray-600 mb-6">Team 5095</p>

        <Link
          href="/login"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
        >
          Go to Login  
        </Link>
      </div>
    </main>
  )
}
