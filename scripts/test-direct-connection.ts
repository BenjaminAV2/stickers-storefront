import dotenv from 'dotenv'
import { resolve } from 'path'
import { MongoClient } from 'mongodb'

// Load .env files explicitly
dotenv.config({ path: resolve(process.cwd(), '.env.local') })
dotenv.config({ path: resolve(process.cwd(), '.env') })

console.log('DATABASE_URL from env:', process.env.DATABASE_URL?.substring(0, 50) + '...')

async function testDirectConnection() {
  const uri = process.env.DATABASE_URL || 'mongodb://localhost:27017/exclusives_stickers'

  console.log('\n🔍 Testing direct connection with URI:', uri.replace(/:[^:]*@/, ':****@'))

  const client = new MongoClient(uri)

  try {
    await client.connect()
    console.log('✅ Connected successfully')

    const db = client.db()
    console.log('Database name:', db.databaseName)

    const ordersCount = await db.collection('orders').countDocuments()
    console.log('Orders count:', ordersCount)

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await client.close()
  }
}

testDirectConnection()
