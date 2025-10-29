"use client"

import { useState, useEffect } from "react"
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from "firebase/auth"
import { auth } from "@/lib/firebase-config"
import { getUserData, saveUserData, type UserData } from "@/lib/firebase-service"

interface AuthState {
  user: FirebaseUser | null
  userData: UserData | null
  loading: boolean
  error: string | null
}

export function useFirebaseAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    userData: null,
    loading: true,
    error: null
  })

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Lấy thông tin user từ Firestore
        const userData = await getUserData(firebaseUser.uid)
        setState({
          user: firebaseUser,
          userData,
          loading: false,
          error: null
        })
      } else {
        setState({
          user: null,
          userData: null,
          loading: false,
          error: null
        })
      }
    })

    return () => unsubscribe()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const userData = await getUserData(userCredential.user.uid)
      
      setState(prev => ({
        ...prev,
        user: userCredential.user,
        userData,
        loading: false
      }))
      
      return userCredential.user
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        error: error.message || "Đăng nhập thất bại",
        loading: false
      }))
      throw error
    }
  }

  const register = async (email: string, password: string, userData: Partial<UserData>) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      
      await saveUserData(userCredential.user.uid, {
        userId: userCredential.user.uid,
        name: userData.name || "",
        mst: userData.mst || "",
        email: email,
        phone: userData.phone,
        avatar: userData.avatar
      })
      
      const savedUserData = await getUserData(userCredential.user.uid)
      
      setState(prev => ({
        ...prev,
        user: userCredential.user,
        userData: savedUserData,
        loading: false
      }))
      
      return userCredential.user
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        error: error.message || "Đăng ký thất bại",
        loading: false
      }))
      throw error
    }
  }

  const logout = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      await signOut(auth)
      setState({
        user: null,
        userData: null,
        loading: false,
        error: null
      })
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        error: error.message || "Đăng xuất thất bại",
        loading: false
      }))
      throw error
    }
  }

  // Helper function to check if user is admin
  const isAdmin = () => {
    return state.userData?.role === 'admin'
  }

  // Helper function to check if user has access to MST
  const canAccessMst = (mst: string) => {
    if (isAdmin()) return true
    return state.userData?.mstList?.includes(mst) || state.userData?.mst === mst
  }

  return {
    ...state,
    login,
    register,
    logout,
    isAdmin,
    canAccessMst
  }
}

