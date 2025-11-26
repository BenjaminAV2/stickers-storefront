import { getPayload } from 'payload'
import config from '../payload.config'

async function createSecondAdmin() {
  try {
    const payload = await getPayload({ config })

    // Vérifier si l'utilisateur existe déjà
    const existing = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: 'contact@avdigital.fr',
        },
      },
    })

    if (existing.docs.length > 0) {
      // Mettre à jour le mot de passe
      const user = await payload.update({
        collection: 'users',
        id: existing.docs[0].id,
        data: {
          password: 'vDDzM2Gf3n!*NQ',
          role: 'admin',
          loginAttempts: 0,
          lockUntil: undefined,
        },
      })
      console.log('✅ Utilisateur admin existant mis à jour:', (user as any).email)
      process.exit(0)
    }

    // Créer l'utilisateur admin
    const user = await payload.create({
      collection: 'users',
      data: {
        name: 'Admin Contact',
        email: 'contact@avdigital.fr',
        password: 'vDDzM2Gf3n!*NQ',
        role: 'admin',
      },
    } as any)

    console.log('✅ Nouvel utilisateur admin créé avec succès:', (user as any).email)
    process.exit(0)
  } catch (error: any) {
    console.error('❌ Erreur lors de la création de l\'utilisateur admin:', error.message)
    console.error(error)
    process.exit(1)
  }
}

createSecondAdmin()
