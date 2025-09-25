"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { TrendingUp, Users, DollarSign, ShoppingCart } from "lucide-react"

export default function AdminDashboard() {
  const router = useRouter()
  const [dashboardData, setDashboardData] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
    pendingOrders: 0,
    loading: true,
  })

  useEffect(() => {
    // Check authentication first
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login") // Redirect ke login jika tidak ada token
      return
    }

    fetchDashboardData()
  }, [router])

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token")

      if (!token) {
        router.push("/login")
        return
      }

      // Fetch orders data for dashboard stats
      const ordersResponse = await fetch("http://localhost:8000/api/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (ordersResponse.status === 401) {
        // Token expired or invalid
        localStorage.removeItem("token")
        router.push("/login")
        return
      }

      const ordersData = await ordersResponse.json()

      if (ordersData.success) {
        const orders = ordersData.orders
        const totalOrders = orders.length
        const totalRevenue = orders.reduce((sum, order) => sum + order.total_price, 0)
        const pendingOrders = orders.filter((order) => order.status === "pending").length
        setDashboardData({
          totalOrders,
          totalRevenue,
          pendingOrders,
          loading: false,
        })
      } else {
        console.error("Failed to fetch dashboard data:", ordersData.message)
        setDashboardData((prev) => ({ ...prev, loading: false }))
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      setDashboardData((prev) => ({ ...prev, loading: false }))
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <>
      <h2 className="text-white text-xl mb-6">Welcome, Admin</h2>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Orders Card */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-300">Total Orders</h3>
            <ShoppingCart className="h-4 w-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white">
            {dashboardData.loading ? "..." : dashboardData.totalOrders}
          </div>
        </div>

        {/* Total Revenue Card */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-300">Total Revenue</h3>
            <DollarSign className="h-4 w-4 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-white">
            {dashboardData.loading ? "..." : formatCurrency(dashboardData.totalRevenue)}
          </div>
        </div>

        {/* Pending Orders Card */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-300">Pending Orders</h3>
            <TrendingUp className="h-4 w-4 text-yellow-400" />
          </div>
          <div className="text-2xl font-bold text-white">
            {dashboardData.loading ? "..." : dashboardData.pendingOrders}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg">
        <div className="p-6 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
        </div>
        <div className="p-6">
          <p className="text-gray-400">Recent orders and activities will be displayed here</p>
        </div>
      </div>
    </>
  )
}
