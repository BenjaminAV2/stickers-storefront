/**
 * API route to create orders in Medusa from local cart data
 * POST /api/orders/create
 *
 * This bypasses the normal Medusa cart flow to create orders
 * with custom line items (for custom sticker products)
 */

import { NextRequest, NextResponse } from 'next/server'

const MEDUSA_API_URL = process.env.NEXT_PUBLIC_MEDUSA_API_URL || 'https://backend-production-f3de.up.railway.app'
const MEDUSA_ADMIN_EMAIL = process.env.MEDUSA_ADMIN_EMAIL || ''
const MEDUSA_ADMIN_PASSWORD = process.env.MEDUSA_ADMIN_PASSWORD || ''

// Default shipping option ID (Standard à Domicile) as fallback
const DEFAULT_SHIPPING_OPTION_ID = 'so_01KCH49520VEZ6K46YS39JERY0'

// Cache admin token
let adminToken: string | null = null
let tokenExpiry: number = 0

async function getAdminToken(): Promise<string | null> {
  if (adminToken && Date.now() < tokenExpiry) {
    return adminToken
  }

  if (!MEDUSA_ADMIN_PASSWORD) {
    console.error('[API] MEDUSA_ADMIN_PASSWORD not configured')
    return null
  }

  try {
    const response = await fetch(`${MEDUSA_API_URL}/auth/user/emailpass`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: MEDUSA_ADMIN_EMAIL,
        password: MEDUSA_ADMIN_PASSWORD,
      }),
    })

    if (!response.ok) {
      console.error('[API] Admin auth failed:', response.status)
      return null
    }

    const data = await response.json()
    adminToken = data.token
    tokenExpiry = Date.now() + 55 * 60 * 1000
    return adminToken
  } catch (error) {
    console.error('[API] Error getting admin token:', error)
    return null
  }
}

interface CartItem {
  title: string
  quantity: number
  unitCents: number
  totalCents: number
  support?: string
  shape?: string
  widthCm?: number
  heightCm?: number
  diameterCm?: number
}

interface ShippingAddress {
  firstName: string
  lastName: string
  company?: string
  address1: string
  address2?: string
  city: string
  province?: string
  postalCode: string
  countryCode: string
  phone: string
  email: string
}

interface ShippingMethod {
  id: string
  title: string
  priceCents: number
  priceEur: number
  estimatedDelivery: string
}

interface PricingCents {
  subtotalTTC: number
  subtotalHT: number
  tva: number
  tvaRate: number
  shipping: number
  discount: number
  total: number
}

interface PricingEur {
  subtotalTTC: number
  subtotalHT: number
  tva: number
  shipping: number
  discount: number
  total: number
}

interface AppliedPromotion {
  id: string
  code?: string
  application_method?: {
    type: 'percentage' | 'fixed'
    target_type: 'order' | 'items' | 'shipping_methods'
    value: number
  }
}

interface CreateOrderRequest {
  items: CartItem[]
  shippingAddress: ShippingAddress
  shippingMethod: ShippingMethod
  appliedPromotions: AppliedPromotion[]
  pricing: PricingCents
  pricingEur: PricingEur
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateOrderRequest = await request.json()

