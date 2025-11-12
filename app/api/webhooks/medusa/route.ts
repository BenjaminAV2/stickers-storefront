/**
 * Webhook Medusa pour la synchronisation des commandes
 *
 * Endpoint: POST /api/webhooks/medusa
 *
 * Ce webhook reçoit les événements de Medusa et synchronise
 * automatiquement les commandes avec Payload CMS
 */

import { NextRequest, NextResponse } from 'next/server'
import { syncOrder } from '@/lib/medusa/sync-orders'

/**
 * Types d'événements Medusa que nous écoutons
 */
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
  metadata?: {
    [key: string]: unknown
  }
}

/**
 * Vérifie la signature du webhook Medusa (optionnel mais recommandé en production)
 */
function verifyWebhookSignature(
  request: NextRequest,
  body: string
): boolean {
  const signature = request.headers.get('x-medusa-signature')
  const webhookSecret = process.env.MEDUSA_WEBHOOK_SECRET

  // Si aucun secret n'est configuré, on accepte tous les webhooks (dev uniquement)
  if (!webhookSecret) {
    console.warn('[Medusa Webhook] MEDUSA_WEBHOOK_SECRET non configuré - tous les webhooks sont acceptés')
    return true
  }

  if (!signature) {
    console.error('[Medusa Webhook] Signature manquante')
    return false
  }

  // Vérifier la signature HMAC
  // TODO: Implémenter la vérification HMAC avec crypto
  // Pour l'instant, on compare simplement les signatures
  return signature === webhookSecret
}

/**
 * Handler POST pour les webhooks Medusa
 */
export async function POST(request: NextRequest) {
  try {
    // Lire le body
    const body = await request.text()

    // Vérifier la signature
    if (!verifyWebhookSignature(request, body)) {
      return NextResponse.json(
        { error: 'Invalid webhook signature' },
        { status: 401 }
      )
    }

    // Parser le payload
    const payload: MedusaWebhookPayload = JSON.parse(body)

    console.log(`[Medusa Webhook] Événement reçu: ${payload.event}`)

    // Vérifier si c'est un événement de commande
    if (!MEDUSA_ORDER_EVENTS.includes(payload.event)) {
      console.log(`[Medusa Webhook] Événement ${payload.event} ignoré`)
      return NextResponse.json({
        message: 'Event ignored',
        event: payload.event
      })
    }

    // Récupérer l'ID de la commande
    const orderId = payload.data.id

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID missing from webhook payload' },
        { status: 400 }
      )
    }

    // Synchroniser la commande en arrière-plan
    // Note: En production, utilisez une queue (Bull, Redis, etc.)
    syncOrder(orderId).catch((error) => {
      console.error(`[Medusa Webhook] Erreur de synchronisation pour ${orderId}:`, error)
    })

    return NextResponse.json({
      success: true,
      message: 'Order sync initiated',
      orderId,
      event: payload.event
    })
  } catch (error) {
    console.error('[Medusa Webhook] Erreur:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

/**
 * Handler GET pour vérifier que l'endpoint est actif
 */
export async function GET() {
  return NextResponse.json({
    message: 'Medusa webhook endpoint is active',
    events: MEDUSA_ORDER_EVENTS,
  })
}
