"use client"

import Link from "next/link"
import { ChevronLeft, Home, Bell } from "lucide-react"
import { useRouter } from "next/navigation"

interface PageHeaderProps {
  title: string
  showNotification?: boolean
}

export function PageHeader({ title, showNotification = true }: PageHeaderProps) {
  const router = useRouter()

  return (
    <header className="sticky top-0 z-50 bg-[#DC143C] text-white px-4 py-3 flex items-center justify-between">
      <button onClick={() => router.back()} className="p-2 hover:bg-red-700 rounded-lg transition">
        <ChevronLeft size={24} />
      </button>

      <h1 className="text-xl font-semibold text-center flex-1">{title}</h1>

      <div className="flex gap-2">
        {showNotification && (
          <Link href="/thong-bao" className="p-2 hover:bg-red-700 rounded-lg transition">
            <Bell size={24} />
          </Link>
        )}
        <Link href="/" className="p-2 hover:bg-red-700 rounded-lg transition">
          <Home size={24} />
        </Link>
      </div>
    </header>
  )
}
