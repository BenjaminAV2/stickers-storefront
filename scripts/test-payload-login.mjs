import { getPayload } from 'payload'
import config from '../payload.config.js'
import dotenv from 'dotenv'

dotenv.config()

async function testPayloadLogin() {
  try {
    console.log('🔍 Test de connexion Payload CMS\n')

    const payload = await getPayload({ config })

    console.log('✅ Payload initialisé\n')

    const email = 'benjamin@avdigital.fr'
    const password = 'vDDzM2Gf3n!*NQ'

    console.log('📧 Tentative de connexion avec:', email)

    try {
      // Try to login using Payload's login method
      const result = await payload.login({
        collection: 'users',
        data: {
          email,
          password,
        },
      })

      console.log('\n✅✅✅ CONNEXION PAYLOAD RÉUSSIE! ✅✅✅')
      console.log('\n📋 Informations utilisateur:')
      console.log(JSON.stringify(result.user, null, 2))
      console.log('\n🎟️ Token:', result.token ? 'PRÉSENT' : 'ABSENT')
    } catch (loginError) {
      console.error('\n❌ Erreur de connexion Payload:')
      console.error(loginError.message)

      // Try to check user directly
      console.log('\n🔍 Vérification directe de l\'utilisateur...')
      const user = await payload.find({
        collection: 'users',
        where: {
          email: {
            equals: email,
          },
        },
      })

      if (user.docs.length > 0) {
        console.log('✅ Utilisateur trouvé dans Payload')
        console.log('📋 Données:', JSON.stringify(user.docs[0], null, 2))
      } else {
        console.log('❌ Utilisateur non trouvé dans Payload')
      }
    }

    await payload.db.destroy()
  } catch (error) {
    console.error('❌ Erreur:', error)
  }
}

testPayloadLogin()
