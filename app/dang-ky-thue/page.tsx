"use client"

import { DetailHeader } from "@/components/detail-header"

export default function DangKyThuePage() {
  const services = [
    {
      id: 1,
      icon: "👤",
      label: "Thay đổi thông tin đăng ký thuế",
    },
    {
      id: 2,
      icon: "🔍",
      label: "Tra cứu thông tin người phụ thuộc",
    },
    {
      id: 3,
      icon: "📋",
      label: "Hồ sơ đăng ký thuế",
    },
    {
      id: 4,
      icon: "📝",
      label: "Kê khai hồ sơ đăng ký thuế",
    },
  ]

  return (
    <div className="min-h-screen full-viewport bg-gray-100 flex flex-col">
      <DetailHeader title="Đăng ký thuế" />

      <div className="flex-1 overflow-y-auto">
        <div className="mx-4 mt-6 bg-white rounded-2xl p-6 shadow-sm mb-6">
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
    </div>
  )
}
