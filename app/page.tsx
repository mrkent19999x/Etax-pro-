"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Menu, Bell, QrCode, Wrench, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { Sidebar } from "@/components/sidebar"

export default function EtaxMobileHome() {
  const router = useRouter()
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const loggedIn = localStorage.getItem("isLoggedIn") === "true"
    if (!loggedIn) {
      router.push("/login")
      return
    }
    setIsLoggedIn(true)
  }, [router])

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#DC143C] mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    )
  }

  if (!isLoggedIn) {
    return null
  }

  const frequentFeatures = [
    { id: 1, icon: "📋", label: "Khai thuế CNKD", href: "/khai-thue" },
    { id: 2, icon: "👤", label: "Tra cứu thông tin người phụ thuộc", href: "/tra-cuu-thong-tin-nguoi-phu-thuoc" },
    { id: 3, icon: "✏️", label: "Tra cứu thông tin quyết toán", href: "/tra-cuu-thong-tin-quyet-toan" },
    { id: 4, icon: "📄", label: "Hồ sơ đăng ký thuế", href: "/ho-so-dang-ky-thue" },
    { id: 5, icon: "📊", label: "Hồ sơ quyết toán thuế", href: "/ho-so-quyet-toan-thue" },
    { id: 6, icon: "📑", label: "Tra cứu chứng từ thuế", href: "/tra-cuu-chung-tu" },
  ]

  const services = [
    { id: 1, icon: "📋", label: "Hoá đơn điện tử", href: "/hoa-don-dien-tu" },
    { id: 2, icon: "📝", label: "Khai thuế", href: "/khai-thue" },
    { id: 3, icon: "✍️", label: "Đăng ký thuế", href: "/dang-ky-thue" },
    { id: 4, icon: "👤", label: "Hỗ trợ quyết toán thuế TNCN", href: "/ho-tro-quyet-toan" },
    { id: 5, icon: "🔔", label: "Nhóm chức năng nộp thuế", href: "/nhom-chuc-nang-nop-thue" },
    { id: 6, icon: "🔍", label: "Tra cứu nghĩa vụ thuế", href: "/tra-cuu-nghia-vu-thue" },
    { id: 7, icon: "📢", label: "Tra cứu thông báo", href: "/thong-bao" },
    { id: 8, icon: "⚙️", label: "Tiện ích", href: "/tien-ich" },
    { id: 9, icon: "❓", label: "Hỗ trợ", href: "/ho-tro" },
    { id: 10, icon: "🏢", label: "Thiết lập cá nhân", href: "/thiet-lap-ca-nhan" },
  ]

  const handleCarouselPrev = () => {
    setCurrentCarouselIndex((prev) => Math.max(0, prev - 1))
  }

  const handleCarouselNext = () => {
    setCurrentCarouselIndex((prev) => Math.min(frequentFeatures.length - 4, prev + 1))
  }

  return (
    <div className="min-h-screen full-viewport bg-[#f5f5f5] flex flex-col">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="bg-[#DC143C] px-6 py-4 flex items-center justify-between">
        <button onClick={() => setSidebarOpen(true)} className="hover:opacity-80 transition-opacity">
          <Menu className="w-6 h-6 text-white cursor-pointer" />
        </button>
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full border-2 border-amber-400 bg-[#DC143C] flex items-center justify-center mb-1">
            <span className="text-xl">⭐</span>
          </div>
          <h1 className="text-white font-light text-lg">eTax Mobile</h1>
        </div>
        <div className="flex gap-4">
          <QrCode className="w-6 h-6 text-white cursor-pointer" />
          <button onClick={() => router.push("/thong-bao")} className="hover:opacity-80 transition-opacity">
            <Bell className="w-6 h-6 text-white cursor-pointer" />
          </button>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto bg-[#f5f5f5]">
        {/* User Profile Card */}
        <div className="mx-4 mt-6 bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm">
          <div className="w-16 h-16 rounded-full border-4 border-[#DC143C] bg-gray-100 flex items-center justify-center flex-shrink-0">
            <span className="text-2xl">👤</span>
          </div>
          <div className="flex-1">
            <p className="text-gray-600 text-sm">MST: 00109202830</p>
            <p className="text-[#DC143C] font-bold text-lg">TỬ XUÂN CHIẾN</p>
          </div>
          <Link href="/thong-tin-tai-khoan">
            <ChevronRight className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600 transition-colors" />
          </Link>
        </div>

        {/* Frequently Used Features */}
        <div className="mx-4 mt-6 bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">Chức năng hay dùng</h2>
            <Wrench className="w-5 h-5 text-[#DC143C]" />
          </div>

          {/* Carousel */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCarouselPrev}
              disabled={currentCarouselIndex === 0}
              className="flex-shrink-0 w-8 h-8 rounded-full bg-[#DC143C] text-white flex items-center justify-center hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex-1 overflow-hidden">
              <div
                className="flex gap-4 transition-transform duration-300"
                style={{
                  transform: `translateX(-${currentCarouselIndex * 100}px)`,
                }}
              >
                {frequentFeatures.map((feature) => (
                  <Link key={feature.id} href={feature.href}>
                    <div className="flex-shrink-0 w-24 flex flex-col items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
                      <div className="w-16 h-16 rounded-2xl bg-[#DC143C] flex items-center justify-center text-2xl">
                        {feature.icon}
                      </div>
                      <p className="text-xs text-center text-gray-700 font-medium leading-tight">{feature.label}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <button
              onClick={handleCarouselNext}
              disabled={currentCarouselIndex >= frequentFeatures.length - 4}
              className="flex-shrink-0 w-8 h-8 rounded-full bg-[#DC143C] text-white flex items-center justify-center hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Service Grid */}
        <div className="mx-4 mt-6 bg-white rounded-2xl p-6 shadow-sm mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-6">Danh sách nhóm dịch vụ</h2>

          <div className="grid grid-cols-3 gap-6">
            {services.map((service) => (
              <Link key={service.id} href={service.href} className={service.href === "#" ? "pointer-events-none" : ""}>
                <div className="flex flex-col items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
                  <div className="w-16 h-16 rounded-2xl bg-[#DC143C] flex items-center justify-center text-3xl shadow-sm hover:shadow-md transition-shadow">
                    {service.icon}
                  </div>
                  <p className="text-xs text-center text-gray-700 font-medium leading-tight">{service.label}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
