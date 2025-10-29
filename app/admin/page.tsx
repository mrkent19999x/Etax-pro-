"use client"

import { AdminLayout } from "@/components/admin/admin-layout"
import { useRequireAdmin } from "@/hooks/use-admin-auth"
import { FileText, Users, MapPin, Receipt } from "lucide-react"
import Link from "next/link"

export default function AdminDashboardPage() {
  const { isAdmin, isLoading } = useRequireAdmin()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang kiểm tra quyền...</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return null // useRequireAdmin sẽ redirect
  }

  const stats = [
    { label: "Tổng Users", value: "-", icon: Users, color: "bg-blue-500", href: "/admin/users" },
    { label: "Templates", value: "-", icon: FileText, color: "bg-green-500", href: "/admin/templates" },
    { label: "Mappings", value: "-", icon: MapPin, color: "bg-yellow-500", href: "/admin/mappings" },
    { label: "Transactions", value: "-", icon: Receipt, color: "bg-purple-500", href: "/admin/transactions" },
  ]

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
          <p className="text-gray-600 mt-1">Quản lý hệ thống eTax</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <Link
                key={stat.label}
                href={stat.href}
                className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold mt-2">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <Icon className="text-white" size={24} />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/admin/users"
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Users className="mb-2" size={24} />
              <p className="font-medium">Quản lý Users</p>
              <p className="text-sm text-gray-600">Tạo, sửa, xóa người dùng</p>
            </Link>
            <Link
              href="/admin/templates"
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FileText className="mb-2" size={24} />
              <p className="font-medium">Quản lý Templates</p>
              <p className="text-sm text-gray-600">Tạo và chỉnh sửa PDF templates</p>
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

