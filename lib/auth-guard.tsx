"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"

type AuthStatus = "checking" | "authenticated" | "unauthenticated"

interface UseAuthGuardOptions {
  /**
   * Các path không cần kiểm tra đăng nhập (ví dụ /login).
   */
  allowedPaths?: string[]
}

interface UseAuthGuardReturn {
  isAuthenticated: boolean
  isChecking: boolean
}

/**
 * Hook kiểm tra trạng thái đăng nhập và redirect về /login khi cần.
 * Trả về trạng thái để UI có thể chờ trước khi render nội dung nhạy cảm.
 */
export function useAuthGuard(options: UseAuthGuardOptions = {}): UseAuthGuardReturn {
  const router = useRouter()
  const { allowedPaths = ["/login"] } = options
  const [status, setStatus] = useState<AuthStatus>("checking")

  const allowedLookup = useMemo(() => new Set(allowedPaths), [allowedPaths])

  const redirectToLogin = useCallback(() => {
    if (typeof window === "undefined") return

    const currentPath = window.location.pathname
    if (!allowedLookup.has(currentPath)) {
      router.replace("/login")
    }
  }, [allowedLookup, router])

  useEffect(() => {
    if (typeof window === "undefined") return

    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"

    if (isLoggedIn) {
      setStatus("authenticated")
      return
    }

    setStatus("unauthenticated")
    redirectToLogin()
  }, [redirectToLogin])

  return {
    isAuthenticated: status === "authenticated",
    isChecking: status === "checking",
  }
}
