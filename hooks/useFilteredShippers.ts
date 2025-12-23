'use client'

import { useState, useEffect, useCallback } from 'react'
import type { ShippingProvider } from '@/lib/types/checkout'

interface UseFilteredShippersResult {
  providers: ShippingProvider[]
  loading: boolean
  error: string | null
  refetch: () => void
}

/**
 * Hook to fetch shipping options from Medusa
 * Requires a cartId to get available shipping options for that cart
 */
export function useFilteredShippers(
  cartId?: string | null,
  country?: string,
  postalCode?: string,
  locale: string = 'fr'
): UseFilteredShippersResult {
  const [providers, setProviders] = useState<ShippingProvider[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchProviders = useCallback(async () => {
    // Need cartId to fetch shipping options from Medusa
    if (!cartId) {
      setProviders([])
      return
    }

    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams({
        cart_id: cartId,
      })

      const response = await fetch(`/api/medusa/shipping-options?${params.toString()}`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        setProviders(data.providers)
      } else {
        throw new Error(data.error || 'Failed to fetch shipping providers')
      }
    } catch (err) {
      console.error('Error fetching shipping providers:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
      setProviders([])
    } finally {
      setLoading(false)
    }
  }, [cartId])

  useEffect(() => {
    fetchProviders()
  }, [fetchProviders])

  return {
    providers,
    loading,
    error,
    refetch: fetchProviders,
  }
}
