"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Menu, Bell, QrCode, Wrench, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Sidebar } from "@/components/sidebar"

export default function EtaxMobileHome() {
  const router = useRouter()
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    const loggedIn = localStorage.getItem("isLoggedIn") === "true"
    if (!loggedIn) {
      router.push("/login")
      return
    }
    setIsLoggedIn(true)
  }, [mounted, router])

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
    { id: 1, icon: "icon1.png", label: "Tra cứu thông tin người phụ thuộc", href: "/tra-cuu-thong-tin-nguoi-phu-thuoc" },
    { id: 2, icon: "icon2.png", label: "Hồ sơ đăng ký thuế", href: "/ho-so-dang-ky-thue" },
    { id: 3, icon: "icon3.png", label: "Hồ sơ quyết toán thuế", href: "/ho-so-quyet-toan-thue" },
    { id: 4, icon: "icon4.png", label: "Tra cứu chứng từ thuế", href: "/tra-cuu-chung-tu" },
    { id: 5, icon: "kt1.png", label: "Khai thuế CNKD", href: "/khai-thue" },
    { id: 6, icon: "hs1.png", label: "Tra cứu hồ sơ khai thuế", href: "/tra-cuu-chung-tu" },
  ]

  const services = [
    { id: 1, icon: "index1.png", label: "Hoá đơn điện tử", href: "/hoa-don-dien-tu" },
    { id: 2, icon: "index2.png", label: "Khai thuế", href: "/khai-thue" },
    { id: 3, icon: "index3.png", label: "Đăng ký thuế", href: "/dang-ky-thue" },
    { id: 4, icon: "index4.png", label: "Hỗ trợ quyết toán thuế TNCN", href: "/ho-tro-quyet-toan" },
    { id: 5, icon: "index5.png", label: "Nhóm chức năng nộp thuế", href: "/nhom-chuc-nang-nop-thue" },
    { id: 6, icon: "index6.png", label: "Tra cứu nghĩa vụ thuế", href: "/tra-cuu-nghia-vu-thue" },
    { id: 7, icon: "index7.png", label: "Tra cứu thông báo", href: "/thong-bao" },
    { id: 8, icon: "index8.png", label: "Tiện ích", href: "/tien-ich" },
    { id: 9, icon: "index9.png", label: "Hỗ trợ", href: "/ho-tro" },
    { id: 10, icon: "index10.png", label: "Thiết lập cá nhân", href: "/thiet-lap-ca-nhan" },
  ]

  const handleCarouselPrev = () => {
    setCurrentCarouselIndex((prev) => Math.max(0, prev - 1))
  }

  const handleCarouselNext = () => {
    setCurrentCarouselIndex((prev) => Math.min(frequentFeatures.length - 4, prev + 1))
  }

  return (
    // Thêm phone-frame wrapper để đồng bộ trải nghiệm
    <div className="phone-frame relative" style={{ backgroundImage: "url('/assets/sidebar/nen.png')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
      <div className="min-h-screen full-viewport bg-[#f5f5f5] flex flex-col">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="bg-[#DC143C] px-6 py-4 flex items-center justify-between" style={{ paddingTop: "max(12px, env(safe-area-inset-top, 0px))", height: "100px", boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }}>
          <button onClick={() => setSidebarOpen(true)} className="hover:opacity-80 transition-opacity">
            <Menu className="w-6 h-6 text-white cursor-pointer" />
          </button>
          <div className="flex flex-col items-center">
            <Image src="/assets/logo.webp" alt="Logo" width={48} height={48} className="mb-1" />
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
            <div className="w-16 h-16 rounded-full border-4 border-[#DC143C] bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
              <Image src="/assets/avatar.png" alt="Avatar" width={64} height={64} className="object-contain" />
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
                        <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-sm overflow-hidden">
                          <Image 
                            src={`/assets/${feature.icon}`} 
                            alt={feature.label} 
                            width={58} 
                            height={58}
                            className="object-contain w-full h-full"
                          />
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
                    <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                      <Image 
                        src={`/assets/${service.icon}`} 
                        alt={service.label} 
                        width={56} 
                        height={56}
                        className="object-contain w-full h-full"
                      />
                    </div>
                    <p className="text-xs text-center text-gray-700 font-medium leading-tight">{service.label}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}