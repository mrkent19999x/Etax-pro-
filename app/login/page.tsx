"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useBodyLock } from "@/hooks/use-body-lock"
import { auth, db } from "@/lib/firebase-config"
import { signInWithEmailAndPassword } from "firebase/auth"
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore"

export default function LoginPage() {
  const router = useRouter()
  const [mst, setMst] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  useBodyLock(true)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    if (!mst.trim() || !password.trim()) {
      setError("Vui lòng nhập MST và mật khẩu")
      setIsLoading(false)
      return
    }

    try {
      let userEmail = mst.trim()
      let userMST = mst.trim()

      // If user types MST (not email), find user by MST in Firestore
      if (!mst.includes("@")) {
        // Query Firestore to find user with this MST
        const usersRef = collection(db, "users")
        const q = query(
          usersRef,
          where("mstList", "array-contains", mst.trim())
        )
        const querySnapshot = await getDocs(q)
        
        if (querySnapshot.empty) {
          // Try searching in mst field (legacy)
          const q2 = query(usersRef, where("mst", "==", mst.trim()))
          const querySnapshot2 = await getDocs(q2)
          
          if (querySnapshot2.empty) {
            setError("Mã số thuế không tồn tại trong hệ thống")
            setIsLoading(false)
            return
          }
          
          const userDoc = querySnapshot2.docs[0]
          userEmail = userDoc.data().email
          if (!userEmail) {
            setError("Tài khoản chưa được liên kết với email. Vui lòng liên hệ quản trị viên.")
            setIsLoading(false)
            return
          }
        } else {
          const userDoc = querySnapshot.docs[0]
          userEmail = userDoc.data().email
          if (!userEmail) {
            setError("Tài khoản chưa được liên kết với email. Vui lòng liên hệ quản trị viên.")
            setIsLoading(false)
            return
          }
        }
      }

      // Authenticate with Firebase Auth using email/password
      const cred = await signInWithEmailAndPassword(auth, userEmail, password.trim())
      
      // Read role from Firestore users/{uid}
      const uid = cred.user.uid
      const snap = await getDoc(doc(db, "users", uid))
      const role = snap.exists() ? (snap.data() as any).role : undefined
      const userData = snap.exists() ? snap.data() : null

      // Seed local session for current app guards
      localStorage.setItem("isLoggedIn", "true")
      localStorage.setItem("userMST", userMST)
      localStorage.setItem("userName", userData?.name || cred.user.email || "USER")

      if (role === "admin") {
        router.push("/admin")
      } else {
        router.push("/")
      }
      setIsLoading(false)
    } catch (err: any) {
      // Handle specific Firebase Auth errors
      let errorMessage = "Đăng nhập thất bại"
      if (err.code === "auth/user-not-found") {
        errorMessage = "Tài khoản không tồn tại"
      } else if (err.code === "auth/wrong-password") {
        errorMessage = "Mật khẩu không đúng"
      } else if (err.code === "auth/invalid-credential") {
        errorMessage = "Email hoặc mật khẩu không đúng"
      } else if (err.code === "auth/too-many-requests") {
        errorMessage = "Quá nhiều lần thử. Vui lòng thử lại sau."
      } else if (err.message) {
        errorMessage = err.message
      }
      
      setError(errorMessage)
      setIsLoading(false)
    }
  }

  return (
    <div 
      className="phone-frame relative flex flex-col"
      style={{ 
        backgroundImage: "url('/assets/cf6c2881-6c21-4612-bdb1-7726d72648cc.webp')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        height: '100dvh'
      }}
    >
      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-center px-6 pb-24">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-white/10 backdrop-blur-sm p-2">
            <Image 
              src="/assets/logo.webp" 
              alt="eTax Logo" 
              width={80}
              height={80}
              className="object-contain w-full h-full"
            />
          </div>
          <h1 className="text-white text-[26px] font-bold mt-4 tracking-wide">eTax Mobile</h1>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="w-full space-y-6">
          {/* MST Input */}
          <div>
            <div className="flex items-center gap-3 min-h-[48px]">
              <Image 
                src="/assets/icon-mst-new.svg" 
                alt="MST icon" 
                width={18} 
                height={18}
                className="opacity-90"
              />
              <input
                type="text"
                inputMode="numeric"
                placeholder="Mã số thuế"
                value={mst}
                onChange={(e) => setMst(e.target.value)}
                className="flex-1 bg-transparent text-white text-base py-2 outline-none placeholder:text-white/70"
                autoComplete="off"
                style={{ touchAction: 'manipulation' }}
                data-testid="mst-input"
              />
            </div>
            <div className="h-px bg-white/80 mt-0" />
          </div>

          {/* Password Input */}
          <div>
            <div className="flex items-center gap-3 min-h-[48px]">
              <Image 
                src="/assets/icon-password-new.svg" 
                alt="Password icon" 
                width={18} 
                height={18}
                className="opacity-90"
              />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex-1 bg-transparent text-white text-base py-2 outline-none placeholder:text-white/70"
                autoComplete="off"
                style={{ touchAction: 'manipulation' }}
                data-testid="password-input"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="w-[38px] h-[38px] flex items-center justify-center"
                aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                style={{ touchAction: 'manipulation' }}
              >
                <Image 
                  src={showPassword ? "/assets/icon-eye.svg" : "/assets/icon-eye-closed.svg"}
                  alt="Toggle password"
                  width={20}
                  height={20}
                  className="opacity-70"
                />
              </button>
            </div>
            <div className="h-px bg-white/80 mt-0" />
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          {/* Help Links */}
          <div className="flex justify-between gap-4 text-sm">
            <a href="#" className="text-white hover:text-yellow-400 transition-colors">
              Quên tài khoản?
            </a>
            <a href="#" className="text-white hover:text-yellow-400 transition-colors">
              Quên mật khẩu?
            </a>
          </div>

          {/* Login Button with Fingerprint Icon */}
          <div className="relative">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-[52px] rounded-[28px] bg-[#DC143C] text-white font-bold text-base tracking-wide hover:bg-red-700 active:scale-[0.98] disabled:opacity-50 transition-all flex items-center justify-center"
              style={{ touchAction: 'manipulation' }}
              data-testid="login-button"
            >
              {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
            {/* Fingerprint Icon Overlay */}
            <div className="absolute right-0 top-0 bottom-0 flex items-center pr-2">
              <Image 
                src="/assets/faceid1.webp"
                alt="Fingerprint"
                width={24}
                height={24}
                className="object-contain"
              />
            </div>
          </div>
        </form>

        {/* VNeID Login */}
        <div className="w-full mt-6">
          <button 
            className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-white border border-white/20 hover:bg-white/10 active:scale-[0.98] transition-all"
            style={{ touchAction: 'manipulation' }}
          >
            <Image 
              src="/assets/vnid.webp" 
              alt="VNeID" 
              width={36}
              height={36}
              className="object-contain"
            />
            <span className="text-black font-semibold">Đăng nhập bằng tài khoản Định danh điện tử</span>
          </button>
        </div>

        {/* Sign up Links */}
        <div className="mt-8 text-center space-y-2">
          <div className="text-sm text-white">
            Bạn chưa có tài khoản?{" "}
            <a href="#" className="text-yellow-400 hover:text-yellow-300 font-semibold transition-colors">
              Đăng ký ngay
            </a>
          </div>
          <div className="text-sm text-white mt-4">
            Người nước ngoài hoặc người Việt Nam sống ở nước ngoài không có số định danh cá nhân-chưa có mã số thuế?{" "}
            <a href="#" className="text-yellow-400 hover:text-yellow-300 font-semibold transition-colors">
              Đăng ký thuế ngay.
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-[rgba(0,0,0,0.3)] backdrop-blur-sm border-t border-white/10 flex items-center justify-around py-2 px-4" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <button className="flex flex-col items-center gap-1 active:opacity-70 transition-opacity" style={{ touchAction: 'manipulation' }}>
          <Image src="/assets/icon-qr.webp" alt="QR Tem" width={24} height={24} className="opacity-90" />
          <span className="text-xs text-white">QR tem</span>
        </button>
        <button className="flex flex-col items-center gap-1 active:opacity-70 transition-opacity" style={{ touchAction: 'manipulation' }}>
          <Image src="/assets/tienich.png" alt="Tiện ích" width={24} height={24} className="opacity-90" />
          <span className="text-xs text-white">Tiện ích</span>
        </button>
        <button className="flex flex-col items-center gap-1 active:opacity-70 transition-opacity" style={{ touchAction: 'manipulation' }}>
          <Image src="/assets/hotro.png" alt="Hỗ trợ" width={24} height={24} className="opacity-90" />
          <span className="text-xs text-white">Hỗ trợ</span>
        </button>
        <button className="flex flex-col items-center gap-1 active:opacity-70 transition-opacity" style={{ touchAction: 'manipulation' }}>
          <Image src="/assets/chiase.png" alt="Chia sẻ" width={24} height={24} className="opacity-90" />
          <span className="text-xs text-white">Chia sẻ</span>
        </button>
      </div>
    </div>
  )
}
