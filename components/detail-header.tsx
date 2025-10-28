"use client"
import { Home, ChevronLeft } from "lucide-react"
import { useRouter } from "next/navigation"

interface DetailHeaderProps {
  title: string
}

export function DetailHeader({ title }: DetailHeaderProps) {
  const router = useRouter()

  return (
    <div className="bg-red-700 px-6 py-4 flex items-center justify-between text-white">
      <button onClick={() => router.push("/")} className="hover:opacity-80 transition-opacity">
        <ChevronLeft className="w-6 h-6" />
      </button>
      <h1 className="text-lg font-light">{title}</h1>
      <button onClick={() => router.push("/")} className="hover:opacity-80 transition-opacity">
        <Home className="w-6 h-6" />
      </button>
    </div>
  )
}
