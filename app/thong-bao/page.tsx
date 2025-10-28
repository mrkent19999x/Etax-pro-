"use client"

import { useState } from "react"
import { DetailHeader } from "@/components/detail-header"
import Link from "next/link"

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState("all")

  const notifications = [
    {
      id: 1,
      category: "administrative",
      title: "Thông báo kế hoạch tạm dừng hệ thống",
      date: "27/06/2025 15:05:59",
      content: "Cục Thuế thông báo về việc tạm dừng các hệ thống thuế điện tử từ 18h00 ngày 27/6/2025 (...",
    },
    {
      id: 2,
      category: "obligation",
      title: "V/v : Tài khoản giao dịch thuế điện tử",
      date: "21/06/2025 21:02:15",
      content: "Thông báo về tài khoản giao dịch thuế điện tử mới",
    },
    {
      id: 3,
      category: "other",
      title: "Cập nhật hệ thống",
      date: "15/06/2025 10:30:00",
      content: "Hệ thống đã được cập nhật với các tính năng mới",
    },
  ]

  const filteredNotifications = notifications.filter((notif) => {
    if (activeTab === "all") return true
    if (activeTab === "administrative") return notif.category === "administrative"
    if (activeTab === "obligation") return notif.category === "obligation"
    if (activeTab === "other") return notif.category === "other"
    return true
  })

  return (
    <div className="min-h-screen full-viewport bg-gray-100 flex flex-col">
      <DetailHeader title="Thông báo" />

      {/* Notification Tabs */}
      <div className="bg-red-700 px-4 py-3 flex gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab("administrative")}
          className={`flex-shrink-0 px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors ${
            activeTab === "administrative" ? "bg-red-600 text-white" : "bg-red-500 text-white hover:bg-red-600"
          }`}
        >
          <span className="bg-white text-red-700 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
            0
          </span>
          Thông báo hành chính của CQT
        </button>
        <button
          onClick={() => setActiveTab("obligation")}
          className={`flex-shrink-0 px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors ${
            activeTab === "obligation" ? "bg-red-600 text-white" : "bg-red-500 text-white hover:bg-red-600"
          }`}
        >
          <span className="bg-white text-red-700 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
            0
          </span>
          Biến động nghĩa vụ thuế
        </button>
        <button
          onClick={() => setActiveTab("other")}
          className={`flex-shrink-0 px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors ${
            activeTab === "other" ? "bg-red-600 text-white" : "bg-red-500 text-white hover:bg-red-600"
          }`}
        >
          <span className="bg-white text-red-700 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
            0
          </span>
          Thông báo khác
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white px-4 py-4 flex gap-2">
        <div className="flex-1 flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2">
          <span className="text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="Tìm theo nội dung hoặc ngày"
            className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
          />
        </div>
        <button className="text-red-600 font-medium text-sm flex items-center gap-1 px-3 py-2">
          <span>➕</span>
          Nâng cao
        </button>
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notif) => (
            <Link key={notif.id} href={`/thong-bao/${notif.id}`}>
              <div className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex justify-between items-start gap-2 mb-2">
                  <p className="text-gray-800 font-medium text-sm flex-1">{notif.title}</p>
                </div>
                <p className="text-gray-500 text-xs mb-2">{notif.date}</p>
                <p className="text-gray-600 text-sm line-clamp-2">{notif.content}</p>
              </div>
            </Link>
          ))
        ) : (
          <div className="flex items-center justify-center py-12">
            <p className="text-gray-500">Không có thông báo</p>
          </div>
        )}
      </div>
    </div>
  )
}
