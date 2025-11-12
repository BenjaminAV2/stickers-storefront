'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ShoppingBag, Loader2 } from 'lucide-react'
import { CheckoutProvider, useCheckout } from '@/contexts/CheckoutContext'
import { ProgressBar } from '@/components/checkout/ProgressBar'
import { ShippingAddressForm } from '@/components/checkout/ShippingAddressForm'
import { ShippingMethodSelector } from '@/components/checkout/ShippingMethodSelector'
import { PaymentSelector } from '@/components/checkout/PaymentSelector'
import type { ShippingAddress, ShippingProvider, PaymentProvider } from '@/lib/types/checkout'

const STEPS = [
  { id: 'address', title: 'Adresse' },
  { id: 'shipping', title: 'Livraison' },
  { id: 'payment', title: 'Paiement' },
  { id: 'confirmation', title: 'Confirmation' },
]

function CheckoutContent() {
  const {
    state,
    setShippingAddress,
    setSelectedShippingProvider,
    setPaymentMethod,
    setCurrentStep,
    nextStep,
    previousStep,
  } = useCheckout()

  const router = useRouter()
  const [processing, setProcessing] = useState(false)

  // Step 1: Address
  const handleAddressSubmit = (address: ShippingAddress) => {
    setShippingAddress(address)
    nextStep()
  }

  // Step 2: Shipping
  const handleShippingSelect = (provider: ShippingProvider) => {
    setSelectedShippingProvider(provider)
    nextStep()
  }

  // Step 3: Payment
  const handlePaymentSelect = async (method: PaymentProvider) => {
    setPaymentMethod(method)
    setProcessing(true)

    try {
      // TODO: Integrate with Medusa payment flow
      // This is a placeholder for the actual payment integration
      console.log('Processing payment with:', {
        method,
        address: state.shippingAddress,
        shipping: state.selectedShippingProvider,
      })

      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Redirect to success page
      router.push('/checkout/success')
    } catch (error) {
      console.error('Payment error:', error)
      router.push('/checkout/failure')
    } finally {
      setProcessing(false)
    }
  }

  const renderStep = () => {
    switch (state.currentStep) {
      case 0:
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Adresse de livraison</h2>
            <ShippingAddressForm
              initialData={state.shippingAddress}
              onSubmit={handleAddressSubmit}
            />
          </div>
        )

      case 1:
        if (!state.shippingAddress) {
          setCurrentStep(0)
          return null
        }
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Mode de livraison</h2>
            <p className="text-gray-600 mb-6">
              Choisissez votre mode de livraison pour{' '}
              <span className="font-medium">
                {state.shippingAddress.postalCode} {state.shippingAddress.city}
              </span>
            </p>
            <ShippingMethodSelector
              countryCode={state.shippingAddress.countryCode}
              postalCode={state.shippingAddress.postalCode}
              selectedProvider={state.selectedShippingProvider}
              onSelect={handleShippingSelect}
              onBack={previousStep}
            />
          </div>
        )

      case 2:
        if (!state.shippingAddress || !state.selectedShippingProvider) {
          setCurrentStep(0)
          return null
        }
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Paiement</h2>
            <p className="text-gray-600 mb-6">Choisissez votre mode de paiement</p>
            <PaymentSelector
              selectedMethod={state.paymentMethod}
              onSelect={handlePaymentSelect}
              onBack={previousStep}
            />
          </div>
        )

      default:
        return null
    }
  }

  if (processing) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-12 h-12 text-[#5b40d7] animate-spin" />
        <h2 className="mt-6 text-2xl font-bold text-gray-900">Traitement du paiement...</h2>
        <p className="mt-2 text-gray-600">Veuillez patienter, ne fermez pas cette page</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#5b40d7] rounded-full mb-4">
            <ShoppingBag className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Finaliser ma commande</h1>
          <p className="mt-2 text-gray-600">Suivez les étapes pour compléter votre achat</p>
        </div>

        {/* Progress Bar */}
        <ProgressBar currentStep={state.currentStep} steps={STEPS} />

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mt-8">{renderStep()}</div>

        {/* Trust Badges */}
        <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-gray-600">
          <div className="flex items-center">
            <span className="mr-1">🔒</span>
            Paiement sécurisé
          </div>
          <div className="flex items-center">
            <span className="mr-1">📦</span>
            Livraison garantie
          </div>
          <div className="flex items-center">
            <span className="mr-1">↩️</span>
            Retour gratuit 14 jours
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <CheckoutProvider>
      <CheckoutContent />
    </CheckoutProvider>
  )
}
