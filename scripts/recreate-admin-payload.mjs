import dotenv from 'dotenv'
// Load env first
dotenv.config()

import { getPayload } from 'payload'
import config from '../payload.config.js'

async function recreateAdmin() {
  try {
    console.log('🔧 Recréation de l\'administrateur avec le format Payload natif\n')

    const payload = await getPayload({ config })
    console.log('✅ Payload initialisé\n')

    const email = 'benjamin@avdigital.fr'
    const password = 'vDDzM2Gf3n!*NQ'

    // First, try to find existing user
    console.log('🔍 Recherche de l\'utilisateur existant...')
    const existingUsers = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: email,
        },
      },
    })

    if (existingUsers.docs.length > 0) {
      console.log('✅ Utilisateur existant trouvé')
      console.log('🗑️  Suppression de l\'ancien utilisateur...')

      for (const user of existingUsers.docs) {
        await payload.delete({
          collection: 'users',
          id: user.id,
        })
        console.log(`   ✅ Supprimé: ${user.id}`)
      }
    } else {
      console.log('ℹ️  Aucun utilisateur existant trouvé')
    }

    // Create new user with Payload's native format
    console.log('\n📝 Création du nouvel administrateur...')
    const newUser = await payload.create({
      collection: 'users',
      data: {
        email,
        password, // Payload will hash this automatically with PBKDF2
        name: 'Benjamin',
        role: 'admin',
      },
    })

    console.log('\n✅✅✅ ADMINISTRATEUR CRÉÉ AVEC SUCCÈS! ✅✅✅')
    console.log('\n📋 Informations:')
    console.log('   ID:', newUser.id)
    console.log('   Email:', newUser.email)
    console.log('   Nom:', newUser.name)
    console.log('   Rôle:', newUser.role)

    console.log('\n🧪 Test de connexion avec Payload...')
    try {
      const loginResult = await payload.login({
        collection: 'users',
        data: {
          email,
          password,
        },
      })

      console.log('✅✅✅ CONNEXION PAYLOAD RÉUSSIE! ✅✅✅')
      console.log('🎟️  Token présent:', !!loginResult.token)
    } catch (loginError) {
      console.error('❌ Échec de connexion Payload:', loginError.message)
    }

    await payload.db.destroy()

    console.log('\n📝 Identifiants de connexion:')
    console.log('   Email:', email)
    console.log('   Password:', password)
    console.log('\n🌐 URLs de connexion:')
    console.log('   NextAuth Admin:', 'http://localhost:3001/admin/signin')
    console.log('   Payload Admin:', 'http://localhost:3001/admin')
  } catch (error) {
    console.error('❌ Erreur:', error)
    process.exit(1)
  }
}

recreateAdmin()
