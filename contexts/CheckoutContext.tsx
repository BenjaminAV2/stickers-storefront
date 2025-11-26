'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'
import type {
  CheckoutState,
  ShippingAddress,
  ShippingProvider,
  RelayPoint,
  PaymentProvider,
} from '@/lib/types/checkout'

interface CheckoutContextType {
  state: CheckoutState
  setShippingAddress: (address: ShippingAddress) => void
  setSelectedShippingProvider: (provider: ShippingProvider | undefined) => void
  setSelectedRelayPoint: (point: RelayPoint | undefined) => void
  setPaymentMethod: (method: PaymentProvider) => void
  setCurrentStep: (step: number) => void
  nextStep: () => void
  previousStep: () => void
  resetCheckout: () => void
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined)

const INITIAL_STATE: CheckoutState = {
  currentStep: 0,
}

export function CheckoutProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<CheckoutState>(INITIAL_STATE)

  const setShippingAddress = useCallback((address: ShippingAddress) => {
    setState((prev) => ({ ...prev, shippingAddress: address }))
  }, [])

  const setSelectedShippingProvider = useCallback((provider: ShippingProvider | undefined) => {
    setState((prev) => ({ ...prev, selectedShippingProvider: provider }))
  }, [])

  const setSelectedRelayPoint = useCallback((point: RelayPoint | undefined) => {
    setState((prev) => ({ ...prev, selectedRelayPoint: point }))
  }, [])

  const setPaymentMethod = useCallback((method: PaymentProvider) => {
    setState((prev) => ({ ...prev, paymentMethod: method }))
  }, [])

  const setCurrentStep = useCallback((step: number) => {
    setState((prev) => ({ ...prev, currentStep: step }))
  }, [])

  const nextStep = useCallback(() => {
    setState((prev) => ({ ...prev, currentStep: Math.min(prev.currentStep + 1, 3) }))
  }, [])

  const previousStep = useCallback(() => {
    setState((prev) => ({ ...prev, currentStep: Math.max(prev.currentStep - 1, 0) }))
  }, [])

  const resetCheckout = useCallback(() => {
    setState(INITIAL_STATE)
  }, [])

  return (
    <CheckoutContext.Provider
      value={{
        state,
        setShippingAddress,
        setSelectedShippingProvider,
        setSelectedRelayPoint,
        setPaymentMethod,
        setCurrentStep,
        nextStep,
        previousStep,
        resetCheckout,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  )
}

export function useCheckout() {
  const context = useContext(CheckoutContext)
  if (context === undefined) {
    throw new Error('useCheckout must be used within a CheckoutProvider')
  }
  return context
}
