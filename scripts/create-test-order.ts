import { getPayload } from 'payload'
import config from '../payload.config'
import dotenv from 'dotenv'
import { resolve } from 'path'

// Load .env files explicitly
dotenv.config({ path: resolve(process.cwd(), '.env.local') })
dotenv.config({ path: resolve(process.cwd(), '.env') })

async function createTestOrder() {
  try {
    console.log('🔄 Initialisation de Payload...')
    const payload = await getPayload({ config })

    console.log('✅ Payload initialisé\n')

    // Create a simple test order matching the current schema
    const testOrder = {
      customerEmail: 'test-nouveau@example.com',
      customerName: 'Test Nouveau',
      customerCompany: 'Test Company',
      countryCode: 'FR',
      status: 'pending_payment',
      items: [
        {
          productReference: 'TEST-001',
          productName: 'Sticker Test',
          size: '10x10cm',
          supportShape: 'square',
          quantity: 100,
          unitPriceCents: 50,
          totalPriceCents: 5000,
          batApproved: false,
        },
      ],
      subtotalHT: 5000,
      shippingCents: 500,
      taxCents: 1100,
      discountCents: 0,
      totalCents: 6600,
      shippingMethod: 'Colissimo',
      shippingAddress: {
        firstName: 'Test',
        lastName: 'Nouveau',
        address1: '123 Rue Test',
        city: 'Paris',
        postalCode: '75001',
        countryCode: 'FR',
        phone: '0123456789',
      },
      paymentMethod: 'stripe',
      paymentStatus: 'pending',
      synced: false,
    }

    console.log('📝 Création d\'une nouvelle commande de test...')
    const result = await payload.create({
      collection: 'orders',
      data: testOrder,
      overrideAccess: true,
    })

    console.log('✅ Commande créée avec succès!')
    console.log('Order Number:', result.orderNumber)
    console.log('ID:', result.id)

    // Try to fetch it back
    console.log('\n📊 Récupération de la commande créée...')
    const fetched = await payload.findByID({
      collection: 'orders',
      id: result.id,
      overrideAccess: true,
      depth: 0,
    })

    console.log('✅ Commande récupérée:', fetched.orderNumber)

    process.exit(0)
  } catch (error) {
    console.error('❌ Erreur:', error)
    process.exit(1)
  }
}

createTestOrder()
