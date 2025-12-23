/**
 * Webhook Medusa pour les événements de commandes
 * Endpoint: POST /api/webhooks/medusa
 */

import { NextRequest, NextResponse } from 'next/server'

const MEDUSA_ORDER_EVENTS = [
  'order.placed',
  'order.updated',
  'order.completed',
  'order.canceled',
  'order.payment_captured',
  'order.fulfillment_created',
  'order.shipment_created',
]

interface MedusaWebhookPayload {
  event: string
  data: {
    id: string
    [key: string]: unknown
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const payload: MedusaWebhookPayload = JSON.parse(body)

    console.log(`[Medusa Webhook] Event received: ${payload.event}`)

    if (!MEDUSA_ORDER_EVENTS.includes(payload.event)) {
      return NextResponse.json({
        message: 'Event ignored',
        event: payload.event
      })
    }

    const orderId = payload.data.id

    // Log order event for monitoring
    console.log(`[Medusa Webhook] Order event: ${payload.event} for order ${orderId}`)

    return NextResponse.json({
      success: true,
      message: 'Webhook received',
      orderId,
      event: payload.event
    })
  } catch (error) {
    console.error('[Medusa Webhook] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Medusa webhook endpoint is active',
    events: MEDUSA_ORDER_EVENTS,
  })
}
