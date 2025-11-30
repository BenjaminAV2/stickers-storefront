import dotenv from 'dotenv'
import { resolve } from 'path'
import { MongoClient } from 'mongodb'

// Load .env files explicitly
dotenv.config({ path: resolve(process.cwd(), '.env.local') })
dotenv.config({ path: resolve(process.cwd(), '.env') })

async function cleanOldOrders() {
  const uri = process.env.DATABASE_URL || ''
  const client = new MongoClient(uri)

  try {
    await client.connect()
    console.log('✅ Connected to MongoDB Atlas')

    const db = client.db()

    // Count before
    const countBefore = await db.collection('orders').countDocuments()
    console.log(`\n📊 Nombre de commandes avant: ${countBefore}`)

    // Keep only the new test order (the one with customerEmail: 'test-nouveau@example.com')
    const result = await db.collection('orders').deleteMany({
      customerEmail: { $ne: 'test-nouveau@example.com' }
    })

    console.log(`\n🗑️  Commandes supprimées: ${result.deletedCount}`)

    // Count after
    const countAfter = await db.collection('orders').countDocuments()
    console.log(`📊 Nombre de commandes après: ${countAfter}`)

    // Show remaining order
    const remaining = await db.collection('orders').findOne()
    if (remaining) {
      console.log('\n✅ Commande restante:')
      console.log(`   - Order Number: ${remaining.orderNumber}`)
      console.log(`   - Customer: ${remaining.customerName} (${remaining.customerEmail})`)
      console.log(`   - Total: ${remaining.totalCents / 100}€`)
    }

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await client.close()
  }
}

cleanOldOrders()
