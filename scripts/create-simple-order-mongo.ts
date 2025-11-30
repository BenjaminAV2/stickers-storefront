import dotenv from 'dotenv'
import { resolve } from 'path'
import { MongoClient } from 'mongodb'

// Load .env files explicitly
dotenv.config({ path: resolve(process.cwd(), '.env.local') })
dotenv.config({ path: resolve(process.cwd(), '.env') })

async function createSimpleOrder() {
  const uri = process.env.DATABASE_URL || ''
  const client = new MongoClient(uri)

  try {
    await client.connect()
    console.log('✅ Connected to MongoDB Atlas')

    const db = client.db()

    const simpleOrder = {
      orderNumber: `ORD-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      customerEmail: 'simple@test.com',
      customerName: 'Simple Test',
      customerCompany: 'Test Co',
      countryCode: 'FR',
      status: 'pending_payment',
      statusHistory: [{
        status: 'pending_payment',
        changedAt: new Date(),
        changedBy: 'system',
        note: 'Commande créée'
      }],
      items: [{
        productReference: 'TEST-001',
        productName: 'Sticker Test',
        size: '10x10cm',
        supportShape: 'square',
        quantity: 100,
        unitPriceCents: 50,
        totalPriceCents: 5000,
        batApproved: false,
      }],
      subtotalHT: 5000,
      shippingCents: 500,
      taxCents: 1100,
      discountCents: 0,
      totalCents: 6600,
      shippingMethod: 'Colissimo',
      shippingAddress: {
        firstName: 'Test',
        lastName: 'Simple',
        address1: '123 Rue Test',
        city: 'Paris',
        postalCode: '75001',
        countryCode: 'FR',
        phone: '0123456789',
      },
      paymentMethod: 'stripe',
      paymentStatus: 'pending',
      synced: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection('orders').insertOne(simpleOrder)
    console.log('✅ Order created:', result.insertedId)
    console.log('Order Number:', simpleOrder.orderNumber)

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await client.close()
  }
}

createSimpleOrder()
