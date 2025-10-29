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

// ===================================
// TEMPLATE MANAGEMENT APIs
// ===================================

export interface Template {
  id: string
  name: string
  htmlTemplate: string
  type: string
  isActive: boolean
  isDefault: boolean
  createdAt?: any
}

export interface CreateTemplateData {
  name: string
  htmlTemplate: string
  isActive?: boolean
  isDefault?: boolean
}

/**
 * Tạo template mới
 */
export async function createTemplate(data: CreateTemplateData): Promise<{ templateId: string }> {
  return callApi("/createTemplate", {
    method: "POST",
    body: JSON.stringify({ ...data, type: "pdf" }),
  })
}

/**
 * Lấy danh sách templates
 */
export async function getTemplates(): Promise<{ templates: Template[] }> {
  return callApi("/getTemplates", {
    method: "GET",
  })
}

/**
 * Cập nhật template
 */
export async function updateTemplate(
  templateId: string,
  data: Partial<CreateTemplateData>
): Promise<void> {
  return callApi("/updateTemplate", {
    method: "PUT",
    body: JSON.stringify({ templateId, ...data }),
  })
}

/**
 * Xóa template
 */
export async function deleteTemplate(templateId: string): Promise<void> {
  return callApi(`/deleteTemplate?templateId=${templateId}`, {
    method: "DELETE",
  })
}

// ===================================
// MAPPING MANAGEMENT APIs
// ===================================

export interface FieldMapping {
  label: string
  required: boolean
  visible: boolean
  format?: "text" | "currency" | "datetime" | "number"
}

export interface MappingConfig {
  templateId: string
  fields: { [fieldName: string]: FieldMapping }
}

/**
 * Lấy mapping cho template
 */
export async function getMapping(templateId: string): Promise<MappingConfig> {
  return callApi(`/getMapping?templateId=${templateId}`, {
    method: "GET",
  })
}

/**
 * Cập nhật mapping
 */
export async function updateMapping(
  templateId: string,
  fields: { [fieldName: string]: FieldMapping }
): Promise<void> {
  return callApi("/updateMapping", {
    method: "PUT",
    body: JSON.stringify({ templateId, fields }),
  })
}

/**
 * Export mapping JSON
 */
export async function exportMapping(templateId: string): Promise<MappingConfig> {
  return callApi(`/exportMapping?templateId=${templateId}`, {
    method: "GET",
  })
}

/**
 * Import mapping JSON
 */
export async function importMapping(
  templateId: string,
  mappingData: MappingConfig
): Promise<void> {
  return callApi("/importMapping", {
    method: "POST",
    body: JSON.stringify({ templateId, mappingData }),
  })
}

// ===================================
// TRANSACTION MANAGEMENT APIs
// ===================================

export interface Transaction {
  id?: string
  mst: string
  taxpayerName: string
  taxpayerAddress?: string
  amount: number
  paymentDate: Date | any
  status: string
  templateId?: string
  createdAt?: any
  updatedAt?: any
}

/**
 * Tạo transaction mới
 */
export async function createTransaction(data: Transaction): Promise<{ transactionId: string }> {
  return callApi("/createTransaction", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

/**
 * Lấy danh sách transactions
 */
export async function getTransactions(filters?: {
  mst?: string
  startDate?: Date
  endDate?: Date
  status?: string
}): Promise<{ transactions: Transaction[] }> {
  const params = new URLSearchParams()
  if (filters?.mst) params.append("mst", filters.mst)
  if (filters?.startDate) params.append("startDate", filters.startDate.toISOString())
  if (filters?.endDate) params.append("endDate", filters.endDate.toISOString())
  if (filters?.status) params.append("status", filters.status)

  const queryString = params.toString()
  return callApi(`/getTransactions${queryString ? `?${queryString}` : ""}`, {
    method: "GET",
  })
}

/**
 * Cập nhật transaction
 */
export async function updateTransaction(
  transactionId: string,
  data: Partial<Transaction>
): Promise<void> {
  return callApi("/updateTransaction", {
    method: "PUT",
    body: JSON.stringify({ transactionId, ...data }),
  })
}

/**
 * Xóa transaction
 */
export async function deleteTransaction(transactionId: string): Promise<void> {
  return callApi(`/deleteTransaction?transactionId=${transactionId}`, {
    method: "DELETE",
  })
}

