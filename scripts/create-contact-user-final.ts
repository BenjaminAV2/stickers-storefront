import { getPayload } from 'payload'
import config from '../payload.config'

async function createContactUser() {
  try {
    console.log('\n🔧 CRÉATION UTILISATEUR CONTACT\n')
    console.log('='.repeat(60))

    const payload = await getPayload({ config })

    // Vérifier si l'utilisateur existe
    console.log('\n1. Vérification utilisateur existant')
    console.log('-'.repeat(60))

    const existing = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: 'contact@avdigital.fr',
        },
      },
    })

    if (existing.docs.length > 0) {
      console.log('Utilisateur existe déjà - Mise à jour...')
      await payload.update({
        collection: 'users',
        id: existing.docs[0].id,
        data: {
          name: 'Admin Contact',
          password: 'AdminContact2024!',
          role: 'admin',
        },
      })
      console.log('✅ Utilisateur mis à jour')
    } else {
      console.log('Utilisateur n\'existe pas - Création...')
      await payload.create({
        collection: 'users',
        data: {
          name: 'Admin Contact',
          email: 'contact@avdigital.fr',
          password: 'AdminContact2024!',
          role: 'admin',
        },
      } as any)
      console.log('✅ Utilisateur créé')
    }

    // Vérifier la création
    console.log('\n2. Vérification finale')
    console.log('-'.repeat(60))

    const verification = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: 'contact@avdigital.fr',
        },
      },
    })

    if (verification.docs.length > 0) {
      const user = verification.docs[0] as any
      console.log('✅ Utilisateur vérifié:')
      console.log('  - Email:', user.email)
      console.log('  - Name:', user.name)
      console.log('  - Role:', user.role)
      console.log('  - ID:', user.id)
    } else {
      console.log('❌ Erreur: Utilisateur non trouvé après création')
    }

    // Test de connexion
    console.log('\n3. Test de connexion')
    console.log('-'.repeat(60))

    try {
      const loginResult = await payload.login({
        collection: 'users',
        data: {
          email: 'contact@avdigital.fr',
          password: 'AdminContact2024!',
        },
      })
      console.log('✅ LOGIN RÉUSSI!')
      console.log('Token:', loginResult.token ? 'Généré ✅' : 'Non généré ❌')
      console.log('User:', (loginResult.user as any)?.email)
    } catch (error: any) {
      console.log('❌ Login échoué:', error.message)
    }

    console.log('\n' + '='.repeat(60))
    console.log('TERMINÉ\n')
    process.exit(0)
  } catch (error: any) {
    console.error('\n❌ ERREUR:', error.message)
    console.error(error)
    process.exit(1)
  }
}

createContactUser()
