"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"
import Image from "next/image"

export default function LoginPage() {
  const router = useRouter()
  const [mst, setMst] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Chặn zoom trên mobile
  useEffect(() => {
    let lastTouchEnd = 0
    const handleTouchEnd = (e: TouchEvent) => {
      const now = Date.now()
      if (now - lastTouchEnd <= 300) e.preventDefault()
      lastTouchEnd = now
    }

    const handleGestureStart = (e: Event) => e.preventDefault()

    document.addEventListener('touchend', handleTouchEnd, { passive: false })
    document.addEventListener('gesturestart', handleGestureStart)

    return () => {
      document.removeEventListener('touchend', handleTouchEnd)
      document.removeEventListener('gesturestart', handleGestureStart)
    }
  }, [])

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
      localStorage.setItem("userName", "TỪ XUÂN CHIẾN")

      // Navigate to home
      router.push("/")
      setIsLoading(false)
    }, 500)
  }

  return (
    <div 
      className="phone-frame relative"
      style={{ 
        backgroundImage: "url('/assets/bglogin.webp')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Gradient mask overlay */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(120% 120% at 80% 15%, rgba(0,0,0,0) 0%, rgba(0,0,0,0.35) 45%, rgba(0,0,0,0.65) 100%),
            linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.6) 45%, rgba(0,0,0,0.8) 100%)
          `
        }}
      />
      
      {/* Main Content */}
      <main 
        className="relative z-10 flex flex-col items-center justify-between flex-1 w-full px-4"
        style={{ 
          paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 8px)',
          paddingTop: 'calc(env(safe-area-inset-top, 0px) + 24px)',
          maxWidth: '480px'
        }}
      >
        {/* Content Section */}
        <section className="w-full max-w-[420px] px-5 flex-1 flex flex-col justify-center">
          {/* Logo + Brand Name */}
          <div className="flex flex-col items-center gap-3 mb-8">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-white/10 backdrop-blur-sm p-2 transform transition-all hover:scale-105">
              <Image 
                src="/assets/logo.webp" 
                alt="Logo eTax" 
                width={86}
                height={86}
                className="object-contain w-full h-full"
                priority
              />
            </div>
            <h1 className="text-white text-[26px] font-bold tracking-wide drop-shadow-lg">eTax Mobile</h1>
            <p className="text-white/80 text-sm text-center max-w-[200px]">Ứng dụng quản lý thuế di động chính thức</p>
          </div>
            <h1 className="text-white text-[22px] font-semibold tracking-wide">eTax Mobile</h1>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* MST Input - Underlined style */}
            <div>
              <div className="flex items-center gap-3 min-h-[44px]">
                <Image 
                  src="/assets/nutinfo.png" 
                  alt="User icon" 
                  width={18} 
                  height={18}
                  className="opacity-95"
                />
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Mã số thuế"
                  value={mst}
                  onChange={(e) => setMst(e.target.value)}
                  className="flex-1 bg-transparent text-white text-base py-2 outline-none placeholder:text-white/92"
                  autoComplete="off"
                />
              </div>
              <div className="h-px bg-white/35 mt-0" />
            </div>

            {/* Password Input - Underlined style */}
            <div>
              <div className="flex items-center gap-3 min-h-[44px]">
                <Image 
                  src="/assets/icon-bell.png" 
                  alt="Lock icon" 
                  width={18} 
                  height={18}
                  className="opacity-95"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="flex-1 bg-transparent text-white text-base py-2 outline-none placeholder:text-white/92"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="w-[38px] h-[38px] flex items-center justify-center p-0 m-0 border-none bg-transparent"
                  aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-white/90" />
                  ) : (
                    <Eye className="w-5 h-5 text-white/90" />
                  )}
                </button>
              </div>
              <div className="h-px bg-white/35 mt-0" />
            </div>

            {/* Error Message */}
            {error && (
              <p className="text-red-400 text-sm text-center mt-2">{error}</p>
            )}

            {/* Forgot Links */}
            <div className="flex justify-between gap-3 mt-2.5">
              <a href="#" className="text-white/70 text-[13px] hover:text-white/90 transition-colors">
                Quên tài khoản (mã số thuế)?
              </a>
              <a href="#" className="text-white/70 text-[13px] hover:text-white/90 transition-colors">
                Quên mật khẩu?
              </a>
            </div>

            {/* Login Button */}
            <div className="mt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-[52px] rounded-[28px] bg-gradient-to-r from-[#E53935] to-[#C62828] text-white font-bold text-base tracking-wide shadow-[0_8px_24px_rgba(0,0,0,0.4)] active:from-[#C62828] active:to-[#B71C1C] disabled:opacity-50 disabled:active:bg-[#E53935] transform transition-all hover:scale-[1.02] hover:shadow-[0_12px_28px_rgba(0,0,0,0.4)]"
              >
                {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
              </button>
            </div>
            
            {/* Quick Login Options */}
            <div className="flex items-center justify-center gap-4 mt-4">
              <button
                type="button"
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors"
                aria-label="Đăng nhập bằng FaceID"
              >
                <span className="text-xl">👤</span>
                <span className="text-white/90 text-sm">FaceID</span>
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors"
                aria-label="Đăng nhập bằng vân tay"
              >
                <span className="text-xl">🔓</span>
                <span className="text-white/90 text-sm">Vân tay</span>
              </button>
            </div>

            {/* VNeID Card */}
            <button
              type="button"
              className="w-full mt-4 flex items-center justify-between px-4 py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-[0_8px_24px_rgba(0,0,0,0.4)] hover:from-blue-600 hover:to-blue-800 transition-all transform hover:scale-[1.01] active:scale-[0.99]"
            >
              <div className="flex flex-col items-start">
                <span className="text-sm opacity-90">Đăng nhập bằng tài khoản</span>
                <strong className="text-lg">Định danh điện tử</strong>
              </div>
              <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                <Image 
                  src="/assets/vnid.png" 
                  alt="VNeID" 
                  width={36}
                  height={36}
                  className="object-contain"
                />
              </div>
            </button>

            {/* Sign up Link */}
            <p className="mt-4 text-white text-sm text-center">
              Bạn chưa có tài khoản?{' '}
              <a href="#" className="text-[#FFD400] font-semibold hover:underline">
                Đăng ký ngay
              </a>
            </p>

            {/* Note */}
            <p className="mt-1.5 mb-2 text-white/70 text-[13px] leading-[1.35] text-center">
              Người nước ngoài hoặc người Việt Nam sống ở nước ngoài không có số định danh cá nhân-chưa có mã số thuế?{' '}
              <a href="#" className="text-[#FFD400] font-semibold hover:underline">
                Đăng ký thuế ngay.
              </a>
            </p>
          </form>
        </section>

        {/* Quick Actions Bottom Nav */}
        <nav 
          className="w-full max-w-[420px] grid grid-cols-4 items-center gap-2 px-5 py-3"
          style={{ 
            height: '96px', 
            paddingBottom: 'calc(12px + env(safe-area-inset-bottom, 0px))',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            backgroundColor: 'rgba(0,0,0,0.3)'
          }}
        >
          <a href="#" className="flex flex-col items-center justify-center gap-1.5 text-white/80 hover:text-white transition-colors decoration-none">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors">
              <span className="text-xl">📷</span>
            </div>
            <span className="text-[11px]">QR tem</span>
          </a>
          <a href="#" className="flex flex-col items-center justify-center gap-1.5 text-white/80 hover:text-white transition-colors decoration-none">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors">
              <span className="text-xl">⚙️</span>
            </div>
            <span className="text-[11px]">Tiện ích</span>
          </a>
          <a href="#" className="flex flex-col items-center justify-center gap-1.5 text-white/80 hover:text-white transition-colors decoration-none">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors">
              <span className="text-xl">❓</span>
            </div>
            <span className="text-[11px]">Hỗ trợ</span>
          </a>
          <a href="#" className="flex flex-col items-center justify-center gap-1.5 text-white/80 hover:text-white transition-colors decoration-none">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors">
              <span className="text-xl">🔗</span>
            </div>
            <span className="text-[11px]">Chia sẻ</span>
          </a>
        </nav>
      </main>
    </div>
  )
}
