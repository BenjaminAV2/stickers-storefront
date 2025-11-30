import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'

dotenv.config()

const MONGODB_URI = process.env.DATABASE_URL || 'mongodb://localhost:27017/exclusives_stickers'

async function inspectOrderFields() {
  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    console.log('✅ Connecté à MongoDB')

    const db = client.db()

    // Get one order to see all its fields
    const order = await db.collection('orders').findOne()

    if (order) {
      console.log('\n📋 Tous les champs de la première commande:')
      console.log(JSON.stringify(order, null, 2))
    }
  } catch (error) {
    console.error('❌ Erreur:', error)
  } finally {
    await client.close()
  }
}

inspectOrderFields()
