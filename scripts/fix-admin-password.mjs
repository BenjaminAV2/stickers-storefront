import { getPayload } from 'payload'
import { fileURLToPath } from 'url'
import path from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const configModule = await import('../payload.config.ts')
const config = configModule.default

const email = 'benjamin@avdigital.fr'
const newPassword = 'vDDzM2Gf3n!*NQ'

async function fixPassword() {
  try {
    const payload = await getPayload({ config })

    console.log('🔍 Recherche de l\'utilisateur...')

    const users = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: email,
        },
      },
    })

    if (users.docs.length === 0) {
      console.log('❌ Utilisateur non trouvé')
      process.exit(1)
    }

    const user = users.docs[0]
    console.log('✅ Utilisateur trouvé:', user.email)
    console.log('   ID:', user.id)

    // La clé: utiliser update avec le champ password
    // Payload va automatiquement hasher le mot de passe
    console.log('🔄 Mise à jour du mot de passe via Payload API...')

    const updated = await payload.update({
      collection: 'users',
      id: user.id,
      data: {
        password: newPassword, // Payload va automatiquement hasher
      },
    })

    console.log('✅ Mot de passe mis à jour!')
    console.log()
    console.log('='.repeat(60))
    console.log('📧 Email:', email)
    console.log('🔑 Mot de passe:', newPassword)
    console.log('🔐 Type: Admin (cochez "Connexion administrateur")')
    console.log('='.repeat(60))

    // Vérifier que ça a fonctionné
    const check = await payload.find({
      collection: 'users',
      where: { email: { equals: email } },
    })

    if (check.docs.length > 0 && check.docs[0].password) {
      console.log('✅ Hash existe maintenant en BDD!')
      console.log('   Hash (20 premiers chars):', check.docs[0].password.substring(0, 20))
    }

    process.exit(0)

  } catch (error) {
    console.error('❌ Erreur:', error.message)
    console.error(error)
    process.exit(1)
  }
}

fixPassword()
