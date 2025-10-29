"use client"

import { DetailHeader } from "@/components/detail-header"
import { ProtectedView } from "@/components/protected-view"
import Image from "next/image"

export default function ThietLapCaNhanPage() {
  const services = [
    { id: 1, icon: "avatar.png", label: "Thiết lập ảnh đại diện", href: "#" },
    { id: 2, icon: "icon-doimk.png", label: "Đổi mật khẩu đăng nhập", href: "/doi-mat-khau" },
    { id: 3, icon: "faceid.png", label: "Đăng nhập bằng văn tay/FaceID", href: "/van-tay" },
    { id: 4, icon: "icon12.png", label: "Đăng ký kênh nhận thông tin", href: "#" },
    { id: 5, icon: "icon11.png", label: "Chức năng hay dùng", href: "#" },
  ]
  return (
    <ProtectedView>
      <div className="min-h-screen full-viewport bg-gray-800 flex flex-col">
        <DetailHeader title="Thiết lập cá nhân" />

        <div className="flex-1 overflow-y-auto bg-gray-100 px-4 py-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="grid grid-cols-3 gap-6">
              {services.map((service) => (
                <a
                  key={service.id}
                  href={service.href}
                  className="flex flex-col items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                    <Image src={`/assets/${service.icon}`} alt={service.label} width={56} height={56} className="object-contain w-full h-full" />
                  </div>
                  <p className="text-xs text-center text-gray-700 font-medium leading-tight">{service.label}</p>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ProtectedView>
  )
}
