"use client"

import { DetailHeader } from "@/components/detail-header"

export default function HoTroPage() {
  const services = [
    { id: 1, icon: "📖", label: "Hướng dẫn sử dụng" },
    { id: 2, icon: "🎧", label: "Liên hệ hỗ trợ" },
    { id: 3, icon: "ℹ️", label: "Phiên bản ứng dụng" },
  ]

  return (
    <div className="min-h-screen full-viewport bg-gray-800 flex flex-col">
      <DetailHeader title="Hỗ trợ" />

      <div className="flex-1 overflow-y-auto bg-gray-100 px-4 py-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
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
