import { getPayload } from 'payload'
import config from '../payload.config'

async function fixBenjaminUser() {
  try {
    console.log('\n🔧 MISE À JOUR UTILISATEUR BENJAMIN\n')
    console.log('='.repeat(60))

    const payload = await getPayload({ config })

    // Trouver l'utilisateur
    console.log('\n1. Recherche de l\'utilisateur')
    console.log('-'.repeat(60))

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
    console.log('✅ Utilisateur trouvé:', user.email)

    // Mettre à jour le mot de passe
    console.log('\n2. Mise à jour du mot de passe')
    console.log('-'.repeat(60))

    await payload.update({
      collection: 'users',
      id: user.id,
      data: {
        name: 'Benjamin',
        password: 'vDDzM2Gf3n!*NQ',
        role: 'admin',
        loginAttempts: 0,
        lockUntil: undefined,
      },
    })

    console.log('✅ Mot de passe mis à jour: vDDzM2Gf3n!*NQ')

    // Vérifier la mise à jour
    console.log('\n3. Vérification')
    console.log('-'.repeat(60))

    const verification = await payload.findByID({
      collection: 'users',
      id: user.id,
    })

    console.log('✅ Utilisateur vérifié:')
    console.log('  - Email:', (verification as any).email)
    console.log('  - Name:', (verification as any).name)
    console.log('  - Role:', (verification as any).role)

    // Test de connexion
    console.log('\n4. Test de connexion')
    console.log('-'.repeat(60))

    try {
      const loginResult = await payload.login({
        collection: 'users',
        data: {
          email: 'benjamin@avdigital.fr',
          password: 'vDDzM2Gf3n!*NQ',
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

fixBenjaminUser()
