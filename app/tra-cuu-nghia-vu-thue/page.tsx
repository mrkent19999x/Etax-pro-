"use client"

import { useState } from "react"
import { DetailHeader } from "@/components/detail-header"
import Link from "next/link"
import { Eye } from "lucide-react"

export default function TraCuuNghiaVuThuePage() {
  const [activeService, setActiveService] = useState<number | null>(null)
  const [searchResults, setSearchResults] = useState<any[] | null>(null)

  const services = [
    {
      id: 1,
      icon: "✅",
      label: "Thông tin nghĩa vụ thuế",
    },
    {
      id: 2,
      icon: "🏠",
      label: "Thông tin nghĩa vụ tài chính đặt đai",
    },
    {
      id: 3,
      icon: "🚗",
      label: "Thông tin nghĩa vụ Lệ phí trước ba phương tiện",
    },
  ]

  // Mock data for tax obligations
  const mockObligations = [
    {
      id: 1,
      mst: "02209700473",
      accountId: "04057451314300001",
      category: "Các khoản thuế, tiền phạt",
      taxAuthority: "Phương Cao Xanh - Thuế cơ số 1 tính Quảng Ninh",
      obligation: "Còn phải nộp",
      amount: "9,600 VND",
    },
    {
      id: 2,
      mst: "02209700473",
      accountId: "04057451314300002",
      category: "Các khoản tiền chậm nộp",
      taxAuthority: "Phương Cao Xanh - Thuế cơ số 1 tính Quảng Ninh",
      obligation: "Còn phải nộp",
      amount: "5,200 VND",
    },
    {
      id: 3,
      mst: "02209700473",
      accountId: "04057451314300003",
      category: "Các khoản thu khác thuộc NSNN",
      taxAuthority: "Phương Cao Xanh - Thuế cơ số 1 tính Quảng Ninh",
      obligation: "Còn phải nộp",
      amount: "3,400 VND",
    },
  ]

  const handleSearch = () => {
    setSearchResults(mockObligations)
  }

  const handleServiceClick = (serviceId: number) => {
    if (serviceId === 1) {
      setActiveService(1)
      setSearchResults(null)
    }
  }

  if (activeService === null) {
    return (
      <div className="min-h-screen full-viewport bg-gray-100 flex flex-col">
        <DetailHeader title="Tra cứu nghĩa vụ thuế" />

        <div className="flex-1 overflow-y-auto">
          <div className="mx-4 mt-6 bg-white rounded-2xl p-6 shadow-sm mb-6">
            <div className="grid grid-cols-3 gap-6">
              {services.map((service) => (
                <button
                  key={service.id}
                  onClick={() => handleServiceClick(service.id)}
                  className="flex flex-col items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <div className="w-16 h-16 rounded-2xl bg-red-600 flex items-center justify-center text-3xl shadow-sm hover:shadow-md transition-shadow">
                    {service.icon}
                  </div>
                  <p className="text-xs text-center text-gray-700 font-medium leading-tight">{service.label}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen full-viewport bg-gray-100 flex flex-col">
      <DetailHeader title="Thông tin nghĩa vụ thuế" />

      <div className="flex-1 overflow-y-auto pb-6">
        {/* MST Display */}
        <div className="mx-4 mt-6 bg-white rounded-lg p-4 shadow-sm">
          <p className="text-gray-600 text-sm">Mã số thuế</p>
          <p className="text-red-600 font-bold text-lg">00109202830</p>
        </div>

        {/* Search Button */}
        <div className="mx-4 mt-4">
          <button
            onClick={handleSearch}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-full transition-colors"
          >
            Tra cứu
          </button>
        </div>

        {/* Search Results */}
        {searchResults && (
          <div className="mx-4 mt-6 space-y-3">
            <h3 className="text-gray-800 font-semibold text-sm px-2">Thông tin chi tiết</h3>
            {searchResults.map((obligation) => (
              <div key={obligation.id} className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="text-gray-600 text-xs mb-1">Các khoản còn phải nộp</p>
                    <p className="text-gray-800 font-semibold text-sm mb-2">{obligation.category}</p>
                    <p className="text-gray-600 text-xs mb-1">{obligation.taxAuthority}</p>
                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-200">
                      <div>
                        <p className="text-gray-600 text-xs">Loại nghĩa vụ</p>
                        <p className="text-gray-800 font-semibold text-sm">{obligation.obligation}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-600 text-xs">Số tiền</p>
                        <p className="text-gray-800 font-semibold text-sm">{obligation.amount}</p>
                      </div>
                    </div>
                  </div>
                  <Link
                    href={`/tra-cuu-nghia-vu-thue/${obligation.id}`}
                    className="flex-shrink-0 mt-1 text-red-600 hover:text-red-700 transition-colors"
                  >
                    <Eye size={20} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
