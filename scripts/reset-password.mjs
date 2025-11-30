import { getPayload } from 'payload'
import bcrypt from 'bcrypt'
import { fileURLToPath } from 'url'
import path from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Import dynamique du config TypeScript
const configModule = await import('../payload.config.ts')
const config = configModule.default

const email = 'benjamin@avdigital.fr'
const newPassword = 'vDDzM2Gf3n!*NQ'

async function resetPassword() {
  try {
    const payload = await getPayload({ config })

    console.log('🔍 Recherche du compte...')

    // Vérifier dans les admins (collection users)
    const adminUsers = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: email,
        },
      },
    })

    if (adminUsers.docs.length > 0) {
      console.log('✅ Compte admin trouvé')
      const hashedPassword = await bcrypt.hash(newPassword, 10)

      await payload.update({
        collection: 'users',
        id: adminUsers.docs[0].id,
        data: {
          password: hashedPassword,
        },
      })

      console.log('✅ Mot de passe admin mis à jour avec succès!')
      console.log('📧 Email:', email)
      console.log('🔑 Nouveau mot de passe:', newPassword)
      console.log('🔐 Connectez-vous en cochant "Connexion administrateur"')
      process.exit(0)
    }

    // Vérifier dans les customers
    const customers = await payload.find({
      collection: 'customers',
      where: {
        email: {
          equals: email,
        },
      },
    })

    if (customers.docs.length > 0) {
      console.log('✅ Compte client trouvé')
      const hashedPassword = await bcrypt.hash(newPassword, 10)

      await payload.update({
        collection: 'customers',
        id: customers.docs[0].id,
        data: {
          password: hashedPassword,
        },
      })

      console.log('✅ Mot de passe client mis à jour avec succès!')
      console.log('📧 Email:', email)
      console.log('🔑 Nouveau mot de passe:', newPassword)
      console.log('🔐 Connectez-vous SANS cocher "Connexion administrateur"')
      process.exit(0)
    }

    console.log('❌ Aucun compte trouvé pour cet email')
    process.exit(1)

  } catch (error) {
    console.error('❌ Erreur:', error.message)
    process.exit(1)
  }
}

resetPassword()
