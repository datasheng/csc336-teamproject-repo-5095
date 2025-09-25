"use client"

import { useState } from "react"

export default function LoginPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleLogin = () => setIsLoggedIn(true)
  const handleLogout = () => setIsLoggedIn(false)

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="bg-white p-6 rounded-xl shadow-md w-80">
        {!isLoggedIn ? (
          <>
            <h1 className="text-xl font-bold mb-4 text-center">Login</h1>
            <button
              onClick={handleLogin}
              className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Mock Login
            </button>
          </>
        ) : (
          <>
            <h1 className="text-xl font-bold mb-4 text-center">Welcome back!</h1>
            <button
              onClick={handleLogout}
              className="w-full py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </main>
  )
}
