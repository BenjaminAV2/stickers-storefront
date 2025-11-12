/**
 * Medusa Client Configuration
 *
 * Client pour interagir avec l'API Medusa v2
 */

export interface MedusaConfig {
  apiUrl: string
  publishableKey?: string
}

export class MedusaClient {
  private apiUrl: string
  private publishableKey?: string

  constructor(config: MedusaConfig) {
    this.apiUrl = config.apiUrl
    this.publishableKey = config.publishableKey
  }

  /**
   * Effectue une requête GET vers l'API Medusa
   */
  async get<T>(endpoint: string): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }

    if (this.publishableKey) {
      headers['x-publishable-api-key'] = this.publishableKey
    }

    const response = await fetch(`${this.apiUrl}${endpoint}`, {
      method: 'GET',
      headers,
    })

    if (!response.ok) {
      throw new Error(`Medusa API error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  /**
   * Effectue une requête POST vers l'API Medusa
   */
  async post<T>(endpoint: string, data: unknown): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }

    if (this.publishableKey) {
      headers['x-publishable-api-key'] = this.publishableKey
    }

    const response = await fetch(`${this.apiUrl}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`Medusa API error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  /**
   * Récupère une commande par son ID
   */
  async getOrder(orderId: string) {
    return this.get(`/admin/orders/${orderId}`)
  }

  /**
   * Récupère toutes les commandes avec pagination
   */
  async getOrders(params?: {
    limit?: number
    offset?: number
    status?: string
  }) {
    const queryParams = new URLSearchParams()

    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.offset) queryParams.append('offset', params.offset.toString())
    if (params?.status) queryParams.append('status', params.status)

    const query = queryParams.toString()
    return this.get(`/admin/orders${query ? `?${query}` : ''}`)
  }

  /**
   * Checkout / Cart methods for storefront
   */
  async createCart(data?: unknown) {
    return this.post('/store/carts', data || {})
  }

  async updateCart(cartId: string, data: unknown) {
    return this.post(`/store/carts/${cartId}`, data)
  }

  async addShippingMethod(cartId: string, data: { option_id: string }) {
    return this.post(`/store/carts/${cartId}/shipping-methods`, data)
  }

  async createPaymentSessions(cartId: string) {
    return this.post(`/store/carts/${cartId}/payment-sessions`, {})
  }

  async setPaymentSession(cartId: string, data: { provider_id: string }) {
    return this.post(`/store/carts/${cartId}/payment-session`, data)
  }

  async completeCart(cartId: string) {
    return this.post(`/store/carts/${cartId}/complete`, {})
  }
}

// Instance singleton du client Medusa
let medusaClient: MedusaClient | null = null

/**
 * Récupère ou crée l'instance du client Medusa
 */
export function getMedusaClient(): MedusaClient {
  if (!medusaClient) {
    const apiUrl = process.env.MEDUSA_API_URL || process.env.NEXT_PUBLIC_MEDUSA_API_URL
    const publishableKey = process.env.MEDUSA_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

    if (!apiUrl) {
      throw new Error('MEDUSA_API_URL is not defined in environment variables')
    }

    medusaClient = new MedusaClient({
      apiUrl,
      publishableKey,
    })
  }

  return medusaClient
}
