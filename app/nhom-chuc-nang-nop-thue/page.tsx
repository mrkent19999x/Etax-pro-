"use client"

import { DetailHeader } from "@/components/detail-header"

export default function TaxPaymentFunctionsPage() {
  const services = [
    { id: 1, icon: "💳", label: "Nộp thuế" },
    { id: 2, icon: "💳", label: "Nộp thuế thay" },
    { id: 3, icon: "📋", label: "Tra cứu chứng từ nộp thuế" },
    { id: 4, icon: "📝", label: "Tự lập giấy nộp tiền" },
    { id: 5, icon: "🔗", label: "Liên kết/Hủy liên kết tài khoản" },
    { id: 6, icon: "📤", label: "Đề nghị xử lý khoản nộp thừa" },
    { id: 7, icon: "📂", label: "Tra cứu đề nghị xử lý khoản nộp thừa" },
    { id: 8, icon: "📱", label: "Quét QR-Code để nộp thuế" },
  ]

  return (
    <div className="min-h-screen full-viewport bg-gray-800 flex flex-col">
      <DetailHeader title="Nhóm chức năng nộp thuế" />

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto bg-gray-100">
        <div className="p-6">
          <div className="grid grid-cols-3 gap-6">
            {services.map((service) => (
              <div
                key={service.id}
                className="flex flex-col items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
              >
                <div className="w-16 h-16 rounded-2xl bg-white border-2 border-red-600 flex items-center justify-center text-3xl shadow-sm hover:shadow-md transition-shadow">
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
