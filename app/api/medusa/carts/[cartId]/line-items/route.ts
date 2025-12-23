/**
 * Proxy API route for Medusa cart line items
 * POST /api/medusa/carts/[cartId]/line-items - Add item to cart
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
    const body = await request.json()

    const response = await fetch(`${MEDUSA_API_URL}/store/carts/${cartId}/line-items`, {
      method: 'POST',
      headers: getMedusaHeaders(),
      body: JSON.stringify(body),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: data.message || 'Failed to add item' },
        { status: response.status }
      )
    }

    return NextResponse.json({ success: true, cart: data.cart })
  } catch (error) {
    console.error('[API] Error adding item:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
