import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'

dotenv.config()

const MONGODB_URI = process.env.DATABASE_URL || 'mongodb://localhost:27017/exclusives_stickers'

async function countCustomerField() {
  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    const db = client.db()

    const withCustomer = await db.collection('orders').countDocuments({ customer: { $exists: true } })
    const total = await db.collection('orders').countDocuments()

    console.log(`Commandes avec champ customer: ${withCustomer}/${total}`)
  } catch (error) {
    console.error('❌ Erreur:', error)
  } finally {
    await client.close()
  }
}

countCustomerField()
