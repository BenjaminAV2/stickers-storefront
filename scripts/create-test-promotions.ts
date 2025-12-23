/**
 * Script to create test promotions in Medusa v2
 * Run with: npx tsx scripts/create-test-promotions.ts
 *
 * This creates a special "TEST100" promo code that gives 100% discount
 * allowing order completion without payment for testing purposes.
 */

const MEDUSA_API_URL = process.env.NEXT_PUBLIC_MEDUSA_API_URL || 'https://backend-production-f3de.up.railway.app'

// You need admin authentication to create promotions
// Get this token from the Medusa admin login
const ADMIN_EMAIL = process.env.MEDUSA_ADMIN_EMAIL || 'admin@admin.com'
const ADMIN_PASSWORD = process.env.MEDUSA_ADMIN_PASSWORD || ''

interface PromotionConfig {
  code: string
  type: 'standard' | 'buyget'
  status: 'active' | 'inactive' | 'draft'
  is_automatic?: boolean
  application_method: {
    type: 'percentage' | 'fixed'
    target_type: 'items' | 'shipping_methods' | 'order'
    allocation?: 'each' | 'across'
    value: number
    currency_code?: string
    max_quantity?: number | null
  }
  rules?: Array<{
    attribute: string
    operator: string
    values: string[]
  }>
}

const TEST_PROMOTIONS: PromotionConfig[] = [
  // TEST100 - 100% discount for testing (allows free orders)
  {
    code: 'TEST100',
    type: 'standard',
    status: 'active',
    is_automatic: false,
    application_method: {
      type: 'percentage',
      target_type: 'order',
      allocation: 'across',
      value: 100,
    },
  },
  // WELCOME10 - 10% discount for new customers
  {
    code: 'WELCOME10',
    type: 'standard',
    status: 'active',
    is_automatic: false,
    application_method: {
      type: 'percentage',
      target_type: 'items',
      allocation: 'across',
      value: 10,
    },
  },
  // FREESHIP - Free shipping
  {
    code: 'FREESHIP',
    type: 'standard',
    status: 'active',
    is_automatic: false,
    application_method: {
      type: 'percentage',
      target_type: 'shipping_methods',
      allocation: 'across',
      value: 100,
    },
  },
  // SAVE5 - Fixed 5€ discount
  {
    code: 'SAVE5',
    type: 'standard',
    status: 'active',
    is_automatic: false,
    application_method: {
      type: 'fixed',
      target_type: 'order',
      allocation: 'across',
      value: 5,
      currency_code: 'eur',
    },
  },
]

async function getAdminToken(): Promise<string | null> {
  console.log('Authenticating with Medusa admin...')

  try {
    const response = await fetch(`${MEDUSA_API_URL}/auth/user/emailpass`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
      }),
    })

    if (!response.ok) {
      console.error('Admin authentication failed:', response.status)
      return null
    }

    const data = await response.json()
    console.log('Admin authenticated successfully')
    return data.token
  } catch (error) {
    console.error('Error authenticating:', error)
    return null
  }
}

async function createPromotion(token: string, config: PromotionConfig): Promise<boolean> {
  console.log(`Creating promotion: ${config.code}...`)

  try {
    const response = await fetch(`${MEDUSA_API_URL}/admin/promotions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(config),
    })

    if (!response.ok) {
      const error = await response.json()

      // Check if promotion already exists
      if (response.status === 400 && error.message?.includes('already exists')) {
        console.log(`  Promotion ${config.code} already exists, skipping...`)
        return true
      }

      console.error(`  Failed to create ${config.code}:`, error.message || response.status)
      return false
    }

    const data = await response.json()
    console.log(`  Created promotion ${config.code} (ID: ${data.promotion?.id})`)
    return true
  } catch (error) {
    console.error(`  Error creating ${config.code}:`, error)
    return false
  }
}

async function listPromotions(token: string): Promise<void> {
  console.log('\nListing existing promotions...')

  try {
    const response = await fetch(`${MEDUSA_API_URL}/admin/promotions`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      console.error('Failed to list promotions:', response.status)
      return
    }

    const data = await response.json()
    console.log(`Found ${data.promotions?.length || 0} promotions:`)

    for (const promo of data.promotions || []) {
      console.log(`  - ${promo.code} (${promo.type}, ${promo.status})`)
    }
  } catch (error) {
    console.error('Error listing promotions:', error)
  }
}

async function main() {
  console.log('=== Medusa Promotions Setup ===\n')
  console.log(`API URL: ${MEDUSA_API_URL}`)

  if (!ADMIN_PASSWORD) {
    console.error('\nError: MEDUSA_ADMIN_PASSWORD environment variable is required')
    console.log('\nUsage:')
    console.log('  MEDUSA_ADMIN_PASSWORD=your_password npx tsx scripts/create-test-promotions.ts')
    process.exit(1)
  }

  const token = await getAdminToken()

  if (!token) {
    console.error('\nFailed to authenticate. Please check your admin credentials.')
    process.exit(1)
  }

  console.log('\nCreating test promotions...\n')

  let successCount = 0
  for (const config of TEST_PROMOTIONS) {
    const success = await createPromotion(token, config)
    if (success) successCount++
  }

  console.log(`\n${successCount}/${TEST_PROMOTIONS.length} promotions created/verified`)

  await listPromotions(token)

  console.log('\n=== Setup Complete ===')
  console.log('\nTest promotion codes:')
  console.log('  TEST100   - 100% discount (for testing free orders)')
  console.log('  WELCOME10 - 10% discount on items')
  console.log('  FREESHIP  - Free shipping')
  console.log('  SAVE5     - 5€ off')
}

main().catch(console.error)
