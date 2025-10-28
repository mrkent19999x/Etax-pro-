"use client"

import { ChevronLeft, Home, Edit, QrCode, Lock, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function AccountInfoPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen full-viewport bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="bg-red-700 px-6 py-4 flex items-center justify-between">
        <button onClick={() => router.back()} className="hover:opacity-80 transition-opacity">
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-white font-light text-lg">Thông tin tài khoản</h1>
        <Link href="/">
          <Home className="w-6 h-6 text-white cursor-pointer hover:opacity-80 transition-opacity" />
        </Link>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        {/* Profile Section */}
        <div className="bg-gray-700 px-6 py-8 flex flex-col items-center gap-6">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-full border-4 border-red-600 bg-white flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-4xl">👤</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4 w-full">
            <button className="bg-red-600 hover:bg-red-700 text-white rounded-full py-3 px-4 flex items-center justify-center gap-2 transition-colors">
              <Edit className="w-5 h-5" />
              <span className="text-sm font-medium">Thay đổi thông tin</span>
            </button>
            <button className="bg-red-600 hover:bg-red-700 text-white rounded-full py-3 px-4 flex items-center justify-center gap-2 transition-colors">
              <QrCode className="w-5 h-5" />
              <span className="text-sm font-medium">Mã QR-Code thông</span>
            </button>
            <button className="bg-red-600 hover:bg-red-700 text-white rounded-full py-3 px-4 flex items-center justify-center gap-2 transition-colors">
              <Lock className="w-5 h-5" />
              <span className="text-sm font-medium">Đổi mật khẩu</span>
            </button>
            <button className="bg-red-600 hover:bg-red-700 text-white rounded-full py-3 px-4 flex items-center justify-center gap-2 transition-colors">
              <Trash2 className="w-5 h-5" />
              <span className="text-sm font-medium">Xoá tài khoản</span>
            </button>
          </div>
        </div>

        {/* Account Information */}
        <div className="px-6 py-6">
          <h2 className="text-lg font-bold text-gray-800 mb-6">Thông tin tài khoản</h2>

          <div className="space-y-6">
            {/* Tax ID */}
            <div className="flex justify-between items-start">
              <span className="text-gray-600 font-medium">Mã số thuế</span>
              <span className="text-gray-900 font-bold text-right">00109202830</span>
            </div>

            {/* Full Name */}
            <div className="flex justify-between items-start">
              <span className="text-gray-600 font-medium">Tên đầy đủ</span>
              <span className="text-gray-900 font-bold text-right">TỪ XUÂN CHIẾN</span>
            </div>

            {/* Address */}
            <div className="flex justify-between items-start gap-4">
              <span className="text-gray-600 font-medium flex-shrink-0">Địa chỉ</span>
              <span className="text-gray-900 font-bold text-right">
                số 8 hêm, Phương Minh Khai(Hết hiệu lực), TP Hà Nội
              </span>
            </div>

            {/* Tax Authority */}
            <div className="flex justify-between items-start gap-4">
              <span className="text-gray-600 font-medium flex-shrink-0">Tên CQT quản lý</span>
              <span className="text-gray-900 font-bold text-right">Thuế cơ số 3 thành phố Hà Nội</span>
            </div>

            {/* Phone */}
            <div className="flex justify-between items-start">
              <span className="text-gray-600 font-medium">Số điện thoại</span>
              <span className="text-gray-900 font-bold text-right">0856941234</span>
            </div>

            {/* Email */}
            <div className="flex justify-between items-start gap-4">
              <span className="text-gray-600 font-medium flex-shrink-0">Thư điện tử</span>
              <span className="text-gray-900 font-bold text-right break-all">tuxuanchien6101992@gmail.com</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
