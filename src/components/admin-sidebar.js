"use client"

import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Menu, X, Package, ShoppingCart, BarChart3, LogOut } from "lucide-react"

export default function AdminSidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter() // Tambahkan ini

  // Pindahkan handleLogout ke sini (setelah hooks)
  const handleLogout = () => {
    // Hapus token dari localStorage
    localStorage.removeItem("token")

    // Arahkan ke halaman home
    router.push("/")
  }

  const menuItems = [
    { name: "Dashboard", icon: BarChart3, href: "/admin" },
    { name: "Manage Orders", icon: ShoppingCart, href: "/admin/orders" },
    { name: "Manage Stock", icon: Package, href: "/admin/inventory" },
  ]

  const isActive = (href) => {
    if (href === "/admin") {
      return pathname === "/admin"
    }
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Mobile header */}
      <div className="lg:hidden bg-gray-800 p-4 flex items-center justify-between">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 text-white hover:bg-gray-700 rounded-lg transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-white text-xl font-bold">NgeBaju Admin</h1>
        <div className="w-8" />
      </div>

      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-black transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className="flex flex-col h-screen">
          {/* Logo/Brand */}
          <div className="flex items-center justify-between p-6">
            <h1 className="text-white text-3xl font-bold">NgeBaju</h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 space-y-2">
            {menuItems.map((item) => {
              const IconComponent = item.icon
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-4 py-3 text-lg rounded-lg transition-colors duration-200 ${
                    isActive(item.href) ? "bg-gray-800 text-white" : "text-white hover:bg-gray-800"
                  }`}
                >
                  <IconComponent className="h-5 w-5 mr-3" />
                  {item.name}
                </a>
              )
            })}
          </nav>

          {/* Logout */}
          <div className="p-4">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-white text-lg hover:bg-gray-800 rounded-lg transition-colors duration-200"
            >
              <LogOut className="h-5 w-5 mr-3" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
