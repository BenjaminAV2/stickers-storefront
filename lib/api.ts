import { Product, ProductCategory, Cart, CartLineItem } from './types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000'

// Cache for publishable API key
let publishableApiKey: string | null = null

// Fetch publishable API key from backend
async function getPublishableApiKey(): Promise<string> {
  if (publishableApiKey) {
    return publishableApiKey
  }

  try {
    const response = await fetch(`${API_URL}/publishable-key`, {
      cache: 'force-cache', // Cache the key
    })

    if (!response.ok) {
      throw new Error('Failed to fetch publishable API key')
    }

    const data = await response.json()
    publishableApiKey = data.publishable_key
    return publishableApiKey
  } catch (error) {
    console.error('Error fetching publishable API key:', error)
    throw error
  }
}

// Produits
export async function getProducts(params?: {
  limit?: number
  offset?: number
  handle?: string
  category_id?: string
}): Promise<{ products: Product[]; count: number }> {
  const queryParams = new URLSearchParams()

  if (params?.limit) queryParams.append('limit', params.limit.toString())
  if (params?.offset) queryParams.append('offset', params.offset.toString())
  if (params?.handle) queryParams.append('handle', params.handle)
  if (params?.category_id) queryParams.append('category_id', params.category_id)

  const url = `${API_URL}/store/products${queryParams.toString() ? `?${queryParams}` : ''}`

  const apiKey = await getPublishableApiKey()

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-publishable-api-key': apiKey,
    },
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.statusText}`)
  }

  return response.json()
}

export async function getProduct(id: string): Promise<{ product: Product }> {
  const apiKey = await getPublishableApiKey()

  const response = await fetch(`${API_URL}/store/products/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-publishable-api-key': apiKey,
    },
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch product: ${response.statusText}`)
  }

  return response.json()
}

// Catégories
export async function getCategories(params?: {
  limit?: number
  offset?: number
  handle?: string
  parent_category_id?: string
}): Promise<{ categories: ProductCategory[]; count: number }> {
  const queryParams = new URLSearchParams()

  if (params?.limit) queryParams.append('limit', params.limit.toString())
  if (params?.offset) queryParams.append('offset', params.offset.toString())
  if (params?.handle) queryParams.append('handle', params.handle)
  if (params?.parent_category_id) queryParams.append('parent_category_id', params.parent_category_id)

  const url = `${API_URL}/store/categories${queryParams.toString() ? `?${queryParams}` : ''}`

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch categories: ${response.statusText}`)
  }

  return response.json()
}

export async function getCategoryProducts(
  categoryId: string,
  params?: { limit?: number; offset?: number }
): Promise<{ category: ProductCategory; products: Product[]; count: number }> {
  const queryParams = new URLSearchParams()

  if (params?.limit) queryParams.append('limit', params.limit.toString())
  if (params?.offset) queryParams.append('offset', params.offset.toString())

  const url = `${API_URL}/store/categories/${categoryId}/products${queryParams.toString() ? `?${queryParams}` : ''}`

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch category products: ${response.statusText}`)
  }

  return response.json()
}

// Panier
export async function createCart(data: {
  region_id: string
  email?: string
  currency_code?: string
}): Promise<{ cart: Cart }> {
  const response = await fetch(`${API_URL}/store/cart`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error(`Failed to create cart: ${response.statusText}`)
  }

  return response.json()
}

export async function getCart(cartId: string): Promise<{ cart: Cart }> {
  const response = await fetch(`${API_URL}/store/cart?id=${cartId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch cart: ${response.statusText}`)
  }

  return response.json()
}

export async function addToCart(data: {
  cart_id: string
  variant_id: string
  quantity: number
  metadata?: Record<string, any>
}): Promise<{ cart: Cart; message: string }> {
  const response = await fetch(`${API_URL}/store/cart/line-items`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error(`Failed to add item to cart: ${response.statusText}`)
  }

  return response.json()
}

export async function updateCartItem(
  itemId: string,
  data: {
    cart_id: string
    quantity: number
    metadata?: Record<string, any>
  }
): Promise<{ cart: Cart; message: string }> {
  const response = await fetch(`${API_URL}/store/cart/line-items/${itemId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error(`Failed to update cart item: ${response.statusText}`)
  }

  return response.json()
}

export async function removeFromCart(
  itemId: string,
  cartId: string
): Promise<{ id: string; deleted: boolean; message: string }> {
  const response = await fetch(`${API_URL}/store/cart/line-items/${itemId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ cart_id: cartId }),
  })

  if (!response.ok) {
    throw new Error(`Failed to remove item from cart: ${response.statusText}`)
  }

  return response.json()
}
