import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { startOfDay, endOfDay } from 'date-fns'

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const searchParams = request.nextUrl.searchParams

    // Paramètres de pagination
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '30')

    // Paramètres de filtrage
    const status = searchParams.get('status')
    const country = searchParams.get('country')
    const search = searchParams.get('search')
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')

    // Construire la requête where
    const whereConditions: any[] = []

    // Filtrer par statut
    if (status && status !== 'all') {
      whereConditions.push({
        status: {
          equals: status,
        },
      })
    }

    // Filtrer par pays
    if (country) {
      whereConditions.push({
        'shippingAddress.countryCode': {
          equals: country,
        },
      })
    }

    // Recherche par numéro de commande ou nom de client
    if (search) {
      whereConditions.push({
        or: [
          {
            orderNumber: {
              contains: search,
            },
          },
          {
            'customer.firstName': {
              contains: search,
            },
          },
          {
            'customer.lastName': {
              contains: search,
            },
          },
          {
            'customer.company': {
              contains: search,
            },
          },
        ],
      })
    }

    // Filtrer par date
    if (dateFrom) {
      whereConditions.push({
        createdAt: {
          greater_than_equal: startOfDay(new Date(dateFrom)).toISOString(),
        },
      })
    }

    if (dateTo) {
      whereConditions.push({
        createdAt: {
          less_than_equal: endOfDay(new Date(dateTo)).toISOString(),
        },
      })
    }

    // Si aucun filtre de date n'est spécifié, afficher les commandes du jour par défaut
    if (!dateFrom && !dateTo) {
      const today = new Date()
      whereConditions.push({
        createdAt: {
          greater_than_equal: startOfDay(today).toISOString(),
          less_than_equal: endOfDay(today).toISOString(),
        },
      })
    }

    // Construire l'objet where
    const where =
      whereConditions.length > 0
        ? {
            and: whereConditions,
          }
        : {}

    // Récupérer les commandes
    const ordersResult = await payload.find({
      collection: 'orders',
      where,
      sort: '-createdAt',
      page,
      limit,
      depth: 2, // Pour récupérer les relations (customer, etc.)
    })

    return NextResponse.json({
      orders: ordersResult.docs,
      pagination: {
        page: ordersResult.page,
        limit: ordersResult.limit,
        totalPages: ordersResult.totalPages,
        totalDocs: ordersResult.totalDocs,
        hasNextPage: ordersResult.hasNextPage,
        hasPrevPage: ordersResult.hasPrevPage,
      },
    })
  } catch (error: any) {
    console.error('Error fetching orders:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
