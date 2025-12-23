'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { ShoppingBag, Loader2, Check, MapPin, Truck, CreditCard } from 'lucide-react'
import { CheckoutProvider, useCheckout } from '@/contexts/CheckoutContext'
import { OrderSummary } from '@/components/checkout/OrderSummary'
import { ShippingMethodSelector } from '@/components/checkout/ShippingMethodSelector'
import { PaymentSelector } from '@/components/checkout/PaymentSelector'
import { PromoCodeInput } from '@/components/checkout/PromoCodeInput'
import { useMedusaCart } from '@/hooks/useMedusaCart'
import type { ShippingAddress, ShippingProvider, PaymentProvider, AppliedPromotion } from '@/lib/types/checkout'

const PROGRESS_STEPS = [
  { id: 'address', title: 'Adresse', icon: MapPin },
  { id: 'shipping', title: 'Livraison', icon: Truck },
  { id: 'payment', title: 'Paiement', icon: CreditCard },
  { id: 'confirmation', title: 'Confirmation', icon: Check },
]

const COUNTRIES = [
  { code: 'FR', name: 'France' },
  { code: 'BE', name: 'Belgique' },
  { code: 'CH', name: 'Suisse' },
  { code: 'LU', name: 'Luxembourg' },
  { code: 'DE', name: 'Allemagne' },
  { code: 'ES', name: 'Espagne' },
  { code: 'IT', name: 'Italie' },
  { code: 'NL', name: 'Pays-Bas' },
  { code: 'PT', name: 'Portugal' },
  { code: 'GB', name: 'Royaume-Uni' },
]

