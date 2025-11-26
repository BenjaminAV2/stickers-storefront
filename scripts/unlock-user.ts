import { getPayload } from 'payload'
import config from '../payload.config'

async function unlockUser() {
  try {
    const payload = await getPayload({ config })

    // Trouver l'utilisateur
    const existing = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: 'benjamin@avdigital.fr',
        },
      },
    })

    if (existing.docs.length === 0) {
      console.log('❌ Utilisateur non trouvé')
      process.exit(1)
    }

    // Débloquer l'utilisateur en réinitialisant les champs de verrouillage
    const user = await payload.update({
      collection: 'users',
      id: existing.docs[0].id,
      data: {
        loginAttempts: 0,
        lockUntil: null,
      },
    })

    console.log('✅ Utilisateur débloqué:', user.email)
    process.exit(0)
  } catch (error: any) {
    console.error('❌ Erreur lors du déverrouillage de l\'utilisateur:', error.message)
    process.exit(1)
  }
}

unlockUser()