    // Validate required fields
    if (!body.items || body.items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Le panier est vide' },
        { status: 400 }
      )
    }

    if (!body.shippingAddress || !body.shippingAddress.email) {
      return NextResponse.json(
        { success: false, error: 'Adresse de livraison requise' },
        { status: 400 }
      )
    }

    // Get admin token
    const token = await getAdminToken()
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Erreur de connexion au serveur' },
        { status: 500 }
      )
    }

    // Get region ID (Europe region)
    const regionsResponse = await fetch(`${MEDUSA_API_URL}/admin/regions`, {
      headers: { 'Authorization': `Bearer ${token}` },
    })
    const regionsData = await regionsResponse.json()
    const region = regionsData.regions?.[0]

    if (!region) {
      return NextResponse.json(
        { success: false, error: 'Région non trouvée' },
        { status: 500 }
      )
    }

    // Get sales channel
    const salesChannelsResponse = await fetch(`${MEDUSA_API_URL}/admin/sales-channels`, {
      headers: { 'Authorization': `Bearer ${token}` },
    })
    const salesChannelsData = await salesChannelsResponse.json()
    const salesChannel = salesChannelsData.sales_channels?.[0]

    // Helper function to format support type for display
    const formatSupport = (support?: string): string => {
      const supportMap: Record<string, string> = {
        vinyl_blanc: 'Vinyle Blanc',
        vinyl_mat: 'Vinyle Mat',
        vinyl_transparent: 'Vinyle Transparent',
        vinyl_holographique: 'Vinyle Holographique',
        vinyl_miroir: 'Vinyle Miroir',
      }
      return support ? (supportMap[support] || support) : ''
    }

    // Helper function to format shape for display
    const formatShape = (shape?: string): string => {
      const shapeMap: Record<string, string> = {
        square: 'Carré',
        round: 'Rond',
        rectangle: 'Rectangle',
        custom: 'Personnalisé',
      }
      return shape ? (shapeMap[shape] || shape) : ''
    }

    // Helper function to format dimensions
    const formatDimensions = (item: CartItem): string => {
      if (item.diameterCm) {
        return `Ø ${item.diameterCm} cm`
      } else if (item.widthCm && item.heightCm) {
        return `${item.widthCm} x ${item.heightCm} cm`
      }
      return ''
    }

    // Build draft order items with detailed title and pricing
    const orderItems = body.items.map((item) => {
      // Build detailed title with all product options
      const titleParts = [item.title]
      if (item.support) titleParts.push(formatSupport(item.support))
      if (item.shape) titleParts.push(formatShape(item.shape))
      const dimensions = formatDimensions(item)
      if (dimensions) titleParts.push(dimensions)

      const detailedTitle = titleParts.join(' | ')

      // Convert cents to EUR for Medusa display (workaround for admin display bug)
      // Medusa admin displays unit_price as-is without currency conversion
      const unitPriceEur = Math.round(item.unitCents) / 100

      return {
        title: detailedTitle,
        quantity: item.quantity,
        unit_price: unitPriceEur, // Price in EUR for correct admin display
        metadata: {
          // Original title
          original_title: item.title,
          // Raw values for processing
          support: item.support,
          shape: item.shape,
          widthCm: item.widthCm,
          heightCm: item.heightCm,
          diameterCm: item.diameterCm,
          // Formatted values for display
          support_display: formatSupport(item.support),
          shape_display: formatShape(item.shape),
          dimensions_display: formatDimensions(item),
          // Pricing in cents (for calculations)
          unit_price_cents: item.unitCents,
          total_cents: item.totalCents,
          // Pricing in EUR (for display)
          unit_price_eur: (item.unitCents / 100).toFixed(2),
          total_eur: (item.totalCents / 100).toFixed(2),
        },
      }
    })

    // Build shipping address
    const shippingAddress = {
      first_name: body.shippingAddress.firstName,
      last_name: body.shippingAddress.lastName,
      company: body.shippingAddress.company || '',
      address_1: body.shippingAddress.address1,
      address_2: body.shippingAddress.address2 || '',
      city: body.shippingAddress.city,
      province: body.shippingAddress.province || '',
      postal_code: body.shippingAddress.postalCode,
      country_code: body.shippingAddress.countryCode.toLowerCase(),
      phone: body.shippingAddress.phone,
    }

    // Build promo codes array for display
    const promoCodes = body.appliedPromotions
      .filter((p) => p.code)
      .map((p) => ({
        id: p.id,
        code: p.code,
        type: p.application_method?.type,
        value: p.application_method?.value,
        target: p.application_method?.target_type,
      }))

    // Create draft order with comprehensive metadata
    const draftOrderPayload: any = {
      email: body.shippingAddress.email,
      region_id: region.id,
      shipping_address: shippingAddress,
      billing_address: shippingAddress,
      items: orderItems,
      no_notification_order: false,
      metadata: {
        source: 'storefront',
        version: '2.0',
        created_at: new Date().toISOString(),

        // Shipping method details
        shipping_method: {
          id: body.shippingMethod.id,
          title: body.shippingMethod.title,
          price_cents: body.shippingMethod.priceCents,
          price_eur: body.shippingMethod.priceEur.toFixed(2),
          estimated_delivery: body.shippingMethod.estimatedDelivery,
        },

        // Complete pricing breakdown in cents
        pricing_cents: {
          subtotal_ttc: body.pricing.subtotalTTC,
          subtotal_ht: body.pricing.subtotalHT,
          tva: body.pricing.tva,
          tva_rate: body.pricing.tvaRate,
          shipping: body.pricing.shipping,
          discount: body.pricing.discount,
          total: body.pricing.total,
        },

        // Complete pricing breakdown in EUR (for display)
        pricing_eur: {
          subtotal_ttc: body.pricingEur.subtotalTTC.toFixed(2),
          subtotal_ht: body.pricingEur.subtotalHT.toFixed(2),
          tva: body.pricingEur.tva.toFixed(2),
          tva_rate: '20%',
          shipping: body.pricingEur.shipping.toFixed(2),
          discount: body.pricingEur.discount.toFixed(2),
          total: body.pricingEur.total.toFixed(2),
        },

        // Applied promotions
        applied_promotions: promoCodes,

        // Items summary for quick reference
        items_summary: body.items.map((item) => ({
          title: item.title,
          quantity: item.quantity,
          support: formatSupport(item.support),
          shape: formatShape(item.shape),
          dimensions: formatDimensions(item),
          unit_price_eur: (item.unitCents / 100).toFixed(2),
          total_eur: (item.totalCents / 100).toFixed(2),
        })),
      },
    }

    if (salesChannel) {
      draftOrderPayload.sales_channel_id = salesChannel.id
    }

    // Add shipping_methods with the Medusa shipping option ID
    // This is REQUIRED for draft order conversion to work
    // The shippingMethod.id from frontend is already the Medusa option ID (so_xxx)
    const shippingOptionId = body.shippingMethod.id.startsWith('so_')
      ? body.shippingMethod.id
      : DEFAULT_SHIPPING_OPTION_ID

    draftOrderPayload.shipping_methods = [{
      shipping_option_id: shippingOptionId,
      name: body.shippingMethod.title,
      amount: Math.round(body.shippingMethod.priceCents), // Price in cents
    }]

    console.log('[API] Creating draft order:', JSON.stringify(draftOrderPayload, null, 2))

    const draftOrderResponse = await fetch(`${MEDUSA_API_URL}/admin/draft-orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(draftOrderPayload),
    })

    const draftOrderData = await draftOrderResponse.json()

    if (!draftOrderResponse.ok) {
      console.error('[API] Draft order creation failed:', draftOrderData)
      return NextResponse.json(
        { success: false, error: draftOrderData.message || 'Erreur lors de la création de la commande' },
        { status: draftOrderResponse.status }
      )
    }

    const draftOrder = draftOrderData.draft_order

    // For free orders (total = 0), return as draft order ready for merchant review
    // Note: Automatic conversion is not supported for custom items without variant_id
    // The merchant should review and process these orders manually from the admin
    if (body.pricing.total === 0) {
      console.log('[API] Free order created as draft - ready for merchant review')
      console.log('[API] Draft order details:', {
        id: draftOrder.id,
        display_id: draftOrder.display_id,
        email: body.shippingAddress.email,
        total: body.pricingEur.total,
      })

      return NextResponse.json({
        success: true,
        order: {
          id: draftOrder.id,
          display_id: draftOrder.display_id,
          status: 'pending_review',
          type: 'draft_order',
        },
        message: 'Commande gratuite créée - en attente de validation',
      })
    }

    // For paid orders, return the draft order (payment will be handled separately)
    return NextResponse.json({
      success: true,
      order: {
        id: draftOrder.id,
        display_id: draftOrder.display_id,
        status: 'pending_payment',
        type: 'draft_order',
      },
    })
  } catch (error) {
    console.error('[API] Error creating order:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la création de la commande' },
      { status: 500 }
    )
  }
}
