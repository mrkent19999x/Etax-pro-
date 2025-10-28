"use client"

import { useState, useEffect } from "react"
import {
  X,
  Home,
  FileText,
  Plus,
  DollarSign,
  Search,
  Bell,
  Settings,
  Calculator,
  HelpCircle,
  Wrench,
} from "lucide-react"
import { useRouter } from "next/navigation"

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  userName?: string
}

export function Sidebar({ isOpen, onClose, userName = "TỬ XUÂN CHIẾN" }: SidebarProps) {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const menuItems = [
    { icon: Home, label: "Trang chủ", href: "/" },
    { icon: FileText, label: "Hoá đơn điện tử", href: "/hoa-don-dien-tu" },
    { icon: Plus, label: "Khai thuế", href: "/khai-thue" },
    { icon: Plus, label: "Đăng ký thuế", href: "/dang-ky-thue" },
    { icon: DollarSign, label: "Hỗ trợ quyết toán thuế TNCN", href: "/ho-tro-quyet-toan" },
    { icon: Calculator, label: "Nhóm chức năng nộp thuế", href: "/nhom-chuc-nang-nop-thue" },
    { icon: Search, label: "Tra cứu nghĩa vụ thuế", href: "/tra-cuu-nghia-vu-thue" },
    { icon: Bell, label: "Tra cứu thông báo", href: "/thong-bao" },
    { icon: Wrench, label: "Tiện ích", href: "/tien-ich" },
    { icon: HelpCircle, label: "Hỗ trợ", href: "/ho-tro" },
    { icon: Settings, label: "Thiết lập cá nhân", href: "/thiet-lap-ca-nhan" },
  ]

  const handleMenuClick = (href: string) => {
    if (href !== "#") {
      router.push(href)
      onClose()
    }
  }

  const handleLogout = () => {
    router.push("/login")
    onClose()
  }

  if (!mounted) return null

  return (
    <>
      {/* Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity" onClick={onClose} />}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-screen w-64 bg-white z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="bg-red-700 px-6 py-6 text-white flex items-center justify-between">
          <div>
            <p className="text-sm font-light">Xin chào</p>
            <p className="text-lg font-bold">{userName}</p>
          </div>
          <button onClick={onClose} className="hover:opacity-80 transition-opacity">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.label}
                  onClick={() => handleMenuClick(item.href)}
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-colors ${
                    item.href === "#"
                      ? "text-gray-600 hover:bg-gray-100 cursor-default"
                      : "text-gray-800 hover:bg-red-50"
                  }`}
                >
                  <Icon className="w-6 h-6 text-red-700 flex-shrink-0" />
                  <span className="text-left font-medium">{item.label}</span>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Logout Button */}
        <div className="border-t border-gray-200 p-4">
          <button
            onClick={handleLogout}
            className="w-full py-3 px-4 border-2 border-red-600 text-red-600 rounded-full font-semibold hover:bg-red-50 transition-colors"
          >
            Đăng xuất
          </button>
        </div>
      </div>
    </>
  )
}
