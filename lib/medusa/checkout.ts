import type { ShippingAddress, PaymentProvider } from '@/lib/types/checkout'
import { getMedusaClient } from './client'

/**
 * Initialize a Medusa cart and checkout session
 */
export async function initializeCheckout() {
  const client = getMedusaClient()

  try {
    // Create a cart
    const { cart } = (await client.createCart()) as any

    return {
      cartId: cart.id,
      cart,
    }
  } catch (error) {
    console.error('[Medusa Checkout] Error initializing checkout:', error)
    throw error
  }
}

/**
 * Update cart shipping address
 */
export async function updateShippingAddress(cartId: string, address: ShippingAddress) {
  const client = getMedusaClient()

  try {
    const { cart } = (await client.updateCart(cartId, {
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
      email: address.email,
    })) as any

    return cart
  } catch (error) {
    console.error('[Medusa Checkout] Error updating shipping address:', error)
    throw error
  }
}

/**
 * Add shipping method to cart
 */
export async function addShippingMethod(cartId: string, shippingOptionId: string) {
  const client = getMedusaClient()

  try {
    const { cart } = (await client.addShippingMethod(cartId, {
      option_id: shippingOptionId,
    })) as any

    return cart
  } catch (error) {
    console.error('[Medusa Checkout] Error adding shipping method:', error)
    throw error
  }
}

/**
 * Initialize payment session
 */
export async function initializePaymentSessions(cartId: string) {
  const client = getMedusaClient()

  try {
    const { cart } = (await client.createPaymentSessions(cartId)) as any
    return cart
  } catch (error) {
    console.error('[Medusa Checkout] Error initializing payment sessions:', error)
    throw error
  }
}

/**
 * Select payment provider
 */
export async function selectPaymentProvider(cartId: string, providerId: PaymentProvider) {
  const client = getMedusaClient()

  try {
    const { cart } = (await client.setPaymentSession(cartId, {
      provider_id: providerId,
    })) as any

    return cart
  } catch (error) {
    console.error('[Medusa Checkout] Error selecting payment provider:', error)
    throw error
  }
}

/**
 * Complete cart checkout
 */
export async function completeCheckout(cartId: string) {
  const client = getMedusaClient()

  try {
    const { order } = (await client.completeCart(cartId)) as any
    return order
  } catch (error) {
    console.error('[Medusa Checkout] Error completing checkout:', error)
    throw error
  }
}

/**
 * Full checkout flow
 */
export async function processCheckout(params: {
  cartId?: string
  address: ShippingAddress
  shippingProviderId: string
  paymentProvider: PaymentProvider
}) {
  try {
    // Step 1: Initialize or use existing cart
    let cartId: string = params.cartId || ''
    if (!cartId) {
      const { cartId: newCartId } = await initializeCheckout()
      cartId = newCartId
    }

    // Step 2: Update shipping address
    await updateShippingAddress(cartId, params.address)

    // Step 3: Add shipping method
    // Note: You'll need to map your ShippingProvider ID to Medusa shipping option ID
    // This is a simplified example
    await addShippingMethod(cartId, params.shippingProviderId)

    // Step 4: Initialize payment sessions
    await initializePaymentSessions(cartId)

    // Step 5: Select payment provider
    await selectPaymentProvider(cartId, params.paymentProvider)

    // Step 6: Complete checkout
    const order = await completeCheckout(cartId)

    return {
      success: true,
      order,
    }
  } catch (error) {
    console.error('[Medusa Checkout] Error in checkout flow:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}
