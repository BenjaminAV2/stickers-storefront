import dotenv from 'dotenv'
import { resolve } from 'path'
import { MongoClient } from 'mongodb'

dotenv.config({ path: resolve(process.cwd(), '.env.local') })
dotenv.config({ path: resolve(process.cwd(), '.env') })

async function cleanProductsCategories() {
  const uri = process.env.DATABASE_URL || ''
  const client = new MongoClient(uri)

  try {
    await client.connect()
    console.log('✅ Connected to MongoDB Atlas')

    const db = client.db()

    const productsDeleted = await db.collection('products').deleteMany({})
    console.log(`🗑️  Products deleted: ${productsDeleted.deletedCount}`)

    const categoriesDeleted = await db.collection('categories').deleteMany({})
    console.log(`🗑️  Categories deleted: ${categoriesDeleted.deletedCount}`)

    console.log('\n✅ Cleanup completed!')
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await client.close()
  }
}

cleanProductsCategories()
