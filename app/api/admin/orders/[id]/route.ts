import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const payload = await getPayload({ config })
    const { id } = await params

    // Récupérer la commande avec toutes les relations
    const order = await payload.findByID({
      collection: 'orders',
      id,
      depth: 3,
    }) as any

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Récupérer toutes les commandes du client si la relation customer existe
    let customerOrders: any[] = []
    if (order.customer && typeof order.customer === 'object' && 'id' in order.customer) {
      const ordersResult = await payload.find({
        collection: 'orders',
        where: {
          customer: {
            equals: order.customer.id,
          },
        },
        sort: '-paymentValidatedAt',
        limit: 100,
      })
      customerOrders = ordersResult.docs
    }

    return NextResponse.json({
      order,
      customerOrders,
    })
  } catch (error: any) {
    console.error('Error fetching order:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const payload = await getPayload({ config })
    const { id } = await params
    const body = await request.json()

    // Mettre à jour la commande
    const updatedOrder = await payload.update({
      collection: 'orders',
      id,
      data: body,
    })

    return NextResponse.json({ order: updatedOrder })
  } catch (error: any) {
    console.error('Error updating order:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
