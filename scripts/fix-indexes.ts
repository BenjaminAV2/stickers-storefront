import dotenv from 'dotenv'
import { MongoClient } from 'mongodb'

dotenv.config()

const MONGODB_URI = process.env.DATABASE_URL || 'mongodb://localhost:27017/exclusives_stickers'

async function fixIndexes() {
  console.log('🔧 Correction des indexes MongoDB...')

  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    console.log('✅ Connecté à MongoDB')

    const db = client.db()

    // Lister les indexes de la collection orders
    const indexes = await db.collection('orders').indexes()
    console.log('📋 Indexes actuels:', indexes.map(idx => idx.name).join(', '))

    // Supprimer l'index orderId_1 qui pose problème
    try {
      await db.collection('orders').dropIndex('orderId_1')
      console.log('✓ Index orderId_1 supprimé')
    } catch (error: any) {
      if (error.code === 27) {
        console.log('⚠️  Index orderId_1 n\'existe pas')
      } else {
        throw error
      }
    }

    console.log('✅ Correction terminée')

  } catch (error) {
    console.error('❌ Erreur:', error)
    throw error
  } finally {
    await client.close()
  }
}

fixIndexes()
