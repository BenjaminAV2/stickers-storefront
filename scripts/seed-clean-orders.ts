import dotenv from 'dotenv'
import { resolve } from 'path'
import { MongoClient } from 'mongodb'

// Load .env files explicitly
dotenv.config({ path: resolve(process.cwd(), '.env.local') })
dotenv.config({ path: resolve(process.cwd(), '.env') })

const statuses = ['pending_payment', 'paid_awaiting_bat', 'in_production', 'production_complete', 'in_delivery', 'delivered']
const shapes = ['square', 'round', 'oval', 'rectangle']
const customers = [
  { name: 'Alice Martin', email: 'alice.martin@example.com', company: 'Design Studio' },
  { name: 'Bob Dubois', email: 'bob.dubois@example.com', company: 'GraphiK SARL' },
  { name: 'Charlie Bernard', email: 'charlie.bernard@example.com', company: 'Print Co' },
  { name: 'Diane Laurent', email: 'diane.laurent@example.com', company: 'Creative Agency' },
  { name: 'Eric Thomas', email: 'eric.thomas@example.com', company: 'Marketing Plus' },
]

async function seedCleanOrders() {
  const uri = process.env.DATABASE_URL || ''
  const client = new MongoClient(uri)

  try {
    await client.connect()
    console.log('✅ Connected to MongoDB Atlas')

    const db = client.db()

    const orders = []

    // Create 10 test orders
    for (let i = 0; i < 10; i++) {
      const customer = customers[i % customers.length]
      const quantity = 50 + Math.floor(Math.random() * 450)
      const unitPrice = 30 + Math.floor(Math.random() * 170)
      const subtotal = quantity * unitPrice
      const shipping = 500 + Math.floor(Math.random() * 1500)
      const tax = Math.floor(subtotal * 0.2)
      const total = subtotal + shipping + tax

      const order = {
        orderNumber: `ORD-${Date.now() + i}-${Math.floor(Math.random() * 10000)}`,
        customerEmail: customer.email,
        customerName: customer.name,
        customerCompany: customer.company,
        countryCode: 'FR',
        status: statuses[Math.floor(Math.random() * statuses.length)],
        statusHistory: [{
          status: 'pending_payment',
          changedAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
          changedBy: 'system',
          note: 'Commande créée'
        }],
        items: [{
          productReference: `STK-${100 + i}`,
          productName: `Sticker personnalisé ${10 + i}x${15 + i}cm`,
          size: `${10 + i}x${15 + i}cm`,
          supportShape: shapes[Math.floor(Math.random() * shapes.length)],
          quantity,
          unitPriceCents: unitPrice,
          totalPriceCents: subtotal,
          batApproved: Math.random() > 0.5,
        }],
        subtotalHT: subtotal,
        shippingCents: shipping,
        taxCents: tax,
        discountCents: 0,
        totalCents: total,
        shippingMethod: Math.random() > 0.5 ? 'Colissimo' : 'Chronopost',
        shippingAddress: {
          firstName: customer.name.split(' ')[0],
          lastName: customer.name.split(' ')[1],
          company: customer.company,
          address1: `${Math.floor(Math.random() * 200)} Rue de Test`,
          city: ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice'][Math.floor(Math.random() * 5)],
          postalCode: `${75000 + Math.floor(Math.random() * 15000)}`,
          countryCode: 'FR',
          phone: `06${Math.floor(Math.random() * 100000000)}`,
        },
        paymentMethod: 'stripe',
        paymentStatus: Math.random() > 0.3 ? 'paid' : 'pending',
        paidAt: Math.random() > 0.3 ? new Date(Date.now() - Math.floor(Math.random() * 15) * 24 * 60 * 60 * 1000) : null,
        synced: false,
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
      }

      orders.push(order)
    }

    const result = await db.collection('orders').insertMany(orders)
    console.log(`✅ ${result.insertedCount} commandes créées`)

    const total = orders.reduce((sum, o) => sum + o.totalCents, 0)
    console.log(`💰 Total: ${(total / 100).toFixed(2)}€`)

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await client.close()
  }
}

seedCleanOrders()
