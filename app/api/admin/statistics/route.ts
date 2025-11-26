import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { subDays, subMonths, startOfMonth, endOfMonth, format } from 'date-fns'

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type') // 'monthly', 'daily', 'daily-previous-year'

    if (type === 'monthly') {
      // Récupérer les 30 derniers mois
      const thirtyMonthsAgo = subMonths(new Date(), 30)

      const ordersResult = await payload.find({
        collection: 'orders',
        where: {
          and: [
            {
              createdAt: {
                greater_than_equal: thirtyMonthsAgo.toISOString(),
              },
            },
            {
              status: {
                not_equals: 'pending_payment',
              },
            },
          ],
        },
        limit: 10000,
      })

      // Créer un objet pour stocker les données par mois
      const monthlyStats: Record<
        string,
        {
          month: string
          revenue: number
          orderCount: number
        }
      > = {}

      // Initialiser tous les mois des 30 derniers mois
      for (let i = 0; i < 30; i++) {
        const date = subMonths(new Date(), i)
        const monthStr = format(date, 'yyyy-MM')
        monthlyStats[monthStr] = {
          month: monthStr,
          revenue: 0,
          orderCount: 0,
        }
      }

      // Regrouper les commandes par mois
      ordersResult.docs.forEach((order: any) => {
        if (order.createdAt) {
          const monthStr = format(new Date(order.createdAt), 'yyyy-MM')
          if (monthlyStats[monthStr]) {
            monthlyStats[monthStr].revenue += order.totalCents || 0
            monthlyStats[monthStr].orderCount += 1
          }
        }
      })

      // Convertir en tableau et trier par mois (plus récent en premier)
      const stats = Object.values(monthlyStats)
        .sort((a, b) => b.month.localeCompare(a.month))
        .map((month) => ({
          month: month.month,
          revenue: month.revenue / 100, // Convertir en euros
          orderCount: month.orderCount,
          averageCart: month.orderCount > 0 ? month.revenue / 100 / month.orderCount : 0,
        }))

      return NextResponse.json({ monthlyStats: stats })
    } else if (type === 'daily') {
      // Récupérer les 30 derniers jours de l'année en cours
      const thirtyDaysAgo = subDays(new Date(), 30)

      const ordersResult = await payload.find({
        collection: 'orders',
        where: {
          and: [
            {
              createdAt: {
                greater_than_equal: thirtyDaysAgo.toISOString(),
              },
            },
            {
              status: {
                not_equals: 'pending_payment',
              },
            },
          ],
        },
        limit: 10000,
      })

      // Créer un objet pour stocker les données par jour
      const dailyStats: Record<
        string,
        {
          date: string
          revenue: number
          orderCount: number
        }
      > = {}

      // Initialiser tous les jours des 30 derniers jours
      for (let i = 0; i < 30; i++) {
        const date = subDays(new Date(), i)
        const dateStr = format(date, 'yyyy-MM-dd')
        dailyStats[dateStr] = {
          date: dateStr,
          revenue: 0,
          orderCount: 0,
        }
      }

      // Regrouper les commandes par jour
      ordersResult.docs.forEach((order: any) => {
        if (order.createdAt) {
          const dateStr = format(new Date(order.createdAt), 'yyyy-MM-dd')
          if (dailyStats[dateStr]) {
            dailyStats[dateStr].revenue += order.totalCents || 0
            dailyStats[dateStr].orderCount += 1
          }
        }
      })

      // Convertir en tableau et trier par date (plus récent en premier)
      const stats = Object.values(dailyStats)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .map((day) => ({
          date: day.date,
          revenue: day.revenue / 100, // Convertir en euros
          orderCount: day.orderCount,
          averageCart: day.orderCount > 0 ? day.revenue / 100 / day.orderCount : 0,
        }))

      return NextResponse.json({ dailyStats: stats })
    } else if (type === 'daily-previous-year') {
      // Récupérer les 30 derniers jours de l'année précédente (mêmes dates)
      const today = new Date()
      const lastYear = new Date(today)
      lastYear.setFullYear(today.getFullYear() - 1)

      const thirtyDaysAgoLastYear = subDays(lastYear, 30)

      const ordersResult = await payload.find({
        collection: 'orders',
        where: {
          and: [
            {
              createdAt: {
                greater_than_equal: thirtyDaysAgoLastYear.toISOString(),
                less_than_equal: lastYear.toISOString(),
              },
            },
            {
              status: {
                not_equals: 'pending_payment',
              },
            },
          ],
        },
        limit: 10000,
      })

      // Créer un objet pour stocker les données par jour
      const dailyStats: Record<
        string,
        {
          date: string
          revenue: number
          orderCount: number
        }
      > = {}

      // Initialiser tous les jours des 30 derniers jours de l'année précédente
      for (let i = 0; i < 30; i++) {
        const date = subDays(lastYear, i)
        const dateStr = format(date, 'yyyy-MM-dd')
        dailyStats[dateStr] = {
          date: dateStr,
          revenue: 0,
          orderCount: 0,
        }
      }

      // Regrouper les commandes par jour
      ordersResult.docs.forEach((order: any) => {
        if (order.createdAt) {
          const dateStr = format(new Date(order.createdAt), 'yyyy-MM-dd')
          if (dailyStats[dateStr]) {
            dailyStats[dateStr].revenue += order.totalCents || 0
            dailyStats[dateStr].orderCount += 1
          }
        }
      })

      // Convertir en tableau et trier par date (plus récent en premier)
      const stats = Object.values(dailyStats)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .map((day) => ({
          date: day.date,
          revenue: day.revenue / 100, // Convertir en euros
          orderCount: day.orderCount,
          averageCart: day.orderCount > 0 ? day.revenue / 100 / day.orderCount : 0,
        }))

      return NextResponse.json({ dailyStatsPreviousYear: stats })
    }

    return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 })
  } catch (error: any) {
    console.error('Error fetching statistics:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
