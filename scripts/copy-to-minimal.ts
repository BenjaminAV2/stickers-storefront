import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'

dotenv.config()

const MONGODB_URI = process.env.DATABASE_URL || 'mongodb://localhost:27017/exclusives_stickers'

async function copyToMinimal() {
  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    console.log('✅ Connecté à MongoDB')

    const db = client.db()

    // Get 5 orders
    const orders = await db.collection('orders').find().limit(5).toArray()

    // Copy to orders-minimal with only the minimal fields
    const minimalOrders = orders.map((order) => ({
      orderNumber: order.orderNumber,
      customerEmail: order.customerEmail,
      customerName: order.customerName,
      totalCents: order.totalCents,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    }))

    await db.collection('orders-minimal').insertMany(minimalOrders)

    console.log(`✅ ${minimalOrders.length} commandes copiées vers orders-minimal`)
  } catch (error) {
    console.error('❌ Erreur:', error)
  } finally {
    await client.close()
  }
}

copyToMinimal()
