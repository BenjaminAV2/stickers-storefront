/**
 * API route to validate a promo code and return promotion details
 * POST /api/medusa/promotions/validate
 */

import { NextRequest, NextResponse } from 'next/server'

const MEDUSA_API_URL = process.env.NEXT_PUBLIC_MEDUSA_API_URL || 'https://backend-production-f3de.up.railway.app'
const MEDUSA_ADMIN_EMAIL = process.env.MEDUSA_ADMIN_EMAIL || 'admin@yourmail.com'
const MEDUSA_ADMIN_PASSWORD = process.env.MEDUSA_ADMIN_PASSWORD || ''

interface PromotionData {
  id: string
  code: string
  type: string
  is_automatic: boolean
  application_method: {
    type: 'percentage' | 'fixed'
    target_type: 'order' | 'items' | 'shipping_methods'
    allocation: string
    value: number
    currency_code?: string
  }
}

// Cache admin token
let adminToken: string | null = null
let tokenExpiry: number = 0

async function getAdminToken(): Promise<string | null> {
  // Return cached token if still valid
  if (adminToken && Date.now() < tokenExpiry) {
    return adminToken
  }

  try {
    const response = await fetch(`${MEDUSA_API_URL}/auth/user/emailpass`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: MEDUSA_ADMIN_EMAIL,
        password: MEDUSA_ADMIN_PASSWORD,
      }),
    })

    if (!response.ok) {
      console.error('[API] Admin auth failed:', response.status)
      return null
    }

    const data = await response.json()
    adminToken = data.token
    // Token valid for 1 hour
    tokenExpiry = Date.now() + 55 * 60 * 1000
    return adminToken
  } catch (error) {
    console.error('[API] Error getting admin token:', error)
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { code } = body

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Code promo requis' },
        { status: 400 }
      )
    }

    const promoCode = code.trim().toUpperCase()

    // Get admin token to fetch promotions
    const token = await getAdminToken()
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Erreur de connexion au serveur' },
        { status: 500 }
      )
    }

    // Fetch all promotions and find the matching one
    const response = await fetch(`${MEDUSA_API_URL}/admin/promotions?code=${promoCode}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      console.error('[API] Failed to fetch promotions:', response.status)
      return NextResponse.json(
        { success: false, error: 'Erreur lors de la validation du code' },
        { status: 500 }
      )
    }

    const data = await response.json()
    const promotions = data.promotions || []

    // Find promotion with matching code
    const promotion = promotions.find(
      (p: any) => p.code?.toUpperCase() === promoCode
    )

    if (!promotion) {
      return NextResponse.json(
        { success: false, error: 'Code promo invalide' },
        { status: 400 }
      )
    }

    // Check if promotion is active (no status check in Medusa v2 promotions)
    // Promotions are active by default unless deleted

    // Return promotion details
    const promotionData: PromotionData = {
      id: promotion.id,
      code: promotion.code,
      type: promotion.type,
      is_automatic: promotion.is_automatic,
      application_method: {
        type: promotion.application_method?.type || 'percentage',
        target_type: promotion.application_method?.target_type || 'order',
        allocation: promotion.application_method?.allocation || 'across',
        value: promotion.application_method?.value || 0,
        currency_code: promotion.application_method?.currency_code,
      },
    }

    return NextResponse.json({
      success: true,
      promotion: promotionData,
    })
  } catch (error) {
    console.error('[API] Error validating promo code:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la validation du code promo' },
      { status: 500 }
    )
  }
}
