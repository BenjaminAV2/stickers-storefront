import { NextRequest, NextResponse } from 'next/server'

const MEDUSA_API_URL = process.env.NEXT_PUBLIC_MEDUSA_API_URL || 'https://backend-production-f3de.up.railway.app'
const MEDUSA_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

interface MedusaShippingOption {
  id: string
  name: string
  amount: number
  price_type: string
  data?: {
    isRelayService?: boolean
    relayProvider?: string
  } | null
  type?: {
    label: string
    description: string
    code: string
  }
  calculated_price?: {
    calculated_amount: number
  }
}

interface TransformedShippingProvider {
  id: string
  title: string
  subtitle?: string
  logo?: string | null
  price: number
  estimatedDelivery: string
  isRelayService: boolean
  relayApi?: {
    provider?: string
  }
  trackingUrl?: string
  features?: string[]
  postalCodeRestriction?: string | null
}

/**
 * GET /api/medusa/shipping-options
 * Fetches shipping options from Medusa backend
 * Requires cart_id query parameter
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const cartId = searchParams.get('cart_id')

    if (!cartId) {
      return NextResponse.json(
        {
          success: false,
          error: 'cart_id is required',
          providers: [],
        },
        { status: 400 }
      )
    }

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }

    if (MEDUSA_PUBLISHABLE_KEY) {
      headers['x-publishable-api-key'] = MEDUSA_PUBLISHABLE_KEY
    }

    // Fetch shipping options from Medusa
    const response = await fetch(
      `${MEDUSA_API_URL}/store/shipping-options?cart_id=${cartId}`,
      {
        method: 'GET',
        headers,
        cache: 'no-store',
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('[Medusa Shipping Options] Error:', response.status, errorText)
      return NextResponse.json(
        {
          success: false,
          error: `Failed to fetch shipping options: ${response.status}`,
          providers: [],
        },
        { status: response.status }
      )
    }

    const data = await response.json()
    const shippingOptions: MedusaShippingOption[] = data.shipping_options || []

    // Transform Medusa shipping options to match frontend interface
    const transformedProviders: TransformedShippingProvider[] = shippingOptions.map((option) => {
      // Map carrier codes to logos (you can add your own logo URLs)
      const logoMap: Record<string, string> = {
        'colissimo': '/images/carriers/colissimo.png',
        'colissimo-signature': '/images/carriers/colissimo.png',
        'chronopost': '/images/carriers/chronopost.png',
        'mondial-relay': '/images/carriers/mondial-relay.png',
        'relais-colis': '/images/carriers/relais-colis.png',
        'lettre-suivie': '/images/carriers/la-poste.png',
        'standard': '/images/carriers/default.png',
        'express': '/images/carriers/express.png',
      }

      // Map carrier codes to estimated delivery times
      const deliveryMap: Record<string, string> = {
        'colissimo': '2-3 jours ouvrés',
        'colissimo-signature': '2-3 jours ouvrés',
        'chronopost': '24h',
        'mondial-relay': '3-5 jours ouvrés',
        'relais-colis': '3-5 jours ouvrés',
        'lettre-suivie': '2-4 jours ouvrés',
        'standard': '2-3 jours ouvrés',
        'express': '24h',
      }

      const code = option.type?.code || 'standard'
      const isRelayService = (option.data?.isRelayService) ||
        code.includes('relay') ||
        code.includes('relais')

      // Get price from calculated_price or amount (Medusa V2 returns amount in EUR)
      const price = option.calculated_price?.calculated_amount ?? option.amount ?? 0

      return {
        id: option.id,
        title: option.name,
        subtitle: option.type?.description || '',
        logo: logoMap[code] || null,
        price: price,
        estimatedDelivery: deliveryMap[code] || option.type?.description || '2-5 jours ouvrés',
        isRelayService: Boolean(isRelayService),
        relayApi: isRelayService ? {
          provider: option.data?.relayProvider || code,
        } : undefined,
        trackingUrl: undefined,
        features: [],
        postalCodeRestriction: null,
      }
    })

    return NextResponse.json({
      success: true,
      providers: transformedProviders,
      count: transformedProviders.length,
    })
  } catch (error) {
    console.error('[Medusa Shipping Options API Error]:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch shipping options',
        message: error instanceof Error ? error.message : 'Unknown error',
        providers: [],
      },
      { status: 500 }
    )
  }
}
