/**
 * Proxy API route for Medusa cart operations
 * GET /api/medusa/carts/[cartId] - Get cart details
 * POST /api/medusa/carts/[cartId] - Update cart (address, email, etc.)
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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ cartId: string }> }
) {
  try {
    const { cartId } = await params

    const response = await fetch(`${MEDUSA_API_URL}/store/carts/${cartId}`, {
      headers: getMedusaHeaders(),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: data.message || 'Failed to fetch cart' },
        { status: response.status }
      )
    }

    return NextResponse.json({ success: true, cart: data.cart })
  } catch (error) {
    console.error('[API] Error fetching cart:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ cartId: string }> }
) {
  try {
    const { cartId } = await params
    const body = await request.json()

    const response = await fetch(`${MEDUSA_API_URL}/store/carts/${cartId}`, {
      method: 'POST',
      headers: getMedusaHeaders(),
      body: JSON.stringify(body),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: data.message || 'Failed to update cart' },
        { status: response.status }
      )
    }

    return NextResponse.json({ success: true, cart: data.cart })
  } catch (error) {
    console.error('[API] Error updating cart:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
