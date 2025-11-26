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

interface StatItem {
  date?: string
  month?: string
  revenue: number
  orderCount: number
  averageCart: number
}

export default function Statistics() {
  const [monthlyStats, setMonthlyStats] = useState<StatItem[]>([])
  const [dailyStats, setDailyStats] = useState<StatItem[]>([])
  const [dailyStatsPreviousYear, setDailyStatsPreviousYear] = useState<StatItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAllStats()
  }, [])

  const fetchAllStats = async () => {
    try {
      setLoading(true)

      // Récupérer les statistiques mensuelles
      const monthlyResponse = await fetch('/api/admin/statistics?type=monthly')
      if (!monthlyResponse.ok) throw new Error('Failed to fetch monthly stats')
      const monthlyData = await monthlyResponse.json()
      setMonthlyStats(monthlyData.monthlyStats || [])

      // Récupérer les statistiques journalières
      const dailyResponse = await fetch('/api/admin/statistics?type=daily')
      if (!dailyResponse.ok) throw new Error('Failed to fetch daily stats')
      const dailyData = await dailyResponse.json()
      setDailyStats(dailyData.dailyStats || [])

      // Récupérer les statistiques journalières de l'année précédente
      const dailyPrevYearResponse = await fetch('/api/admin/statistics?type=daily-previous-year')
      if (!dailyPrevYearResponse.ok) throw new Error('Failed to fetch daily previous year stats')
      const dailyPrevYearData = await dailyPrevYearResponse.json()
      setDailyStatsPreviousYear(dailyPrevYearData.dailyStatsPreviousYear || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Custom Tooltip pour les graphiques
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-4 border border-gray-300 rounded shadow-lg">
          <p className="font-bold">{data.month || data.date}</p>
          <p className="text-sm">CA TTC: {data.revenue.toFixed(2)} €</p>
          <p className="text-sm">Nombre de commandes: {data.orderCount}</p>
          <p className="text-sm">Panier moyen: {data.averageCart.toFixed(2)} €</p>
        </div>
      )
    }
    return null
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Chargement des statistiques...</div>
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

  // Formater les données pour les graphiques
  const monthlyChartData = monthlyStats
    .slice()
    .reverse()
    .map((stat) => ({
      month: stat.month,
      revenue: stat.revenue,
      orderCount: stat.orderCount,
      averageCart: stat.averageCart,
    }))

  const dailyChartData = dailyStats
    .slice()
    .reverse()
    .map((stat) => ({
      date: format(new Date(stat.date!), 'dd/MM', { locale: fr }),
      revenue: stat.revenue,
      orderCount: stat.orderCount,
      averageCart: stat.averageCart,
    }))

  const dailyPrevYearChartData = dailyStatsPreviousYear
    .slice()
    .reverse()
    .map((stat) => ({
      date: format(new Date(stat.date!), 'dd/MM', { locale: fr }),
      revenue: stat.revenue,
      orderCount: stat.orderCount,
      averageCart: stat.averageCart,
    }))

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Statistiques</h1>

      {/* Histogramme mensuel - 30 derniers mois */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-bold mb-4">CA par mois (30 derniers mois)</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={monthlyChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" angle={-45} textAnchor="end" height={80} />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="revenue" fill="#5b40d7" name="CA TTC (€)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Histogramme journalier - 30 derniers jours */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-bold mb-4">CA par jour (30 derniers jours - Année en cours)</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={dailyChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="revenue" fill="#10b981" name="CA TTC (€)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Histogramme journalier - 30 derniers jours N-1 */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-bold mb-4">
          CA par jour (30 derniers jours - Année précédente N-1)
        </h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={dailyPrevYearChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="revenue" fill="#f59e0b" name="CA TTC (€)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Comparaison */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Comparaison Année en cours vs N-1</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">CA Total (30j)</h3>
            <p className="text-3xl font-bold text-green-600">
              {dailyStats.reduce((sum, stat) => sum + stat.revenue, 0).toFixed(2)} €
            </p>
            <p className="text-sm text-gray-500">Année en cours</p>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">CA Total (30j)</h3>
            <p className="text-3xl font-bold text-orange-600">
              {dailyStatsPreviousYear.reduce((sum, stat) => sum + stat.revenue, 0).toFixed(2)} €
            </p>
            <p className="text-sm text-gray-500">Année précédente</p>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Évolution</h3>
            <p
              className={`text-3xl font-bold ${
                dailyStats.reduce((sum, stat) => sum + stat.revenue, 0) >=
                dailyStatsPreviousYear.reduce((sum, stat) => sum + stat.revenue, 0)
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}
            >
              {dailyStatsPreviousYear.reduce((sum, stat) => sum + stat.revenue, 0) > 0
                ? (
                    ((dailyStats.reduce((sum, stat) => sum + stat.revenue, 0) -
                      dailyStatsPreviousYear.reduce((sum, stat) => sum + stat.revenue, 0)) /
                      dailyStatsPreviousYear.reduce((sum, stat) => sum + stat.revenue, 0)) *
                    100
                  ).toFixed(1)
                : 0}
              %
            </p>
            <p className="text-sm text-gray-500">vs année précédente</p>
          </div>
        </div>
      </div>
    </div>
  )
}
