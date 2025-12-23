/**
 * Proxy API route for Medusa cart operations
 * POST /api/medusa/carts - Create a new cart
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))

    const response = await fetch(`${MEDUSA_API_URL}/store/carts`, {
      method: 'POST',
      headers: getMedusaHeaders(),
      body: JSON.stringify(body),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: data.message || 'Failed to create cart' },
        { status: response.status }
      )
    }

    return NextResponse.json({ success: true, cart: data.cart })
  } catch (error) {
    console.error('[API] Error creating cart:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
