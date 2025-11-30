import dotenv from 'dotenv'
import { resolve } from 'path'
import { MongoClient } from 'mongodb'

// Load .env files explicitly
dotenv.config({ path: resolve(process.cwd(), '.env.local') })
dotenv.config({ path: resolve(process.cwd(), '.env') })

async function inspectOrderStructure() {
  const uri = process.env.DATABASE_URL || ''
  const client = new MongoClient(uri)

  try {
    await client.connect()
    console.log('✅ Connected to MongoDB Atlas')

    const db = client.db()

    // Get one order to inspect structure
    const order = await db.collection('orders').findOne()

    if (!order) {
      console.log('No orders found')
      return
    }

    console.log('\n📋 Order Structure:')
    console.log(JSON.stringify(order, null, 2))

    // Find all fields with null values
    console.log('\n🔍 Null fields:')
    for (const key in order) {
      if (order[key] === null) {
        console.log(`  - ${key}: null`)
      }
    }

    // Check items for null values
    if (order.items && Array.isArray(order.items)) {
      console.log('\n🔍 Checking items for null values:')
      order.items.forEach((item: any, index: number) => {
        console.log(`\n  Item ${index}:`)
        for (const key in item) {
          if (item[key] === null) {
            console.log(`    - ${key}: null`)
          }
        }
      })
    }

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await client.close()
  }
}

inspectOrderStructure()
