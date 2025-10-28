"use client"

import { DetailHeader } from "@/components/detail-header"
import { useAuthGuard } from "@/lib/auth-guard"

export default function HoSoDangKyThuePage() {
  useAuthGuard()
  const services = [
    { id: 1, icon: "📄", label: "Xem hồ sơ đăng ký thuế" },
    { id: 2, icon: "✏️", label: "Cập nhật hồ sơ đăng ký" },
    { id: 3, icon: "📋", label: "Lịch sử thay đổi hồ sơ" },
    { id: 4, icon: "🔍", label: "Tra cứu trạng thái hồ sơ" },
  ]

  return (
    <div className="min-h-screen full-viewport bg-gray-100 flex flex-col">
      <DetailHeader title="Hồ sơ đăng ký thuế" />

      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="grid grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className="flex flex-col items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <div className="w-16 h-16 rounded-2xl bg-red-600 flex items-center justify-center text-3xl shadow-sm hover:shadow-md transition-shadow">
                {service.icon}
              </div>
              <p className="text-xs text-center text-gray-700 font-medium leading-tight">{service.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
