"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useFirebaseAuth } from "./use-firebase-auth"

interface UseAdminAuthReturn {
  isAdmin: boolean
  isLoading: boolean
  isChecking: boolean
}

/**
 * Hook kiểm tra quyền admin và redirect nếu không phải admin
 */
export function useRequireAdmin(): UseAdminAuthReturn {
  const router = useRouter()
  const { user, userData, loading: authLoading, isAdmin: checkIsAdmin } = useFirebaseAuth()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    if (authLoading) {
      setIsChecking(true)
      return
    }

    if (!user) {
      // Chưa đăng nhập, redirect về login
      router.push("/login")
      setIsChecking(false)
      return
    }

    if (!userData) {
      // Đang load userData
      setIsChecking(true)
      return
    }

    // Check role
    const admin = checkIsAdmin()
    if (!admin) {
      // Không phải admin, redirect về home
      router.push("/")
      setIsChecking(false)
      return
    }

    setIsChecking(false)
  }, [user, userData, authLoading, checkIsAdmin, router])

  return {
    isAdmin: checkIsAdmin() ?? false,
    isLoading: isChecking || authLoading,
    isChecking: isChecking || authLoading
  }
}

/**
 * Hook chỉ check admin, không redirect
 */
export function useAdminAuth(): UseAdminAuthReturn {
  const { userData, loading: authLoading, isAdmin: checkIsAdmin } = useFirebaseAuth()

  return {
    isAdmin: checkIsAdmin() ?? false,
    isLoading: authLoading,
    isChecking: authLoading
  }
}

