import { getPayload } from 'payload'
import config from '../payload.config'

async function checkAndUnlockUser() {
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

    const user = existing.docs[0]
    console.log('État actuel de l\'utilisateur:')
    console.log('- Email:', user.email)
    console.log('- Login attempts:', user.loginAttempts)
    console.log('- Lock until:', user.lockUntil)
    console.log('- ID:', user.id)

    // Débloquer l'utilisateur et réinitialiser complètement
    const updated = await payload.update({
      collection: 'users',
      id: user.id,
      data: {
        loginAttempts: 0,
        lockUntil: undefined,
        password: 'vDDzM2Gf3n!*NQ', // Réinitialiser aussi le mot de passe
      },
    })

    console.log('\n✅ Utilisateur complètement débloqué et mot de passe réinitialisé')
    console.log('- Login attempts après:', updated.loginAttempts)
    console.log('- Lock until après:', updated.lockUntil)
    process.exit(0)
  } catch (error: any) {
    console.error('❌ Erreur:', error.message)
    console.error(error)
    process.exit(1)
  }
}

checkAndUnlockUser()
