/**
 * Script de synchronisation des commandes Medusa vers Payload CMS
 *
 * Ce script récupère les commandes depuis Medusa et les synchronise avec Payload
 */

import { getPayload } from 'payload'
import config from '@payload-config'
import { getMedusaClient } from './client'

/**
 * Interface pour une commande Medusa v2
 */
interface MedusaOrder {
  id: string
  status: string
  email: string
  customer_id?: string
  currency_code: string
  total: number
  subtotal: number
  tax_total?: number
  shipping_total?: number
  discount_total?: number
  created_at: string
  updated_at: string
  items?: Array<{
    id: string
    title: string
    quantity: number
    unit_price: number
    total: number
  }>
  shipping_address?: {
    first_name?: string
    last_name?: string
    address_1?: string
    address_2?: string
    city?: string
    province?: string
    postal_code?: string
    country_code?: string
  }
  billing_address?: {
    first_name?: string
    last_name?: string
    address_1?: string
    address_2?: string
    city?: string
    province?: string
    postal_code?: string
    country_code?: string
  }
}

/**
 * Transforme une commande Medusa en format Payload
 */
function transformMedusaOrderToPayload(medusaOrder: MedusaOrder) {
  return {
    medusaOrderId: medusaOrder.id,
    status: medusaOrder.status,
    customerEmail: medusaOrder.email,
    customerId: medusaOrder.customer_id || null,
    currency: medusaOrder.currency_code,
    total: medusaOrder.total / 100, // Medusa stocke en centimes
    subtotal: medusaOrder.subtotal / 100,
    taxTotal: medusaOrder.tax_total ? medusaOrder.tax_total / 100 : 0,
    shippingTotal: medusaOrder.shipping_total ? medusaOrder.shipping_total / 100 : 0,
    discountTotal: medusaOrder.discount_total ? medusaOrder.discount_total / 100 : 0,
    items: medusaOrder.items?.map(item => ({
      id: item.id,
      title: item.title,
      quantity: item.quantity,
      unitPrice: item.unit_price / 100,
      total: item.total / 100,
    })) || [],
    shippingAddress: medusaOrder.shipping_address ? {
      firstName: medusaOrder.shipping_address.first_name || '',
      lastName: medusaOrder.shipping_address.last_name || '',
      address1: medusaOrder.shipping_address.address_1 || '',
      address2: medusaOrder.shipping_address.address_2 || '',
      city: medusaOrder.shipping_address.city || '',
      province: medusaOrder.shipping_address.province || '',
      postalCode: medusaOrder.shipping_address.postal_code || '',
      countryCode: medusaOrder.shipping_address.country_code || '',
    } : null,
    billingAddress: medusaOrder.billing_address ? {
      firstName: medusaOrder.billing_address.first_name || '',
      lastName: medusaOrder.billing_address.last_name || '',
      address1: medusaOrder.billing_address.address_1 || '',
      address2: medusaOrder.billing_address.address_2 || '',
      city: medusaOrder.billing_address.city || '',
      province: medusaOrder.billing_address.province || '',
      postalCode: medusaOrder.billing_address.postal_code || '',
      countryCode: medusaOrder.billing_address.country_code || '',
    } : null,
    medusaCreatedAt: medusaOrder.created_at,
    medusaUpdatedAt: medusaOrder.updated_at,
  }
}

/**
 * Synchronise une seule commande Medusa vers Payload
 */
export async function syncOrder(orderId: string): Promise<void> {
  try {
    console.log(`[Medusa Sync] Synchronisation de la commande ${orderId}...`)

    const medusaClient = getMedusaClient()
    const payload = await getPayload({ config })

    // Récupérer la commande depuis Medusa
    const medusaResponse = await medusaClient.getOrder(orderId) as { order: MedusaOrder }
    const medusaOrder = medusaResponse.order

    if (!medusaOrder) {
      throw new Error(`Commande ${orderId} introuvable dans Medusa`)
    }

    // Vérifier si la commande existe déjà dans Payload
    const existingOrders = await payload.find({
      collection: 'orders',
      where: {
        medusaOrderId: {
          equals: orderId,
        },
      },
      limit: 1,
    })

    const payloadOrderData = transformMedusaOrderToPayload(medusaOrder)

    if (existingOrders.docs.length > 0) {
      // Mettre à jour la commande existante
      const existingOrder = existingOrders.docs[0]
      await payload.update({
        collection: 'orders',
        id: existingOrder.id,
        data: payloadOrderData,
      })
      console.log(`[Medusa Sync] Commande ${orderId} mise à jour avec succès`)
    } else {
      // Créer une nouvelle commande
      await payload.create({
        collection: 'orders',
        data: payloadOrderData as any,
      })
      console.log(`[Medusa Sync] Commande ${orderId} créée avec succès`)
    }
  } catch (error) {
    console.error(`[Medusa Sync] Erreur lors de la synchronisation de la commande ${orderId}:`, error)
    throw error
  }
}

/**
 * Synchronise toutes les commandes Medusa vers Payload
 */
export async function syncAllOrders(options?: {
  limit?: number
  status?: string
}): Promise<void> {
  try {
    console.log('[Medusa Sync] Démarrage de la synchronisation de toutes les commandes...')

    const medusaClient = getMedusaClient()
    const payload = await getPayload({ config })

    let offset = 0
    const limit = options?.limit || 50
    let hasMore = true

    while (hasMore) {
      console.log(`[Medusa Sync] Récupération des commandes (offset: ${offset}, limit: ${limit})...`)

      const medusaResponse = await medusaClient.getOrders({
        limit,
        offset,
        status: options?.status,
      }) as { orders: MedusaOrder[] }

      const orders = medusaResponse.orders

      if (!orders || orders.length === 0) {
        hasMore = false
        break
      }

      // Synchroniser chaque commande
      for (const medusaOrder of orders) {
        try {
          // Vérifier si la commande existe déjà
          const existingOrders = await payload.find({
            collection: 'orders',
            where: {
              medusaOrderId: {
                equals: medusaOrder.id,
              },
            },
            limit: 1,
          })

          const payloadOrderData = transformMedusaOrderToPayload(medusaOrder)

          if (existingOrders.docs.length > 0) {
            // Mettre à jour
            const existingOrder = existingOrders.docs[0]
            await payload.update({
              collection: 'orders',
              id: existingOrder.id,
              data: payloadOrderData,
            })
            console.log(`[Medusa Sync] Commande ${medusaOrder.id} mise à jour`)
          } else {
            // Créer
            await payload.create({
              collection: 'orders',
              data: payloadOrderData as any,
            })
            console.log(`[Medusa Sync] Commande ${medusaOrder.id} créée`)
          }
        } catch (error) {
          console.error(`[Medusa Sync] Erreur pour la commande ${medusaOrder.id}:`, error)
          // Continuer avec les autres commandes même en cas d'erreur
        }
      }

      offset += limit

      // Si on a récupéré moins de commandes que la limite, on a tout récupéré
      if (orders.length < limit) {
        hasMore = false
      }
    }

    console.log('[Medusa Sync] Synchronisation terminée avec succès')
  } catch (error) {
    console.error('[Medusa Sync] Erreur lors de la synchronisation:', error)
    throw error
  }
}
