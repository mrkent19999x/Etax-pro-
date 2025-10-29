"use client"

import { auth } from "./firebase-config"

/**
 * Get Firebase Auth token để gửi kèm request
 */
async function getAuthToken(): Promise<string | null> {
  const user = auth.currentUser
  if (!user) return null

  try {
    const token = await user.getIdToken()
    return token
  } catch (error) {
    console.error("Error getting auth token:", error)
    return null
  }
}

/**
 * Base URL cho Functions API
 * Sẽ được thay bằng Firebase Functions URL sau khi deploy
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_FUNCTIONS_URL || ""

/**
 * Helper function để gọi API với authentication
 */
async function callApi(endpoint: string, options: RequestInit = {}) {
  const token = await getAuthToken()
  if (!token) {
    throw new Error("Chưa đăng nhập")
  }

  const url = API_BASE_URL ? `${API_BASE_URL}${endpoint}` : `/api${endpoint}`

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText || `Error: ${response.status}`)
  }

  return response.json()
}

// ===================================
// USER MANAGEMENT APIs
// ===================================

export interface CreateUserData {
  email: string
  password: string
  name: string
  role?: "admin" | "user"
  mstList?: string[]
}

export interface User {
  id: string
  name: string
  email: string
  role: "admin" | "user"
  mstList: string[]
  mst?: string
  createdAt?: any
}

/**
 * Tạo user mới
 */
export async function createUser(data: CreateUserData): Promise<{ userId: string }> {
  return callApi("/createUser", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

/**
 * Lấy danh sách users
 */
export async function getUsers(): Promise<{ users: User[] }> {
  return callApi("/getUsers", {
    method: "GET",
  })
}

/**
 * Cập nhật user
 */
export async function updateUser(userId: string, data: Partial<CreateUserData>): Promise<void> {
  return callApi("/updateUser", {
    method: "PUT",
    body: JSON.stringify({ userId, ...data }),
  })
}

/**
 * Xóa user
 */
export async function deleteUser(userId: string): Promise<void> {
  return callApi(`/deleteUser?userId=${userId}`, {
    method: "DELETE",
  })
}

