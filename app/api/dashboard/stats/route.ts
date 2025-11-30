import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET() {
  try {
    const payload = await getPayload({ config })

    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    // Récupérer toutes les commandes des 30 derniers jours
    const ordersLast30Days = await payload.find({
      collection: 'orders',
      where: {
        and: [
          {
            paidAt: {
              greater_than: thirtyDaysAgo.toISOString(),
            },
          },
          {
            paymentStatus: {
              equals: 'paid',
            },
          },
        ],
      },
      limit: 1000,
    })

    // Calculer les KPIs
    const revenue30Days = ordersLast30Days.docs.reduce((sum, order: any) => sum + (order.totalCents || 0), 0)
    const orders30Days = ordersLast30Days.docs.length
    const averageOrder = orders30Days > 0 ? revenue30Days / orders30Days : 0

    // Commandes du jour
    const ordersToday = ordersLast30Days.docs.filter(order => {
      const paidAt = new Date(order.paidAt as string)
      return paidAt >= startOfDay
    }).length

    // Préparer les données journalières pour le graphique
    const dailyRevenue = []
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
      const dateStr = date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
      })

      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate())
      const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000)

      const dayOrders = ordersLast30Days.docs.filter(order => {
        const paidAt = new Date(order.paidAt as string)
        return paidAt >= dayStart && paidAt < dayEnd
      })

      const dayRevenue = dayOrders.reduce((sum, order: any) => sum + (order.totalCents || 0), 0)
      const dayOrderCount = dayOrders.length
      const dayAverage = dayOrderCount > 0 ? dayRevenue / dayOrderCount : 0

      dailyRevenue.push({
        date: dateStr,
        revenue: dayRevenue,
        orders: dayOrderCount,
        averageOrder: dayAverage,
      })
    }

    // Récupérer les 40 dernières commandes avec détails
    const recentOrders = await payload.find({
      collection: 'orders',
      sort: '-paidAt',
      limit: 40,
      where: {
        paymentStatus: {
          equals: 'paid',
        },
      },
    })

    // Enrichir avec le nombre de commandes par client
    const enrichedOrders = await Promise.all(
      recentOrders.docs.map(async (order) => {
        const customerOrders = await payload.count({
          collection: 'orders',
          where: {
            customer: {
              equals: typeof order.customer === 'object' ? order.customer.id : order.customer,
            },
          },
        })

        return {
          id: order.id,
          orderNumber: order.orderNumber,
          status: order.status,
          countryCode: order.countryCode,
          customerName: order.customerName,
          customerCompany: order.customerCompany,
          customer: typeof order.customer === 'object' ? order.customer.id : order.customer,
          totalCents: order.totalCents,
          paidAt: order.paidAt,
          createdAt: order.createdAt,
          items: order.items,
          invoiceUrl: order.invoiceUrl,
          paymentMethod: order.paymentMethod,
          customerOrderCount: customerOrders,
        }
      })
    )

    return NextResponse.json({
      revenue30Days,
      orders30Days,
      averageOrder,
      ordersToday,
      dailyRevenue,
      recentOrders: enrichedOrders,
    })
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json({ error: 'Failed to fetch dashboard stats' }, { status: 500 })
  }
}
