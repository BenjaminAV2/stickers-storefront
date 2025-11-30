import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'

dotenv.config()

const MONGODB_URI = process.env.DATABASE_URL || 'mongodb://localhost:27017/exclusives_stickers'

async function verifyCustomerRefs() {
  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    console.log('✅ Connecté à MongoDB')

    const db = client.db()

    // Get all orders with customer field
    const orders = await db.collection('orders').find({}).toArray()
    console.log(`\n📦 ${orders.length} commandes trouvées`)

    // Get all customers
    const customers = await db.collection('customers').find({}).toArray()
    const customerIds = new Set(customers.map((c) => c._id.toString()))
    console.log(`👥 ${customers.length} customers trouvés`)

    let validRefs = 0
    let nullRefs = 0
    let invalidRefs = 0

    for (const order of orders) {
      if (!order.customer) {
        nullRefs++
        console.log(`⚠️  Commande ${order.orderNumber} - customer null`)
      } else {
        const customerId = order.customer.toString()
        if (customerIds.has(customerId)) {
          validRefs++
        } else {
          invalidRefs++
          console.log(
            `❌ Commande ${order.orderNumber} - customer invalide: ${customerId} (n'existe pas)`,
          )
        }
      }
    }

    console.log(`\n📊 Résumé:`)
    console.log(`  ✓ Références valides: ${validRefs}`)
    console.log(`  ⚠  Références null: ${nullRefs}`)
    console.log(`  ❌ Références invalides: ${invalidRefs}`)
  } catch (error) {
    console.error('❌ Erreur:', error)
  } finally {
    await client.close()
  }
}

verifyCustomerRefs()
