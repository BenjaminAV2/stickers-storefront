import { MongoClient } from 'mongodb'
import crypto from 'crypto'
import dotenv from 'dotenv'

dotenv.config()

const DATABASE_URL = process.env.DATABASE_URL
const password = 'vDDzM2Gf3n!*NQ'

// Generate Payload-compatible PBKDF2 hash
function generatePayloadHash(password) {
  const salt = crypto.randomBytes(32).toString('hex')
  const hash = crypto.pbkdf2Sync(password, salt, 25000, 512, 'sha256').toString('hex')
  return { salt, hash }
}

async function resetAdminPassword() {
  const client = new MongoClient(DATABASE_URL)

  try {
    await client.connect()
    console.log('✅ Connecté à MongoDB Atlas\n')

    const db = client.db()
    const usersCollection = db.collection('users')

    const email = 'benjamin@avdigital.fr'

    console.log('🔍 Recherche de l\'administrateur...')
    const user = await usersCollection.findOne({ email })

    if (!user) {
      console.log('❌ Utilisateur non trouvé')
      return
    }

    console.log('✅ Utilisateur trouvé:', user.email)

    console.log('\n🔐 Génération du nouveau hash PBKDF2...')
    const { salt, hash } = generatePayloadHash(password)

    console.log('   Salt:', salt.substring(0, 20) + '...')
    console.log('   Hash:', hash.substring(0, 20) + '...')

    console.log('\n💾 Mise à jour de l\'utilisateur...')
    const result = await usersCollection.updateOne(
      { email },
      {
        $set: {
          salt,
          hash,
        },
        $unset: {
          password: '', // Remove the old bcrypt password field
        },
      }
    )

    console.log('✅ Résultat:', result.modifiedCount, 'document(s) modifié(s)')

    console.log('\n✅✅✅ MOT DE PASSE RÉINITIALISÉ AVEC FORMAT PAYLOAD! ✅✅✅')
    console.log('\n📝 Identifiants de connexion:')
    console.log('   Email:', email)
    console.log('   Password:', password)
    console.log('\n🌐 Vous pouvez maintenant vous connecter sur:')
    console.log('   - Payload Admin: http://localhost:3001/admin')
    console.log('   - NextAuth Admin: http://localhost:3001/admin/signin')
  } catch (error) {
    console.error('❌ Erreur:', error)
  } finally {
    await client.close()
  }
}

resetAdminPassword()
