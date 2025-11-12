export interface ShippingProvider {
  id: string
  title: string
  subtitle?: string
  logo?: string | null
  price: number
  estimatedDelivery: string
  isRelayService: boolean
  relayApi?: {
    provider?: string
    apiKey?: string
    apiUrl?: string
  }
  trackingUrl?: string
  features?: string[]
  postalCodeRestriction?: string | null
}

export interface ShippingAddress {
  firstName: string
  lastName: string
  company?: string
  address1: string
  address2?: string
  city: string
  province?: string
  postalCode: string
  countryCode: string
  phone: string
  email: string
}

export interface RelayPoint {
  id: string
  name: string
  address: string
  city: string
  postalCode: string
  country: string
  latitude?: number
  longitude?: number
  openingHours?: string
  distance?: number
}

export interface CheckoutStep {
  id: 'address' | 'shipping' | 'payment' | 'confirmation'
  title: string
  completed: boolean
}

export interface CheckoutState {
  currentStep: number
  shippingAddress?: ShippingAddress
  selectedShippingProvider?: ShippingProvider
  selectedRelayPoint?: RelayPoint
  paymentMethod?: 'stripe' | 'paypal'
  cartId?: string
}

export type PaymentProvider = 'stripe' | 'paypal'
