'use client'

import { useState, useCallback, useEffect } from 'react'
import type { ShippingAddress, AppliedPromotion } from '@/lib/types/checkout'

// Use local proxy API to avoid CORS issues
const API_BASE = '/api/medusa'

interface MedusaCart {
  id: string
  email?: string
  shipping_address?: any
  billing_address?: any
  items?: any[]
  shipping_methods?: any[]
  payment_collection?: any
  total?: number
  subtotal?: number
  shipping_total?: number
  tax_total?: number
  discount_total?: number
  region_id?: string
  promotions?: AppliedPromotion[]
}

interface UseMedusaCartResult {
  cart: MedusaCart | null
  cartId: string | null
  loading: boolean
  error: string | null
  createCart: (regionId?: string) => Promise<MedusaCart | null>
  updateShippingAddress: (address: ShippingAddress) => Promise<MedusaCart | null>
  addShippingMethod: (optionId: string) => Promise<MedusaCart | null>
  addItem: (variantId: string, quantity: number) => Promise<MedusaCart | null>
  initializePayment: () => Promise<MedusaCart | null>
  completeCart: () => Promise<any>
  applyPromoCode: (code: string) => Promise<MedusaCart | null>
  removePromoCode: (code: string) => Promise<MedusaCart | null>
  updateCartState: (cart: MedusaCart) => void
}

const CART_STORAGE_KEY = 'medusa_cart_id'

export function useMedusaCart(): UseMedusaCartResult {
  const [cart, setCart] = useState<MedusaCart | null>(null)
  const [cartId, setCartId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load cart from localStorage on mount
  useEffect(() => {
    const storedCartId = localStorage.getItem(CART_STORAGE_KEY)
    if (storedCartId) {
      setCartId(storedCartId)
      // Optionally fetch cart details
      fetchCart(storedCartId)
    }
  }, [])

  const fetchCart = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE}/carts/${id}`)
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setCart(data.cart)
          return data.cart
        }
      }
    } catch (err) {
      console.error('Error fetching cart:', err)
    }
    return null
  }

  const createCart = useCallback(async (regionId?: string): Promise<MedusaCart | null> => {
    setLoading(true)
    setError(null)

    try {
      const body: any = {}
      if (regionId) {
        body.region_id = regionId
      }

      const response = await fetch(`${API_BASE}/carts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to create cart')
      }

      const newCart = data.cart

      setCart(newCart)
      setCartId(newCart.id)
      localStorage.setItem(CART_STORAGE_KEY, newCart.id)

      return newCart
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create cart'
      setError(message)
      console.error('Error creating cart:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const updateShippingAddress = useCallback(async (address: ShippingAddress): Promise<MedusaCart | null> => {
    if (!cartId) {
      setError('No cart found')
      return null
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`${API_BASE}/carts/${cartId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: address.email,
          shipping_address: {
            first_name: address.firstName,
            last_name: address.lastName,
            company: address.company || '',
            address_1: address.address1,
            address_2: address.address2 || '',
            city: address.city,
            province: address.province || '',
            postal_code: address.postalCode,
            country_code: address.countryCode.toLowerCase(),
            phone: address.phone,
          },
          billing_address: {
            first_name: address.firstName,
            last_name: address.lastName,
            company: address.company || '',
            address_1: address.address1,
            address_2: address.address2 || '',
            city: address.city,
            province: address.province || '',
            postal_code: address.postalCode,
            country_code: address.countryCode.toLowerCase(),
            phone: address.phone,
          },
        }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to update shipping address')
      }

      setCart(data.cart)
      return data.cart
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update address'
      setError(message)
      console.error('Error updating shipping address:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [cartId])

  const addShippingMethod = useCallback(async (optionId: string): Promise<MedusaCart | null> => {
    if (!cartId) {
      setError('No cart found')
      return null
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`${API_BASE}/carts/${cartId}/shipping-methods`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          option_id: optionId,
        }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to add shipping method')
      }

      setCart(data.cart)
      return data.cart
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add shipping method'
      setError(message)
      console.error('Error adding shipping method:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [cartId])

  const addItem = useCallback(async (variantId: string, quantity: number): Promise<MedusaCart | null> => {
    if (!cartId) {
      setError('No cart found')
      return null
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`${API_BASE}/carts/${cartId}/line-items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          variant_id: variantId,
          quantity,
        }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to add item')
      }

      setCart(data.cart)
      return data.cart
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add item'
      setError(message)
      console.error('Error adding item:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [cartId])

  const initializePayment = useCallback(async (): Promise<MedusaCart | null> => {
    if (!cartId) {
      setError('No cart found')
      return null
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`${API_BASE}/carts/${cartId}/payment-sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to initialize payment')
      }

      setCart(data.cart)
      return data.cart
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to initialize payment'
      setError(message)
      console.error('Error initializing payment:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [cartId])

  const completeCart = useCallback(async (): Promise<any> => {
    if (!cartId) {
      setError('No cart found')
      return null
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`${API_BASE}/carts/${cartId}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to complete cart')
      }

      // Clear cart from storage after completion
      localStorage.removeItem(CART_STORAGE_KEY)
      setCart(null)
      setCartId(null)

      return data.data
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to complete cart'
      setError(message)
      console.error('Error completing cart:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [cartId])

  const applyPromoCode = useCallback(async (code: string): Promise<MedusaCart | null> => {
    if (!cartId) {
      setError('No cart found')
      return null
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`${API_BASE}/carts/${cartId}/promotions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          promo_codes: [code.toUpperCase()],
        }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to apply promo code')
      }

      setCart(data.cart)
      return data.cart
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to apply promo code'
      setError(message)
      console.error('Error applying promo code:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [cartId])

  const removePromoCode = useCallback(async (code: string): Promise<MedusaCart | null> => {
    if (!cartId) {
      setError('No cart found')
      return null
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`${API_BASE}/carts/${cartId}/promotions`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          promo_codes: [code],
        }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to remove promo code')
      }

      setCart(data.cart)
      return data.cart
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to remove promo code'
      setError(message)
      console.error('Error removing promo code:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [cartId])

  const updateCartState = useCallback((newCart: MedusaCart) => {
    setCart(newCart)
  }, [])

  return {
    cart,
    cartId,
    loading,
    error,
    createCart,
    updateShippingAddress,
    addShippingMethod,
    addItem,
    initializePayment,
    completeCart,
    applyPromoCode,
    removePromoCode,
    updateCartState,
  }
}
