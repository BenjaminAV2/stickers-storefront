'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface Order {
  id: string
  orderNumber: string
  customerName: string
  customerEmail: string
  status: string
  totalCents: number
  items: any[]
  createdAt: string
  paymentStatus: string
  paymentMethod: string
}

export default function StatisticsV2Page() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const res = await fetch('/api/orders')
      const data = await res.json()
      setOrders(data.docs || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterOrdersByTimeRange = (ordersList: Order[]) => {
    if (timeRange === 'all') return ordersList

    const now = new Date()
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90

    return ordersList.filter(order => {
      const orderDate = new Date(order.createdAt)
      const diffTime = now.getTime() - orderDate.getTime()
      const diffDays = diffTime / (1000 * 60 * 60 * 24)
      return diffDays <= days
    })
  }

  // Revenue by day
  const getRevenueByDay = () => {
    const filteredOrders = filterOrdersByTimeRange(orders)
    const days: { [key: string]: number } = {}

    // Initialize all days in range
    const now = new Date()
    const daysCount = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 30
    for (let i = daysCount - 1; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      const key = date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })
      days[key] = 0
    }

    filteredOrders.forEach(order => {
      const orderDate = new Date(order.createdAt)
      const dayKey = orderDate.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })

      if (days[dayKey] !== undefined) {
        days[dayKey] += order.totalCents / 100
      }
    })

    return Object.entries(days).map(([day, revenue]) => ({
      day,
      revenue: parseFloat(revenue.toFixed(2)),
    }))
  }

  // Orders count by day
  const getOrdersCountByDay = () => {
    const filteredOrders = filterOrdersByTimeRange(orders)
    const days: { [key: string]: number } = {}

    // Initialize all days in range
    const now = new Date()
    const daysCount = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 30
    for (let i = daysCount - 1; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      const key = date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })
      days[key] = 0
    }

    filteredOrders.forEach(order => {
      const orderDate = new Date(order.createdAt)
      const dayKey = orderDate.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })

      if (days[dayKey] !== undefined) {
        days[dayKey] += 1
      }
    })

    return Object.entries(days).map(([day, count]) => ({
      day,
      count,
    }))
  }

  // Payment methods distribution
  const getPaymentMethodsDistribution = () => {
    const filteredOrders = filterOrdersByTimeRange(orders)
    const methods: { [key: string]: number } = {}

    filteredOrders.forEach(order => {
      const method = order.paymentMethod || 'unknown'
      methods[method] = (methods[method] || 0) + 1
    })

    const labels: { [key: string]: string } = {
      stripe: 'CB (Stripe)',
      paypal: 'PayPal',
      bank_transfer: 'Virement',
      unknown: 'Inconnu',
    }

    return Object.entries(methods).map(([method, count]) => ({
      name: labels[method] || method,
      value: count,
    }))
  }

  // Top products
  const getTopProducts = () => {
    const filteredOrders = filterOrdersByTimeRange(orders)
    const products: { [key: string]: { count: number; revenue: number } } = {}

    filteredOrders.forEach(order => {
      order.items?.forEach(item => {
        const key = item.productName || 'Unknown'
        if (!products[key]) {
          products[key] = { count: 0, revenue: 0 }
        }
        products[key].count += item.quantity
        products[key].revenue += item.totalPriceCents / 100
      })
    })

    return Object.entries(products)
      .sort((a, b) => b[1].revenue - a[1].revenue)
      .slice(0, 5)
      .map(([name, data]) => ({
        name: name.substring(0, 30) + (name.length > 30 ? '...' : ''),
        quantité: data.count,
        revenue: parseFloat(data.revenue.toFixed(2)),
      }))
  }

  // Customer statistics
  const getCustomerStats = () => {
    const filteredOrders = filterOrdersByTimeRange(orders)
    const customers: { [key: string]: number } = {}

    filteredOrders.forEach(order => {
      customers[order.customerEmail] = (customers[order.customerEmail] || 0) + 1
    })

    const totalCustomers = Object.keys(customers).length
    const returningCustomers = Object.values(customers).filter(count => count > 1).length
    const newCustomers = totalCustomers - returningCustomers

    return [
      { name: 'Nouveaux clients', value: newCustomers },
      { name: 'Clients fidèles', value: returningCustomers },
    ]
  }

  // Average order value trend by day
  const getAOVTrend = () => {
    const filteredOrders = filterOrdersByTimeRange(orders)
    const days: { [key: string]: { total: number; count: number } } = {}

    // Initialize all days in range
    const now = new Date()
    const daysCount = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 30
    for (let i = daysCount - 1; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      const key = date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })
      days[key] = { total: 0, count: 0 }
    }

    filteredOrders.forEach(order => {
      const orderDate = new Date(order.createdAt)
      const dayKey = orderDate.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })

      if (days[dayKey]) {
        days[dayKey].total += order.totalCents / 100
        days[dayKey].count += 1
      }
    })

    return Object.entries(days).map(([day, data]) => ({
      day,
      aov: data.count > 0 ? parseFloat((data.total / data.count).toFixed(2)) : 0,
    }))
  }

  const COLORS = ['#5750F1', '#3C50E0', '#80CAEE', '#0FADCF', '#10B981']

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Chargement...</div>
      </div>
    )
  }

  const revenueData = getRevenueByDay()
  const ordersCountData = getOrdersCountByDay()
  const paymentMethodsData = getPaymentMethodsDistribution()
  const topProductsData = getTopProducts()
  const customerStatsData = getCustomerStats()
  const aovTrendData = getAOVTrend()

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Statistiques v2</h1>
              <p className="text-sm text-gray-500 mt-1">Analyses détaillées des performances</p>
            </div>
            <div className="flex gap-2">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="7d">7 derniers jours</option>
                <option value="30d">30 derniers jours</option>
                <option value="90d">90 derniers jours</option>
                <option value="all">Tout</option>
              </select>
              <Link
                href="/dashboard-v2"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors text-sm font-medium"
              >
                ← Dashboard
              </Link>
            </div>
          </div>
        </div>

        {/* Revenue & Orders Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Revenue by day */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Revenus par jour</h2>
              <p className="text-sm text-gray-500">Évolution quotidienne</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" stroke="#9ca3af" style={{ fontSize: '11px' }} angle={-45} textAnchor="end" height={80} />
                <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                  formatter={(value: any) => [`${value}€`, 'Revenu']}
                />
                <Line type="monotone" dataKey="revenue" stroke="#5750F1" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Orders count by day */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Commandes par jour</h2>
              <p className="text-sm text-gray-500">Nombre de commandes quotidien</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ordersCountData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" stroke="#9ca3af" style={{ fontSize: '11px' }} angle={-45} textAnchor="end" height={80} />
                <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                  formatter={(value: any) => [`${value}`, 'Commandes']}
                />
                <Bar dataKey="count" fill="#3C50E0" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Payment methods */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Méthodes de paiement</h2>
              <p className="text-sm text-gray-500">Répartition des paiements</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={paymentMethodsData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {paymentMethodsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Customer stats */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Types de clients</h2>
              <p className="text-sm text-gray-500">Nouveaux vs fidèles</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={customerStatsData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {customerStatsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#10B981' : '#5750F1'} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Products & AOV */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Top products */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Top 5 Produits</h2>
              <p className="text-sm text-gray-500">Par revenu généré</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topProductsData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" stroke="#9ca3af" style={{ fontSize: '12px' }} />
                <YAxis dataKey="name" type="category" stroke="#9ca3af" style={{ fontSize: '11px' }} width={150} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                  formatter={(value: any, name: string) =>
                    name === 'revenue' ? [`${value}€`, 'Revenu'] : [value, 'Quantité']
                  }
                />
                <Legend />
                <Bar dataKey="revenue" fill="#5750F1" name="Revenu (€)" />
                <Bar dataKey="quantité" fill="#80CAEE" name="Quantité" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Average Order Value */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Panier moyen par jour</h2>
              <p className="text-sm text-gray-500">Évolution quotidienne du panier moyen</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={aovTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" stroke="#9ca3af" style={{ fontSize: '11px' }} angle={-45} textAnchor="end" height={80} />
                <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                  formatter={(value: any) => [`${value}€`, 'Panier moyen']}
                />
                <Line type="monotone" dataKey="aov" stroke="#10B981" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg shadow-sm p-6 text-white">
            <h3 className="text-sm font-medium opacity-90 mb-2">Total commandes</h3>
            <div className="text-3xl font-bold">{filterOrdersByTimeRange(orders).length}</div>
            <p className="text-xs opacity-75 mt-2">Sur la période sélectionnée</p>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-sm p-6 text-white">
            <h3 className="text-sm font-medium opacity-90 mb-2">Revenu total</h3>
            <div className="text-3xl font-bold">
              {(
                filterOrdersByTimeRange(orders).reduce((sum, o) => sum + o.totalCents, 0) / 100
              ).toFixed(2)}
              €
            </div>
            <p className="text-xs opacity-75 mt-2">Chiffre d'affaires</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-sm p-6 text-white">
            <h3 className="text-sm font-medium opacity-90 mb-2">Panier moyen</h3>
            <div className="text-3xl font-bold">
              {filterOrdersByTimeRange(orders).length > 0
                ? (
                    filterOrdersByTimeRange(orders).reduce((sum, o) => sum + o.totalCents, 0) /
                    100 /
                    filterOrdersByTimeRange(orders).length
                  ).toFixed(2)
                : '0.00'}
              €
            </div>
            <p className="text-xs opacity-75 mt-2">Par commande</p>
          </div>
        </div>
      </div>
    </div>
  )
}
