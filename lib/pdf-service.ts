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
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_FUNCTIONS_URL || ""

/**
 * Helper function để gọi API với authentication
 */
async function callPdfApi(mst: string, templateId?: string): Promise<Response> {
  const token = await getAuthToken()
  
  const params = new URLSearchParams({ mst })
  if (templateId) {
    params.append("templateId", templateId)
  }

  const url = API_BASE_URL 
    ? `${API_BASE_URL}/generatePdf?${params.toString()}`
    : `/api/generatePdf?${params.toString()}`

  const headers: HeadersInit = {
    "Content-Type": "application/pdf",
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const response = await fetch(url, {
    method: "GET",
    headers,
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText || `Error: ${response.status}`)
  }

  return response
}

/**
 * Download PDF file
 */
export async function downloadPdf(mst: string, templateId?: string): Promise<void> {
  try {
    const response = await callPdfApi(mst, templateId)
    const blob = await response.blob()
    
    // Tạo URL tạm và trigger download
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `Giay_nop_tien_MST_${mst}.pdf`
    document.body.appendChild(link)
    link.click()
    
    // Cleanup
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error("Error downloading PDF:", error)
    throw error
  }
}

/**
 * Preview PDF trong iframe/modal
 * Trả về blob URL để hiển thị
 */
export async function previewPdf(mst: string, templateId?: string): Promise<string> {
  try {
    const response = await callPdfApi(mst, templateId)
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    return url
  } catch (error) {
    console.error("Error previewing PDF:", error)
    throw error
  }
}

/**
 * Get PDF as Blob (để xử lý tùy chỉnh)
 */
export async function getPdfBlob(mst: string, templateId?: string): Promise<Blob> {
  try {
    const response = await callPdfApi(mst, templateId)
    return await response.blob()
  } catch (error) {
    console.error("Error getting PDF blob:", error)
    throw error
  }
}

