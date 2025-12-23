/**
 * Proxy API route for Medusa cart completion
 * POST /api/medusa/carts/[cartId]/complete - Complete the cart and create order
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

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ cartId: string }> }
) {
  try {
    const { cartId } = await params
    const body = await request.json().catch(() => ({}))

    const response = await fetch(`${MEDUSA_API_URL}/store/carts/${cartId}/complete`, {
      method: 'POST',
      headers: getMedusaHeaders(),
      body: JSON.stringify(body),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: data.message || 'Failed to complete cart' },
        { status: response.status }
      )
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('[API] Error completing cart:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
