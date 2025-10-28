"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

/**
 * HOC để bảo vệ route - giống như auth-guard.min.js trong dự án HTML
 * Kiểm tra localStorage và redirect về login nếu chưa đăng nhập
 */
export function withAuth<T extends {}>(
  Component: React.ComponentType<T>,
  allowedPaths: string[] = ["/login"]
) {
  return function ProtectedComponent(props: T) {
    const router = useRouter()

    useEffect(() => {
      // Check localStorage giống như auth-guard.min.js
      const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"
      
      // Lấy current path
      const currentPath = window.location.pathname

      // Nếu không đăng nhập và không phải page được phép → redirect
      if (!isLoggedIn && !allowedPaths.includes(currentPath)) {
        router.push("/login")
      }
    }, [router])

    return <Component {...props} />
  }
}

/**
 * Hook để check auth status
 */
export function useAuthGuard() {
  const router = useRouter()

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"
    
    if (!isLoggedIn) {
      router.push("/login")
    }
  }, [router])
}

