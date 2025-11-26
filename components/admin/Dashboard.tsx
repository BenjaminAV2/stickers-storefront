'use client'

import React, { useEffect, useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface DailyStat {
  date: string
  revenue: number
  orderCount: number
  averageCart: number
}

interface Order {
  id: string
  orderNumber: string
  status: string
  paymentValidatedAt: string
  totalCents: number
  customer: any
  shippingAddress: any
  paymentMethod: string
}

interface DashboardData {
  dailyStats: DailyStat[]
  recentOrders: Order[]
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/dashboard-stats')
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data')
      }
      const result = await response.json()
      setData(result)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Chargement du dashboard...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">Erreur: {error}</div>
      </div>
    )
  }

  if (!data) {
    return null
  }

  // Formater les données pour le graphique
  const chartData = data.dailyStats
    .slice()
    .reverse()
    .map((stat) => ({
      date: format(new Date(stat.date), 'dd/MM', { locale: fr }),
      revenue: stat.revenue,
      orderCount: stat.orderCount,
      averageCart: stat.averageCart,
    }))

  // Custom Tooltip pour le graphique
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-4 border border-gray-300 rounded shadow-lg">
          <p className="font-bold">{data.date}</p>
          <p className="text-sm">CA TTC: {data.revenue.toFixed(2)} €</p>
          <p className="text-sm">Nombre de commandes: {data.orderCount}</p>
          <p className="text-sm">Panier moyen: {data.averageCart.toFixed(2)} €</p>
        </div>
      )
    }
    return null
  }

  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      pending_payment: '⏳ En attente',
      paid_awaiting_bat: '✅ Attente BAT',
      in_production: '🏭 Fabrication',
      production_complete: '✓ Terminée',
      preparing_shipment: '📦 Préparation',
      in_delivery: '🚚 En livraison',
      delivered: '✓ Livrée',
      cancelled: '❌ Annulée',
      refund_full: '💰 Remboursée',
      refund_partial: '💸 Remb. partiel',
    }
    return statusMap[status] || status
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {/* Histogramme 30 derniers jours */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-bold mb-4">CA des 30 derniers jours</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="revenue" fill="#5b40d7" name="CA TTC (€)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Liste des 40 dernières commandes */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">40 dernières commandes</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date/Heure
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  N° Commande
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pays
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Montant
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Paiement
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.paymentValidatedAt
                      ? format(new Date(order.paymentValidatedAt), 'dd/MM/yyyy HH:mm', {
                          locale: fr,
                        })
                      : '-'}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm">
                    {getStatusLabel(order.status)}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm">
                    <a
                      href={`/admin/collections/orders/${order.id}`}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      {order.orderNumber}
                    </a>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm">
                    {order.shippingAddress?.countryCode || '-'}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm">
                    {order.customer && typeof order.customer === 'object'
                      ? `${order.customer.firstName || ''} ${order.customer.lastName || ''}`
                      : '-'}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {(order.totalCents / 100).toFixed(2)} €
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm">
                    {order.paymentMethod === 'stripe' ? 'CB' : 'PayPal'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
