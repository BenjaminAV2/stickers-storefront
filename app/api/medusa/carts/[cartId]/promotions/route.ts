/**
 * Proxy API route for Medusa cart promotions
 * POST /api/medusa/carts/[cartId]/promotions - Add promo code to cart
 * DELETE /api/medusa/carts/[cartId]/promotions - Remove promo code from cart
 */

import { NextRequest, NextResponse } from 'next/server'

const MEDUSA_API_URL = process.env.NEXT_PUBLIC_MEDUSA_API_URL || 'https://backend-production-f3de.up.railway.app'
const MEDUSA_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

function getMedusaHeaders(): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }
  if (MEDUSA_PUBLISHABLE_KEY) {
    headers['x-publishable-api-key'] = MEDUSA_PUBLISHABLE_KEY
  }
  return headers
}

// Add promo code to cart
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ cartId: string }> }
) {
  try {
    const { cartId } = await params
    const body = await request.json()

    // Validate promo_codes array
    if (!body.promo_codes || !Array.isArray(body.promo_codes) || body.promo_codes.length === 0) {
      return NextResponse.json(
        { success: false, error: 'promo_codes array is required' },
        { status: 400 }
      )
    }

    const response = await fetch(`${MEDUSA_API_URL}/store/carts/${cartId}/promotions`, {
      method: 'POST',
      headers: getMedusaHeaders(),
      body: JSON.stringify({
        promo_codes: body.promo_codes,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      // Handle specific error messages from Medusa
      const errorMessage = data.message || data.error || 'Code promo invalide ou expiré'
      return NextResponse.json(
        { success: false, error: errorMessage },
        { status: response.status }
      )
    }

    return NextResponse.json({ success: true, cart: data.cart })
  } catch (error) {
    console.error('[API] Error adding promo code:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur lors de l\'application du code promo' },
      { status: 500 }
    )
  }
}

// Remove promo code from cart
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ cartId: string }> }
) {
  try {
    const { cartId } = await params
    const body = await request.json()

    // Validate promo_codes array
    if (!body.promo_codes || !Array.isArray(body.promo_codes) || body.promo_codes.length === 0) {
      return NextResponse.json(
        { success: false, error: 'promo_codes array is required' },
        { status: 400 }
      )
    }

    const response = await fetch(`${MEDUSA_API_URL}/store/carts/${cartId}/promotions`, {
      method: 'DELETE',
      headers: getMedusaHeaders(),
      body: JSON.stringify({
        promo_codes: body.promo_codes,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: data.message || 'Failed to remove promo code' },
        { status: response.status }
      )
    }

    return NextResponse.json({ success: true, cart: data.cart })
  } catch (error) {
    console.error('[API] Error removing promo code:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la suppression du code promo' },
      { status: 500 }
    )
  }
}
