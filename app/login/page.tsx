"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"
import { TaxLogo } from "@/components/tax-logo"

export default function LoginPage() {
  const router = useRouter()
  const [mst, setMst] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Simulate login validation
    if (!mst.trim() || !password.trim()) {
      setError("Vui lòng nhập MST và mật khẩu")
      setIsLoading(false)
      return
    }

    // Simulate API call
    setTimeout(() => {
      // Store login state in localStorage
      localStorage.setItem("isLoggedIn", "true")
      localStorage.setItem("userMST", mst)
      localStorage.setItem("userName", "TỬ XUÂN CHIẾN")

      // Navigate to home
      router.push("/")
      setIsLoading(false)
    }, 500)
  }

  return (
    <div className="min-h-screen full-viewport bg-gradient-to-b from-[#1a2a3a] to-[#0f1820] flex flex-col">
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        <div className="mb-8 flex flex-col items-center">
          <TaxLogo />
          <h1 className="text-white text-3xl font-light mt-4">eTax Mobile</h1>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
          {/* MST Input */}
          <div className="relative">
            <div className="flex items-center bg-[#2a3a4a] rounded-lg px-4 py-3 border border-[#3a4a5a]">
              <span className="text-gray-400 mr-3">👤</span>
              <input
                type="text"
                placeholder="Mã số thuế"
                value={mst}
                onChange={(e) => setMst(e.target.value)}
                className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="relative">
            <div className="flex items-center bg-[#2a3a4a] rounded-lg px-4 py-3 border border-[#3a4a5a]">
              <span className="text-gray-400 mr-3">🔒</span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-300 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          {/* Help Links */}
          <div className="flex justify-between text-sm pt-2">
            <a href="#" className="text-amber-400 hover:text-amber-300 transition-colors">
              Quên tài khoản?
            </a>
            <a href="#" className="text-amber-400 hover:text-amber-300 transition-colors">
              Quên mật khẩu?
            </a>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#DC143C] hover:bg-red-700 disabled:bg-red-900 text-white font-bold py-3 rounded-full transition-colors mt-6"
          >
            {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        {/* Digital ID Login */}
        <div className="w-full max-w-sm mt-6">
          <button className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-gray-800 font-semibold py-3 rounded-lg transition-colors">
            <span className="text-xl">📱</span>
            <span>Đăng nhập bằng tài khoản Định danh điện tử</span>
          </button>
        </div>

        {/* Register Link */}
        <div className="mt-8 text-center text-gray-400 text-sm">
          <p>Bạn chưa có tài khoản?</p>
          <a href="#" className="text-amber-400 hover:text-amber-300 font-semibold transition-colors">
            Đăng ký ngay
          </a>
        </div>

        {/* Footer Info */}
        <div className="mt-12 text-center text-gray-500 text-xs space-y-2">
          <div className="flex justify-center gap-4">
            <span>📱 Ứng dụng</span>
            <span>🔗 Liên kết</span>
            <span>📤 Chia sẻ</span>
          </div>
        </div>
      </div>
    </div>
  )
}
