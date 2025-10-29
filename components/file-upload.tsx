"use client"

import { useState } from "react"
import { Upload, X, CheckCircle, AlertCircle } from "lucide-react"
import { uploadFile, getFileURL, deleteFile } from "@/lib/firebase-service"

interface FileUploadProps {
  userId: string
  onUploadSuccess?: (url: string) => void
  onUploadError?: (error: string) => void
  accept?: string
  maxSize?: number // in MB
}

export function FileUpload({ 
  userId, 
  onUploadSuccess, 
  onUploadError,
  accept = "*/*",
  maxSize = 10 
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<{ name: string; url: string } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Kiểm tra kích thước file
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File quá lớn! Tối đa ${maxSize}MB`)
      onUploadError?.(`File quá lớn! Tối đa ${maxSize}MB`)
      return
    }

    setError(null)
    setIsUploading(true)
    setProgress(0)

    try {
      // Tạo unique path cho file
      const timestamp = Date.now()
      const fileName = file.name
      const filePath = `uploads/${userId}/${timestamp}-${fileName}`

      // Upload file
      const url = await uploadFile(filePath, file, {
        contentType: file.type,
        customMetadata: {
          uploadedBy: userId,
          originalName: fileName
        }
      })

      setUploadedFile({ name: fileName, url })
      setProgress(100)
      onUploadSuccess?.(url)
    } catch (err: any) {
      const errorMsg = err.message || "Upload thất bại"
      setError(errorMsg)
      onUploadError?.(errorMsg)
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemove = async () => {
    if (!uploadedFile) return
    
    try {
      // Có thể thêm logic để xóa file từ Storage nếu cần
      setUploadedFile(null)
      setProgress(0)
      setError(null)
    } catch (err: any) {
      setError("Xóa file thất bại")
    }
  }

  return (
    <div className="w-full space-y-4">
      <div className="relative">
        <input
          type="file"
          onChange={handleFileChange}
          accept={accept}
          className="hidden"
          id="file-upload"
          disabled={isUploading}
        />
        <label
          htmlFor="file-upload"
          className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
            isUploading
              ? "bg-gray-100 border-gray-300 cursor-not-allowed"
              : "border-gray-300 hover:bg-gray-50"
          }`}
        >
          <Upload className={`w-8 h-8 mb-2 ${isUploading ? "text-gray-400" : "text-gray-400"}`} />
          <p className="text-sm text-gray-600">
            {isUploading ? "Đang upload..." : "Click để chọn file"}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Tối đa {maxSize}MB
          </p>
        </label>

        {/* Progress bar */}
        {isUploading && (
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Success message */}
      {uploadedFile && (
        <div className="flex items-center justify-between p-3 bg-green-50 text-green-700 rounded-lg">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm truncate">{uploadedFile.name}</p>
          </div>
          <button
            onClick={handleRemove}
            className="ml-2 p-1 hover:bg-red-100 rounded transition-colors"
            type="button"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}

