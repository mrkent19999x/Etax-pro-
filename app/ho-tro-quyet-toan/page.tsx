"use client"

import { DetailHeader } from "@/components/detail-header"
import { useAuthGuard } from "@/lib/auth-guard"

export default function HoTroQuyetToanPage() {
  useAuthGuard()
  const services = [
    { id: 1, icon: "📋", label: "Hỗ số quyết toán thuế" },
    { id: 2, icon: "✏️", label: "Tra cứu thông tin quyết toán" },
    { id: 3, icon: "📄", label: "Tra cứu phân ánh QTT gửi đến CQT" },
    { id: 4, icon: "📝", label: "Hỗ trợ lập tờ khai quyết toán" },
  ]

  return (
    <div className="min-h-screen full-viewport bg-gray-800 flex flex-col">
      <DetailHeader title="Hỗ trợ quyết toán thuế TNCN" />

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
