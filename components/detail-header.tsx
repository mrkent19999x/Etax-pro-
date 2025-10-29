"use client"
import { Home, ChevronLeft } from "lucide-react"
import { useRouter } from "next/navigation"

interface DetailHeaderProps {
  title: string
}

export function DetailHeader({ title }: DetailHeaderProps) {
  const router = useRouter()

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back()
    } else {
      router.push("/")
    }
  }

  return (
    <div
      className="sticky top-0 z-50 bg-[#b71c1c] text-white px-6 py-4 flex items-center justify-between"
      style={{ 
        height: "100px",
        paddingTop: "max(12px, env(safe-area-inset-top, 0px))",
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
      }}
    >
      <button onClick={handleBack} className="hover:opacity-80 transition-opacity">
        <ChevronLeft className="w-6 h-6" />
      </button>
      <h1 className="text-lg font-light">{title}</h1>
      <button onClick={() => router.push("/")} className="hover:opacity-80 transition-opacity">
        <Home className="w-6 h-6" />
      </button>
    </div>
  )
}
