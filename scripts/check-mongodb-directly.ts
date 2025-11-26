import { MongoClient } from 'mongodb'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load .env file
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

async function checkMongoDB() {
  const uri = process.env.DATABASE_URL

  if (!uri) {
    throw new Error('DATABASE_URL is not defined in .env file')
  }
  const client = new MongoClient(uri)

  try {
    console.log('\n🔍 VÉRIFICATION DIRECTE MONGODB\n')
    console.log('='.repeat(60))

    await client.connect()
    const db = client.db('exclusives_stickers')
    const usersCollection = db.collection('users')

    console.log('\n1. Tous les utilisateurs')
    console.log('-'.repeat(60))

    const users = await usersCollection.find({}).toArray()

    for (const user of users) {
      console.log(`\nEmail: ${user.email}`)
      console.log(`Name: ${user.name}`)
      console.log(`Role: ${user.role}`)
      console.log(`Password field exists: ${user.password ? 'OUI ✅' : 'NON ❌'}`)
      console.log(`Password field type: ${typeof user.password}`)
      if (user.password) {
        console.log(`Password value (premiers 30 chars): ${String(user.password).substring(0, 30)}...`)
        console.log(`Password length: ${String(user.password).length}`)
      }
      console.log(`Hash field exists: ${user.hash ? 'OUI ✅' : 'NON ❌'}`)
      console.log(`Hash field type: ${typeof user.hash}`)
      if (user.hash) {
        console.log(`Hash value (premiers 60 chars): ${String(user.hash).substring(0, 60)}...`)
        console.log(`Hash length: ${String(user.hash).length}`)
      }
    }

    console.log('\n' + '='.repeat(60))
    console.log('VÉRIFICATION TERMINÉE\n')

  } catch (error) {
    console.error('❌ Erreur:', error)
  } finally {
    await client.close()
  }
}

checkMongoDB()
