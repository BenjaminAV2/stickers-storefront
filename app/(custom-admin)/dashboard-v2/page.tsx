'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface Order {
  id: string
  orderNumber: string
  customerName: string
  status: string
  totalCents: number
  createdAt: string
  paymentStatus: string
}

interface Stats {
  totalOrders: number
  totalRevenue: number
  pendingOrders: number
  completedOrders: number
  avgOrderValue: number
  revenueGrowth: number
}

export default function DashboardV2Page() {
  const [orders, setOrders] = useState<Order[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const res = await fetch('/api/orders')
      const data = await res.json()
      const ordersList = data.docs || []
      setOrders(ordersList)
      calculateStats(ordersList)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (ordersList: Order[]) => {
    const totalOrders = ordersList.length
    const totalRevenue = ordersList.reduce((sum, order) => sum + order.totalCents, 0)
    const pendingOrders = ordersList.filter(o =>
      o.status === 'pending_payment' || o.status === 'paid_awaiting_bat'
    ).length
    const completedOrders = ordersList.filter(o => o.status === 'delivered').length
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

    // Calculate growth (compare last 7 days vs previous 7 days)
    const now = new Date()
    const last7Days = ordersList.filter(o => {
      const orderDate = new Date(o.createdAt)
      const diffTime = now.getTime() - orderDate.getTime()
      const diffDays = diffTime / (1000 * 60 * 60 * 24)
      return diffDays <= 7
    })
    const prev7Days = ordersList.filter(o => {
      const orderDate = new Date(o.createdAt)
      const diffTime = now.getTime() - orderDate.getTime()
      const diffDays = diffTime / (1000 * 60 * 60 * 24)
      return diffDays > 7 && diffDays <= 14
    })
    const last7Revenue = last7Days.reduce((sum, o) => sum + o.totalCents, 0)
    const prev7Revenue = prev7Days.reduce((sum, o) => sum + o.totalCents, 0)
    const revenueGrowth = prev7Revenue > 0 ? ((last7Revenue - prev7Revenue) / prev7Revenue) * 100 : 0

    setStats({
      totalOrders,
      totalRevenue,
      pendingOrders,
      completedOrders,
      avgOrderValue,
      revenueGrowth,
    })
  }

  // Prepare chart data - Revenue by day (last 14 days)
  const getRevenueByDay = () => {
    const days: { [key: string]: number } = {}
    const now = new Date()

    // Initialize last 14 days
    for (let i = 13; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      const key = date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })
      days[key] = 0
    }

    // Fill with actual data
    orders.forEach(order => {
      const orderDate = new Date(order.createdAt)
      const diffTime = now.getTime() - orderDate.getTime()
      const diffDays = diffTime / (1000 * 60 * 60 * 24)

      if (diffDays <= 14) {
        const key = orderDate.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })
        if (days[key] !== undefined) {
          days[key] += order.totalCents / 100
        }
      }
    })

    return Object.entries(days).map(([date, revenue]) => ({
      date,
      revenue: parseFloat(revenue.toFixed(2)),
    }))
  }

  // Prepare chart data - Orders by status
  const getOrdersByStatus = () => {
    const statusCounts: { [key: string]: number } = {}
    const statusLabels: { [key: string]: string } = {
      pending_payment: 'En attente',
      paid_awaiting_bat: 'Attente BAT',
      in_production: 'Production',
      production_complete: 'Terminée',
      preparing_shipment: 'Préparation',
      in_delivery: 'Livraison',
      delivered: 'Livrée',
      cancelled: 'Annulée',
    }

    orders.forEach(order => {
      statusCounts[order.status] = (statusCounts[order.status] || 0) + 1
    })

    return Object.entries(statusCounts).map(([status, count]) => ({
      status: statusLabels[status] || status,
      count,
    }))
  }

  const formatPrice = (cents: number) => `${(cents / 100).toFixed(2)}€`

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Chargement...</div>
      </div>
    )
  }

  const revenueData = getRevenueByDay()
  const statusData = getOrdersByStatus()

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard v2</h1>
              <p className="text-sm text-gray-500 mt-1">Vue d'ensemble des performances</p>
            </div>
            <div className="flex gap-2">
              <Link
                href="/admin-custom/orders"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
              >
                Voir les commandes
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Total Revenue */}
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-indigo-500">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Revenu Total</h3>
              <svg className="w-8 h-8 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-3xl font-bold text-gray-900">{stats ? formatPrice(stats.totalRevenue) : '0€'}</div>
            <div className={`text-sm mt-2 flex items-center ${stats && stats.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              <span className="font-medium">{stats ? `${stats.revenueGrowth >= 0 ? '+' : ''}${stats.revenueGrowth.toFixed(1)}%` : '0%'}</span>
              <span className="text-gray-500 ml-1">vs 7 derniers jours</span>
            </div>
          </div>

          {/* Total Orders */}
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Commandes</h3>
              <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <div className="text-3xl font-bold text-gray-900">{stats?.totalOrders || 0}</div>
            <div className="text-sm text-gray-500 mt-2">Total des commandes</div>
          </div>

          {/* Pending Orders */}
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">En attente</h3>
              <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-3xl font-bold text-gray-900">{stats?.pendingOrders || 0}</div>
            <div className="text-sm text-gray-500 mt-2">À traiter</div>
          </div>

          {/* Completed Orders */}
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Livrées</h3>
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-3xl font-bold text-gray-900">{stats?.completedOrders || 0}</div>
            <div className="text-sm text-gray-500 mt-2">Commandes finalisées</div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Revenue Chart */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Revenus (14 derniers jours)</h2>
              <p className="text-sm text-gray-500">Évolution quotidienne</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#5750F1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#5750F1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#9ca3af" style={{ fontSize: '12px' }} />
                <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                  formatter={(value: any) => [`${value}€`, 'Revenu']}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#5750F1"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Orders by Status */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Répartition par statut</h2>
              <p className="text-sm text-gray-500">Distribution des commandes</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="status" stroke="#9ca3af" style={{ fontSize: '11px' }} angle={-45} textAnchor="end" height={100} />
                <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                  formatter={(value: any) => [`${value}`, 'Commandes']}
                />
                <Bar dataKey="count" fill="#5750F1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Commandes récentes</h2>
                <p className="text-sm text-gray-500">5 dernières commandes</p>
              </div>
              <Link
                href="/admin-custom/orders"
                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Voir tout →
              </Link>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Commande
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.orderNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {order.customerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800">
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatPrice(order.totalCents)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <Link
                        href={`/admin-custom/orders/${order.id}`}
                        className="text-indigo-600 hover:text-indigo-700 font-medium"
                      >
                        Voir →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