function CheckoutContent() {
  const {
    state,
    setShippingAddress,
    setSelectedShippingProvider,
    setPaymentMethod,
  } = useCheckout()

  const router = useRouter()
  const [processing, setProcessing] = useState(false)
  const [cartReady, setCartReady] = useState(false)
  const [addressSynced, setAddressSynced] = useState(false)
  const [appliedPromotions, setAppliedPromotions] = useState<AppliedPromotion[]>([])

  // Medusa cart management
  const {
    cart,
    cartId,
    loading: cartLoading,
    error: cartError,
    createCart,
    updateShippingAddress: updateMedusaAddress,
    addShippingMethod,
    initializePayment,
    completeCart,
    updateCartState,
  } = useMedusaCart()

  // Form data
  const [formData, setFormData] = useState<ShippingAddress>({
    firstName: '',
    lastName: '',
    company: '',
    address1: '',
    address2: '',
    city: '',
    province: '',
    postalCode: '',
    countryCode: 'FR',
    phone: '',
    email: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Refs for sections
  const addressRef = useRef<HTMLDivElement>(null)
  const shippingRef = useRef<HTMLDivElement>(null)
  const paymentRef = useRef<HTMLDivElement>(null)

  // Initialize cart on mount
  useEffect(() => {
    const initCart = async () => {
      if (!cartId) {
        await createCart()
      }
      setCartReady(true)
    }
    initCart()
  }, [cartId, createCart])

  // Check if address is complete
  const isAddressComplete = () => {
    return (
      formData.email.trim() !== '' &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
      formData.firstName.trim() !== '' &&
      formData.lastName.trim() !== '' &&
      formData.address1.trim() !== '' &&
      formData.city.trim() !== '' &&
      formData.postalCode.trim() !== '' &&
      formData.phone.trim() !== ''
    )
  }

  // Update Medusa cart when address is complete
  const syncAddressToCart = useCallback(async () => {
    if (isAddressComplete() && cartId) {
      await updateMedusaAddress(formData)
    }
  }, [formData, cartId, updateMedusaAddress])

  // Calculate current progress based on completion
  const getCurrentSection = () => {
    if (state.paymentMethod) return 2
    if (state.selectedShippingProvider) return 1
    if (isAddressComplete()) return 0 // Address complete but no shipping yet
    return 0
  }

  // Check if line between steps should be colored
  const isLineComplete = (stepIndex: number) => {
    if (stepIndex === 0) return isAddressComplete() // Line after Address
    if (stepIndex === 1) return state.selectedShippingProvider !== undefined // Line after Shipping
    if (stepIndex === 2) return state.paymentMethod !== undefined // Line after Payment
    return false
  }

  const currentSection = getCurrentSection()

  // Error states
  const [shippingError, setShippingError] = useState(false)

  const validateAddress = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.email.trim()) newErrors.email = 'Email requis'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = 'Email invalide'
    if (!formData.firstName.trim()) newErrors.firstName = 'Prénom requis'
    if (!formData.lastName.trim()) newErrors.lastName = 'Nom requis'
    if (!formData.address1.trim()) newErrors.address1 = 'Adresse requise'
    if (!formData.city.trim()) newErrors.city = 'Ville requise'
    if (!formData.postalCode.trim()) newErrors.postalCode = 'Code postal requis'
    if (!formData.phone.trim()) newErrors.phone = 'Téléphone requis'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    const newFormData = { ...formData, [name]: value }
    setFormData(newFormData)
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }

    // Auto-save to context
    setShippingAddress(newFormData)

    // Reset shipping selection when address changes (excluding optional fields)
    const addressFields = ['email', 'firstName', 'lastName', 'address1', 'city', 'postalCode', 'countryCode', 'phone']
    if (addressFields.includes(name) && state.selectedShippingProvider) {
      setSelectedShippingProvider(undefined)
    }
  }

  // Debounced sync to Medusa when address is complete
  const addressSyncTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  useEffect(() => {
    if (addressSyncTimeoutRef.current) {
      clearTimeout(addressSyncTimeoutRef.current)
    }
    if (isAddressComplete() && cartId) {
      addressSyncTimeoutRef.current = setTimeout(async () => {
        const result = await updateMedusaAddress(formData)
        if (result) {
          setAddressSynced(true)
        }
      }, 500)
    } else {
      setAddressSynced(false)
    }
    return () => {
      if (addressSyncTimeoutRef.current) {
        clearTimeout(addressSyncTimeoutRef.current)
      }
    }
  }, [formData, cartId])

  const handleShippingSelect = async (provider: ShippingProvider) => {
    setSelectedShippingProvider(provider)

    // Add shipping method to Medusa cart
    if (cartId) {
      await addShippingMethod(provider.id)
    }

    // Scroll to payment section
    paymentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handlePaymentSubmit = async (method: PaymentProvider) => {
    // Reset errors
    setShippingError(false)

    if (!validateAddress()) {
      addressRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }

    if (!state.selectedShippingProvider) {
      setShippingError(true)
      shippingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }

    if (!cartId) {
      console.error('No cart ID found')
      return
    }

    setPaymentMethod(method)
    setProcessing(true)

    try {
      console.log('Processing payment with Medusa:', {
        method,
        cartId,
        address: formData,
        shipping: state.selectedShippingProvider,
      })

      // Initialize payment sessions in Medusa
      await initializePayment()

      // For now, complete the cart (in production, you'd integrate Stripe here)
      // TODO: Integrate actual Stripe payment flow
      const result = await completeCart()

      if (result && result.type === 'order') {
        // Order created successfully
        router.push(`/checkout/success?order_id=${result.order.id}`)
      } else {
        throw new Error('Failed to complete order')
      }
    } catch (error) {
      console.error('Payment error:', error)
      router.push('/checkout/failure')
    } finally {
      setProcessing(false)
    }
  }

  const handleShippingSelectWithErrorClear = (provider: ShippingProvider) => {
    setShippingError(false)
    handleShippingSelect(provider)
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
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="flex items-center justify-center w-12 h-12 bg-[#5b40d7] rounded-full">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Finaliser ma commande</h1>
          </div>
          <p className="text-center text-sm sm:text-base text-gray-600">
            Suivez les étapes pour compléter votre achat
          </p>
        </div>

        {/* Progress Indicator - Sticky - Mobile only full width */}
        <div className="lg:hidden sticky top-16 z-40 bg-white rounded-2xl py-4 mb-6 shadow-lg">
          <div className="flex items-center justify-start gap-2 sm:gap-4 ml-2">
            {PROGRESS_STEPS.map((step, index) => {
              const Icon = step.icon
              const isActive = index <= currentSection
              const isCompleted = index < currentSection

              return (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all ${
                        isActive ? 'bg-[#5b40d7] text-white' : 'bg-gray-200 text-gray-400'
                      }`}
                    >
                      {isCompleted ? <Check className="w-4 h-4 sm:w-5 sm:h-5" /> : <Icon className="w-4 h-4 sm:w-5 sm:h-5" />}
                    </div>
                    <span
                      className={`mt-1 text-[10px] sm:text-xs font-medium ${
                        isActive ? 'text-gray-900' : 'text-gray-400'
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                  {index < PROGRESS_STEPS.length - 1 && (
                    <div className="w-6 sm:w-12 h-1 mx-1 sm:mx-2 bg-gray-200 rounded">
                      <div
                        className={`h-full transition-all rounded ${
                          isLineComplete(index) ? 'bg-[#5b40d7]' : 'bg-gray-200'
                        }`}
                        style={{ width: isLineComplete(index) ? '100%' : '0%' }}
                      />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Main Content - 2 columns on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Indicator - Sticky - Desktop only */}
            <div className="hidden lg:block sticky top-16 md:top-20 z-40 bg-white rounded-2xl py-4 shadow-lg">
              <div className="flex items-center justify-start gap-2 sm:gap-4 px-6">
                {PROGRESS_STEPS.map((step, index) => {
                  const Icon = step.icon
                  const isActive = index <= currentSection
                  const isCompleted = index < currentSection

                  return (
                    <div key={step.id} className="flex items-center">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                            isActive ? 'bg-[#5b40d7] text-white' : 'bg-gray-200 text-gray-400'
                          }`}
                        >
                          {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                        </div>
                        <span
                          className={`mt-1 text-xs font-medium ${
                            isActive ? 'text-gray-900' : 'text-gray-400'
                          }`}
                        >
                          {step.title}
                        </span>
                      </div>
                      {index < PROGRESS_STEPS.length - 1 && (
                        <div className="w-12 md:w-16 h-1 mx-2 bg-gray-200 rounded">
                          <div
                            className={`h-full transition-all rounded ${
                              isLineComplete(index) ? 'bg-[#5b40d7]' : 'bg-gray-200'
                            }`}
                            style={{ width: isLineComplete(index) ? '100%' : '0%' }}
                          />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
            {/* Address Section */}
            <div ref={addressRef} className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">1. Informations personnelles</h2>

              {/* Email first */}
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border transition-all ${
                    errors.email
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-[#5b40d7] focus:border-[#5b40d7]'
                  } focus:outline-none focus:ring-2`}
                />
                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
              </div>

              {/* Rest of address form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    Prénom <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border transition-all ${
                      errors.firstName
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-[#5b40d7] focus:border-[#5b40d7]'
                    } focus:outline-none focus:ring-2`}
                  />
                  {errors.firstName && <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>}
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Nom <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border transition-all ${
                      errors.lastName
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-[#5b40d7] focus:border-[#5b40d7]'
                    } focus:outline-none focus:ring-2`}
                  />
                  {errors.lastName && <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>}
                </div>
              </div>

              <div className="mt-4">
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                  Société (optionnel)
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#5b40d7] focus:border-[#5b40d7] focus:outline-none transition-all"
                />
              </div>

              <div className="mt-4">
                <label htmlFor="address1" className="block text-sm font-medium text-gray-700 mb-1">
                  Adresse <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="address1"
                  name="address1"
                  value={formData.address1}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border transition-all ${
                    errors.address1
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-[#5b40d7] focus:border-[#5b40d7]'
                  } focus:outline-none focus:ring-2`}
                />
                {errors.address1 && <p className="mt-1 text-sm text-red-500">{errors.address1}</p>}
              </div>

              <div className="mt-4">
                <label htmlFor="address2" className="block text-sm font-medium text-gray-700 mb-1">
                  Complément d'adresse (optionnel)
                </label>
                <input
                  type="text"
                  id="address2"
                  name="address2"
                  value={formData.address2}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#5b40d7] focus:border-[#5b40d7] focus:outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div>
                  <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                    Code postal <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border transition-all ${
                      errors.postalCode
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-[#5b40d7] focus:border-[#5b40d7]'
                    } focus:outline-none focus:ring-2`}
                  />
                  {errors.postalCode && <p className="mt-1 text-sm text-red-500">{errors.postalCode}</p>}
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                    Ville <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border transition-all ${
                      errors.city
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-[#5b40d7] focus:border-[#5b40d7]'
                    } focus:outline-none focus:ring-2`}
                  />
                  {errors.city && <p className="mt-1 text-sm text-red-500">{errors.city}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label htmlFor="province" className="block text-sm font-medium text-gray-700 mb-1">
                    Région / État (optionnel)
                  </label>
                  <input
                    type="text"
                    id="province"
                    name="province"
                    value={formData.province}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#5b40d7] focus:border-[#5b40d7] focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="countryCode" className="block text-sm font-medium text-gray-700 mb-1">
                    Pays <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="countryCode"
                    name="countryCode"
                    value={formData.countryCode}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#5b40d7] focus:border-[#5b40d7] focus:outline-none transition-all"
                  >
                    {COUNTRIES.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Téléphone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border transition-all ${
                    errors.phone
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-[#5b40d7] focus:border-[#5b40d7]'
                  } focus:outline-none focus:ring-2`}
                />
                {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
              </div>
            </div>

            {/* Shipping Section */}
            <div ref={shippingRef} className={`bg-white rounded-2xl shadow-lg p-6 transition-all ${
              shippingError ? 'ring-4 ring-red-500' : ''
            }`}>
              <h2 className="text-xl font-bold text-gray-900 mb-4">2. Mode de livraison</h2>
              {shippingError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 text-sm font-medium">
                    Veuillez sélectionner un mode de livraison pour continuer
                  </p>
                </div>
              )}
              <ShippingMethodSelector
                cartId={addressSynced ? cartId : null}
                countryCode={formData.countryCode}
                postalCode={formData.postalCode}
                selectedProvider={state.selectedShippingProvider}
                onSelect={handleShippingSelectWithErrorClear}
              />
            </div>

            {/* Payment Section */}
            <div ref={paymentRef} className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">3. Paiement</h2>

              {/* Promo Code Input - Above payment methods */}
              <div className="mb-6">
                <PromoCodeInput
                  appliedPromotions={appliedPromotions}
                  onPromoApplied={(promotion) => {
                    setAppliedPromotions((prev) => [...prev, promotion])
                  }}
                  onPromoRemoved={(promoId) => {
                    setAppliedPromotions((prev) => prev.filter((p) => p.id !== promoId))
                  }}
                />
              </div>

              <PaymentSelector
                selectedMethod={state.paymentMethod}
                onSelect={handlePaymentSubmit}
              />
            </div>

            {/* Order Summary - Mobile only */}
            <div className="lg:hidden">
              <OrderSummary
                selectedShipping={state.selectedShippingProvider}
                appliedPromotions={appliedPromotions}
              />
            </div>
          </div>

          {/* Right column - Order Summary (Desktop only) */}
          <div className="hidden lg:block">
            <OrderSummary
              selectedShipping={state.selectedShippingProvider}
              appliedPromotions={appliedPromotions}
            />
          </div>
        </div>

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
