import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'

dotenv.config()

const MONGODB_URI = process.env.DATABASE_URL || 'mongodb://localhost:27017/exclusives_stickers'

async function removeCustomerField() {
  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    console.log('✅ Connecté à MongoDB')

    const db = client.db()

    // Remove customer field from all orders
    const result = await db.collection('orders').updateMany(
      {},
      {
        $unset: {
          customer: '',
        },
      },
    )

    console.log(`✓ Customer field removed from ${result.modifiedCount} orders`)
  } catch (error) {
    console.error('❌ Erreur:', error)
  } finally {
    await client.close()
  }
}

removeCustomerField()
