/**
 * Payload CMS API Client for Next.js Frontend
 *
 * Usage:
 * - Fetch pages, pricing settings, and orders from Payload CMS
 * - Supports multi-language queries
 */

const CMS_API_URL = process.env.NEXT_PUBLIC_CMS_API_URL || 'http://localhost:3001/api'

export interface Page {
  id: string
  title: string
  slug: string
  content: any // Rich text content
  seoTitle?: string
  seoDescription?: string
  ogImage?: {
    url: string
    alt: string
  }
  published: boolean
  createdAt: string
  updatedAt: string
}

export interface PricingConfig {
  id: string
  name: string
  baseEurPerCm2: number
  shapeMultipliers: Record<string, number>
  supportMultipliers: Record<string, number>
  quantityDiscounts: Record<string, number>
  active: boolean
}

export interface Order {
  id: string
  orderId: string
  customerEmail: string
  customerName?: string
  items: Array<{
    productId: string
    productTitle: string
    variantId: string
    quantity: number
    unitPriceCents: number
    totalPriceCents: number
    metadata?: any
  }>
  subtotalCents: number
  shippingCents?: number
  taxCents?: number
  totalCents: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  synced: boolean
  shippingAddress?: any
  createdAt: string
}

interface FetchOptions {
  locale?: 'fr' | 'en' | 'es' | 'it' | 'de'
  draft?: boolean
  depth?: number
}

/**
 * Fetch all published pages
 */
export async function getPages(options: FetchOptions = {}): Promise<Page[]> {
  const { locale = 'fr', draft = false, depth = 1 } = options

  const params = new URLSearchParams({
    locale,
    depth: depth.toString(),
    limit: '100',
    where: JSON.stringify({
      published: { equals: true },
    }),
  })

  if (draft) {
    params.append('draft', 'true')
  }

  const res = await fetch(`${CMS_API_URL}/pages?${params}`, {
    next: { revalidate: 60 }, // Revalidate every 60 seconds
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch pages: ${res.statusText}`)
  }

  const data = await res.json()
  return data.docs
}

/**
 * Fetch a single page by slug
 */
export async function getPageBySlug(
  slug: string,
  options: FetchOptions = {}
): Promise<Page | null> {
  const { locale = 'fr', draft = false, depth = 1 } = options

  const params = new URLSearchParams({
    locale,
    depth: depth.toString(),
    limit: '1',
    where: JSON.stringify({
      slug: { equals: slug },
      published: { equals: true },
    }),
  })

  if (draft) {
    params.append('draft', 'true')
  }

  const res = await fetch(`${CMS_API_URL}/pages?${params}`, {
    next: { revalidate: 60 },
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch page: ${res.statusText}`)
  }

  const data = await res.json()
  return data.docs[0] || null
}

/**
 * Fetch active pricing configuration
 */
export async function getActivePricingConfig(): Promise<PricingConfig | null> {
  const params = new URLSearchParams({
    limit: '1',
    where: JSON.stringify({
      active: { equals: true },
    }),
  })

  const res = await fetch(`${CMS_API_URL}/pricing-settings?${params}`, {
    next: { revalidate: 300 }, // Revalidate every 5 minutes
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch pricing config: ${res.statusText}`)
  }

  const data = await res.json()
  return data.docs[0] || null
}

/**
 * Fetch all pricing configurations
 */
export async function getAllPricingConfigs(): Promise<PricingConfig[]> {
  const res = await fetch(`${CMS_API_URL}/pricing-settings?limit=100`, {
    next: { revalidate: 300 },
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch pricing configs: ${res.statusText}`)
  }

  const data = await res.json()
  return data.docs
}

/**
 * Create a new order in CMS (admin only, requires auth)
 */
export async function createOrder(orderData: Partial<Order>, token?: string): Promise<Order> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }

  if (token) {
    headers['Authorization'] = `JWT ${token}`
  }

  const res = await fetch(`${CMS_API_URL}/orders`, {
    method: 'POST',
    headers,
    body: JSON.stringify(orderData),
  })

  if (!res.ok) {
    throw new Error(`Failed to create order: ${res.statusText}`)
  }

  return await res.json()
}

/**
 * Fetch orders (admin only, requires auth)
 */
export async function getOrders(token: string, limit = 50): Promise<Order[]> {
  const res = await fetch(`${CMS_API_URL}/orders?limit=${limit}`, {
    headers: {
      Authorization: `JWT ${token}`,
    },
    next: { revalidate: 0 }, // Don't cache orders
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch orders: ${res.statusText}`)
  }

  const data = await res.json()
  return data.docs
}

/**
 * Health check for CMS API
 */
export async function checkCMSHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${CMS_API_URL.replace('/api', '')}/health`, {
      next: { revalidate: 10 },
    })
    return res.ok
  } catch {
    return false
  }
}
