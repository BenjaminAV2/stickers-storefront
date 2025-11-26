import { getPayload } from 'payload'
import config from '../payload.config'

async function verifyAndReset() {
  try {
    const payload = await getPayload({ config })

    // Trouver l'utilisateur
    const existing = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: 'contact@avdigital.fr',
        },
      },
    })

    if (existing.docs.length === 0) {
      console.log('❌ Utilisateur contact@avdigital.fr non trouvé dans la base de données')
      console.log('Recherche de tous les utilisateurs...')

      const allUsers = await payload.find({
        collection: 'users',
        limit: 100,
      })

      console.log('\nUtilisateurs trouvés:')
      allUsers.docs.forEach(user => {
        console.log(`- ${user.email} (ID: ${user.id})`)
      })

      process.exit(1)
    }

    const user = existing.docs[0]
    console.log('\n✅ Utilisateur trouvé:')
    console.log('- Email:', user.email)
    console.log('- ID:', user.id)
    console.log('- Role:', user.role)
    console.log('- Name:', user.name)

    // Réinitialiser complètement le mot de passe
    console.log('\nRéinitialisation du mot de passe...')
    const updated = await payload.update({
      collection: 'users',
      id: user.id,
      data: {
        password: 'AdminContact2024!',
        loginAttempts: 0,
        lockUntil: undefined,
      },
    })

    console.log('\n✅ Mot de passe réinitialisé avec succès!')
    console.log('Nouveau mot de passe: AdminContact2024!')
    process.exit(0)
  } catch (error: any) {
    console.error('❌ Erreur:', error.message)
    console.error(error)
    process.exit(1)
  }
}

verifyAndReset()
