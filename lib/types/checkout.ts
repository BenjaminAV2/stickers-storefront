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

export interface PromotionApplicationMethod {
  type: 'percentage' | 'fixed'
  target_type: 'order' | 'items' | 'shipping_methods'
  allocation?: 'each' | 'across'
  value: number
  currency_code?: string
}

export interface AppliedPromotion {
  id: string
  code?: string
  type?: string
  is_automatic?: boolean
  application_method?: PromotionApplicationMethod
}

/**
 * Calculate discount based on promotion and cart totals
 */
export function calculatePromoDiscount(
  promotion: AppliedPromotion,
  itemsTotal: number,
  shippingTotal: number = 0
): number {
  if (!promotion.application_method) return 0

  const { type, target_type, value } = promotion.application_method

  let targetAmount = 0
  switch (target_type) {
    case 'order':
      targetAmount = itemsTotal + shippingTotal
      break
    case 'items':
      targetAmount = itemsTotal
      break
    case 'shipping_methods':
      targetAmount = shippingTotal
      break
    default:
      targetAmount = itemsTotal
  }

  if (type === 'percentage') {
    return Math.round((targetAmount * value) / 100)
  } else if (type === 'fixed') {
    // Fixed amount is in base currency units (e.g., euros, not cents)
    // So we need to convert to cents
    return Math.min(value * 100, targetAmount)
  }

  return 0
}
