import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'

dotenv.config()

const DATABASE_URL = process.env.DATABASE_URL

async function checkUserFields() {
  const client = new MongoClient(DATABASE_URL)

  try {
    await client.connect()
    console.log('✅ Connecté à MongoDB Atlas\n')

    const db = client.db()
    const usersCollection = db.collection('users')

    const user = await usersCollection.findOne({ email: 'benjamin@avdigital.fr' })

    if (!user) {
      console.log('❌ Utilisateur non trouvé')
      return
    }

    console.log('📋 Tous les champs de l\'utilisateur:')
    console.log(JSON.stringify(user, null, 2))

    console.log('\n🔍 Champs spécifiques:')
    console.log('- password:', user.password ? '✅ EXISTS' : '❌ MISSING')
    console.log('- hash:', user.hash ? '✅ EXISTS' : '❌ MISSING')
    console.log('- salt:', user.salt ? '✅ EXISTS' : '❌ MISSING')

    if (user.password) {
      console.log('\n📝 Format du password:')
      console.log('- Commence par $2b$ (bcrypt):', user.password.startsWith('$2b$'))
      console.log('- Longueur:', user.password.length)
    }

    if (user.hash) {
      console.log('\n📝 Format du hash:')
      console.log('- Type:', typeof user.hash)
      console.log('- Longueur:', user.hash.length)
    }

    if (user.salt) {
      console.log('\n📝 Format du salt:')
      console.log('- Type:', typeof user.salt)
      console.log('- Longueur:', user.salt.length)
    }
  } catch (error) {
    console.error('❌ Erreur:', error)
  } finally {
    await client.close()
  }
}

checkUserFields()
