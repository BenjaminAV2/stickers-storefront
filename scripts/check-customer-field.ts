import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'

dotenv.config()

const MONGODB_URI = process.env.DATABASE_URL || 'mongodb://localhost:27017/exclusives_stickers'

async function checkCustomerField() {
  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    console.log('✅ Connecté à MongoDB')

    const db = client.db()

    // Get one order
    const order = await db.collection('orders').findOne()

    if (order) {
      console.log('\n📋 Exemple de commande:')
      console.log(`  orderNumber: ${order.orderNumber}`)
      console.log(`  customer field type: ${typeof order.customer}`)
      console.log(`  customer value:`, order.customer)
      console.log(`  customerEmail: ${order.customerEmail}`)
    }

  } catch (error) {
    console.error('❌ Erreur:', error)
  } finally {
    await client.close()
  }
}

checkCustomerField()
