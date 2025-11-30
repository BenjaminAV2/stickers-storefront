import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'

dotenv.config()

const MONGODB_ATLAS = process.env.DATABASE_URL || ''
const MONGODB_LOCAL = 'mongodb://localhost:27017/exclusives_stickers'

async function checkDatabase(uri: string, name: string) {
  const client = new MongoClient(uri)

  try {
    await client.connect()
    console.log(`\n✅ Connecté à ${name}`)

    const db = client.db()

    const ordersCount = await db.collection('orders').countDocuments()
    const minimalCount = await db.collection('orders-minimal').countDocuments()
    const customersCount = await db.collection('customers').countDocuments()
    const usersCount = await db.collection('users').countDocuments()

    console.log(`📊 ${name} - Statistiques:`)
    console.log(`   - Orders: ${ordersCount}`)
    console.log(`   - Orders-minimal: ${minimalCount}`)
    console.log(`   - Customers: ${customersCount}`)
    console.log(`   - Users: ${usersCount}`)
  } catch (error) {
    console.error(`❌ Erreur ${name}:`, error instanceof Error ? error.message : error)
  } finally {
    await client.close()
  }
}

async function main() {
  console.log('🔍 Vérification des deux bases de données...\n')
  console.log('DATABASE_URL (Atlas):', MONGODB_ATLAS.replace(/:[^:]*@/, ':****@'))
  console.log('Local:', MONGODB_LOCAL)

  await checkDatabase(MONGODB_ATLAS, 'MongoDB Atlas (Cloud)')
  await checkDatabase(MONGODB_LOCAL, 'MongoDB Local')
}

main()
