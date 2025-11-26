import { getPayload } from 'payload'
import config from '../payload.config'

async function fixPasswords() {
  try {
    console.log('\n🔧 CORRECTION DES MOTS DE PASSE\n')
    console.log('='.repeat(60))

    const payload = await getPayload({ config })

    // Utilisateur 1: contact@avdigital.fr
    console.log('\n1. Mise à jour: contact@avdigital.fr')
    console.log('-'.repeat(60))

    const user1 = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: 'contact@avdigital.fr',
        },
      },
    })

    if (user1.docs.length > 0) {
      await payload.update({
        collection: 'users',
        id: user1.docs[0].id,
        data: {
          password: 'AdminContact2024!',
        },
      })
      console.log('✅ Mot de passe mis à jour: AdminContact2024!')

      // Vérifier que le mot de passe est maintenant présent
      const verification1 = await payload.findByID({
        collection: 'users',
        id: user1.docs[0].id,
      })
      console.log(`Vérification - Password Hash présent: ${(verification1 as any).password ? 'Oui ✅' : 'Non ❌'}`)
    } else {
      console.log('❌ Utilisateur non trouvé')
    }

    // Utilisateur 2: benjamin@avdigital.fr
    console.log('\n2. Mise à jour: benjamin@avdigital.fr')
    console.log('-'.repeat(60))

    const user2 = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: 'benjamin@avdigital.fr',
        },
      },
    })

    if (user2.docs.length > 0) {
      await payload.update({
        collection: 'users',
        id: user2.docs[0].id,
        data: {
          password: 'vDDzM2Gf3n!*NQ',
        },
      })
      console.log('✅ Mot de passe mis à jour: vDDzM2Gf3n!*NQ')

      // Vérifier que le mot de passe est maintenant présent
      const verification2 = await payload.findByID({
        collection: 'users',
        id: user2.docs[0].id,
      })
      console.log(`Vérification - Password Hash présent: ${(verification2 as any).password ? 'Oui ✅' : 'Non ❌'}`)
    } else {
      console.log('❌ Utilisateur non trouvé')
    }

    // Test de connexion
    console.log('\n3. TEST DE CONNEXION')
    console.log('-'.repeat(60))

    try {
      const loginResult = await payload.login({
        collection: 'users',
        data: {
          email: 'contact@avdigital.fr',
          password: 'AdminContact2024!',
        },
      })
      console.log('✅ Login test réussi pour contact@avdigital.fr!')
      console.log('Token généré:', loginResult.token ? 'Oui' : 'Non')
    } catch (error: any) {
      console.log('❌ Login test échoué:', error.message)
    }

    console.log('\n' + '='.repeat(60))
    console.log('CORRECTION TERMINÉE\n')
    process.exit(0)
  } catch (error: any) {
    console.error('\n❌ ERREUR:', error.message)
    console.error(error)
    process.exit(1)
  }
}

fixPasswords()
