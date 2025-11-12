'use client'

import { useState, useEffect } from 'react'
import type { ShippingProvider } from '@/lib/types/checkout'

interface UseFilteredShippersResult {
  providers: ShippingProvider[]
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useFilteredShippers(
  country?: string,
  postalCode?: string,
  locale: string = 'fr'
): UseFilteredShippersResult {
  const [providers, setProviders] = useState<ShippingProvider[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchProviders = async () => {
    if (!country) {
      setProviders([])
      return
    }

    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams({
        country,
        locale,
      })

      if (postalCode) {
        params.append('postal_code', postalCode)
      }

      const response = await fetch(`/api/shipping-providers?${params.toString()}`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        setProviders(data.providers)
      } else {
        throw new Error(data.message || 'Failed to fetch shipping providers')
      }
    } catch (err) {
      console.error('Error fetching shipping providers:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
      setProviders([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProviders()
  }, [country, postalCode, locale])

  return {
    providers,
    loading,
    error,
    refetch: fetchProviders,
  }
}
