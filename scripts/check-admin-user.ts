import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'

dotenv.config()

const MONGODB_URI = process.env.DATABASE_URL || 'mongodb://localhost:27017/exclusives_stickers'

async function checkAdminUser() {
  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    console.log('✅ Connecté à MongoDB')

    const db = client.db()

    // Check users collection
    const users = await db.collection('users').find().toArray()
    console.log(`\n📊 Nombre d'utilisateurs: ${users.length}`)

    users.forEach((user, index) => {
      console.log(`\n--- Utilisateur ${index + 1} ---`)
      console.log('ID:', user._id)
      console.log('Email:', user.email)
      console.log('Role:', user.role)
      console.log('Collection:', user.collection)
      console.log('Tous les champs:', Object.keys(user))
    })
  } catch (error) {
    console.error('❌ Erreur:', error)
  } finally {
    await client.close()
  }
}

checkAdminUser()
