import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { subDays, startOfDay, endOfDay, format } from 'date-fns'

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config })

    // Récupérer les 30 derniers jours
    const thirtyDaysAgo = subDays(new Date(), 30)

    // Récupérer toutes les commandes payées des 30 derniers jours
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
        orders: any[]
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
        orders: [],
      }
    }

    // Regrouper les commandes par jour
    ordersResult.docs.forEach((order: any) => {
      if (order.createdAt) {
        const dateStr = format(new Date(order.createdAt), 'yyyy-MM-dd')
        if (dailyStats[dateStr]) {
          dailyStats[dateStr].revenue += order.totalCents || 0
          dailyStats[dateStr].orderCount += 1
          dailyStats[dateStr].orders.push(order)
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

    // Récupérer les 40 dernières commandes
    const recentOrdersResult = await payload.find({
      collection: 'orders',
      sort: '-createdAt',
      limit: 40,
      depth: 1,
    })

    return NextResponse.json({
      dailyStats: stats,
      recentOrders: recentOrdersResult.docs,
    })
  } catch (error: any) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
