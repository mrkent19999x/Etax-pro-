"use client"

import { useState } from "react"
import { uploadFile, getFileURL, deleteFile } from "@/lib/firebase-service"

interface UseFirebaseStorageReturn {
  upload: (path: string, file: File) => Promise<string>
  getURL: (path: string) => Promise<string | null>
  remove: (path: string) => Promise<void>
  isUploading: boolean
  error: string | null
}

export function useFirebaseStorage(): UseFirebaseStorageReturn {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const upload = async (path: string, file: File): Promise<string> => {
    try {
      setIsUploading(true)
      setError(null)
      const url = await uploadFile(path, file, {
        contentType: file.type
      })
      return url
    } catch (err: any) {
      const errorMsg = err.message || "Upload thất bại"
      setError(errorMsg)
      throw err
    } finally {
      setIsUploading(false)
    }
  }

  const getURL = async (path: string): Promise<string | null> => {
    try {
      setError(null)
      return await getFileURL(path)
    } catch (err: any) {
      const errorMsg = err.message || "Lấy URL thất bại"
      setError(errorMsg)
      return null
    }
  }

  const remove = async (path: string): Promise<void> => {
    try {
      setError(null)
      await deleteFile(path)
    } catch (err: any) {
      const errorMsg = err.message || "Xóa file thất bại"
      setError(errorMsg)
      throw err
    }
  }

  return {
    upload,
    getURL,
    remove,
    isUploading,
    error
  }
}

