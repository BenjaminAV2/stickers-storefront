import { getPayload } from 'payload'
import config from '../payload.config'

async function createAdmin() {
  try {
    const payload = await getPayload({ config })

    // Vérifier si l'utilisateur existe déjà
    const existing = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: 'benjamin@avdigital.fr',
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
        },
      })
      console.log('✅ Mot de passe de l\'utilisateur admin mis à jour:', (user as any).email)
      process.exit(0)
    }

    // Créer l'utilisateur admin
    const user = await payload.create({
      collection: 'users',
      data: {
        name: 'Admin Benjamin',
        email: 'benjamin@avdigital.fr',
        password: 'vDDzM2Gf3n!*NQ',
        role: 'admin',
      },
    } as any)

    console.log('✅ Utilisateur admin créé avec succès:', (user as any).email)
    process.exit(0)
  } catch (error: any) {
    console.error('❌ Erreur lors de la création de l\'utilisateur admin:', error.message)
    process.exit(1)
  }
}

createAdmin()
