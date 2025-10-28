"use client"

import { DetailHeader } from "@/components/detail-header"

export default function KhaiThuePage() {
  const services = [
    { id: 1, icon: "📋", label: "Khai thuế CNKD" },
    { id: 2, icon: "📝", label: "Tra cứu hồ sơ khai thuế" },
    { id: 3, icon: "🔍", label: "Tra cứu hồ sơ khai Lệ phí trước ba" },
    { id: 4, icon: "📄", label: "Tra cứu hồ sơ đất đai" },
  ]

  return (
    <div className="min-h-screen full-viewport bg-gray-800 flex flex-col">
      <DetailHeader title="Khai thuế" />

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-gray-100 px-4 py-6">
        <div className="grid grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className="flex flex-col items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-3xl shadow-sm hover:shadow-md transition-shadow">
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
