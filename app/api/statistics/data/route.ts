import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET() {
  try {
    const payload = await getPayload({ config })

    const now = new Date()

    // Récupérer toutes les commandes payées
    const allOrders = await payload.find({
      collection: 'orders',
      where: {
        paymentStatus: {
          equals: 'paid',
        },
      },
      limit: 10000,
    })

    // ===== DONNÉES MENSUELLES (30 derniers mois) =====
    const monthlyData = []
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1)
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59)

      const monthStr = date.toLocaleDateString('fr-FR', {
        month: 'short',
        year: 'numeric',
      })

      const monthOrders = allOrders.docs.filter(order => {
        const paidAt = new Date(order.paidAt as string)
        return paidAt >= monthStart && paidAt <= monthEnd
      })

      const monthRevenue = monthOrders.reduce((sum, order) => sum + (order.totalCents || 0), 0)
      const monthOrderCount = monthOrders.length
      const monthAverage = monthOrderCount > 0 ? monthRevenue / monthOrderCount : 0

      monthlyData.push({
        month: monthStr,
        revenue: monthRevenue,
        orders: monthOrderCount,
        averageOrder: monthAverage,
      })
    }

    // ===== DONNÉES JOURNALIÈRES (30 derniers jours) =====
    const dailyData = []
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
      const dateStr = date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
      })

      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate())
      const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000)

      const dayOrders = allOrders.docs.filter(order => {
        const paidAt = new Date(order.paidAt as string)
        return paidAt >= dayStart && paidAt < dayEnd
      })

      const dayRevenue = dayOrders.reduce((sum, order) => sum + (order.totalCents || 0), 0)
      const dayOrderCount = dayOrders.length
      const dayAverage = dayOrderCount > 0 ? dayRevenue / dayOrderCount : 0

      dailyData.push({
        date: dateStr,
        revenue: dayRevenue,
        orders: dayOrderCount,
        averageOrder: dayAverage,
      })
    }

    // ===== COMPARAISON N vs N-1 (30 derniers jours) =====
    const comparisonData = []
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
    const oneYearAgo30Days = new Date(oneYearAgo.getTime() - 30 * 24 * 60 * 60 * 1000)

    let totalCurrentYear = 0
    let totalPreviousYear = 0
    let totalCurrentYearOrders = 0
    let totalPreviousYearOrders = 0

    for (let i = 29; i >= 0; i--) {
      const currentDate = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
      const previousDate = new Date(oneYearAgo.getTime() - i * 24 * 60 * 60 * 1000)

      const dateStr = currentDate.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
      })

      // Current year
      const currentDayStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate())
      const currentDayEnd = new Date(currentDayStart.getTime() + 24 * 60 * 60 * 1000)

      const currentDayOrders = allOrders.docs.filter(order => {
        const paidAt = new Date(order.paidAt as string)
        return paidAt >= currentDayStart && paidAt < currentDayEnd
      })

      const currentDayRevenue = currentDayOrders.reduce((sum, order) => sum + (order.totalCents || 0), 0)
      const currentDayOrderCount = currentDayOrders.length
      const currentDayAvg = currentDayOrderCount > 0 ? currentDayRevenue / currentDayOrderCount : 0

      // Previous year
      const previousDayStart = new Date(previousDate.getFullYear(), previousDate.getMonth(), previousDate.getDate())
      const previousDayEnd = new Date(previousDayStart.getTime() + 24 * 60 * 60 * 1000)

      const previousDayOrders = allOrders.docs.filter(order => {
        const paidAt = new Date(order.paidAt as string)
        return paidAt >= previousDayStart && paidAt < previousDayEnd
      })

      const previousDayRevenue = previousDayOrders.reduce((sum, order) => sum + (order.totalCents || 0), 0)
      const previousDayOrderCount = previousDayOrders.length
      const previousDayAvg = previousDayOrderCount > 0 ? previousDayRevenue / previousDayOrderCount : 0

      totalCurrentYear += currentDayRevenue
      totalPreviousYear += previousDayRevenue
      totalCurrentYearOrders += currentDayOrderCount
      totalPreviousYearOrders += previousDayOrderCount

      comparisonData.push({
        date: dateStr,
        currentYear: currentDayRevenue,
        previousYear: previousDayRevenue,
        currentYearOrders: currentDayOrderCount,
        previousYearOrders: previousDayOrderCount,
        currentYearAvg: currentDayAvg,
        previousYearAvg: previousDayAvg,
      })
    }

    // Calculer les moyennes globales
    const currentYearAvg = totalCurrentYearOrders > 0 ? totalCurrentYear / totalCurrentYearOrders : 0
    const previousYearAvg = totalPreviousYearOrders > 0 ? totalPreviousYear / totalPreviousYearOrders : 0

    return NextResponse.json({
      monthlyData,
      dailyData,
      comparisonData,
      totals: {
        currentYear: totalCurrentYear,
        previousYear: totalPreviousYear,
        currentYearOrders: totalCurrentYearOrders,
        previousYearOrders: totalPreviousYearOrders,
        currentYearAvg,
        previousYearAvg,
      },
    })
  } catch (error) {
    console.error('Error fetching statistics:', error)
    return NextResponse.json({ error: 'Failed to fetch statistics' }, { status: 500 })
  }
}
