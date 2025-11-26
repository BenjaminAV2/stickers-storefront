import { getPayload } from 'payload'
import config from '../payload.config'
import * as bcrypt from 'bcrypt'

async function diagnoseAuth() {
  try {
    console.log('\n🔍 DIAGNOSTIC D\'AUTHENTIFICATION\n')
    console.log('='.repeat(60))

    const payload = await getPayload({ config })

    // 1. Vérifier la connexion à la base de données
    console.log('\n1. VÉRIFICATION BASE DE DONNÉES')
    console.log('-'.repeat(60))
    const dbConnection = await payload.db.connection
    console.log('✅ Connexion MongoDB réussie:', dbConnection.name)

    // 2. Lister tous les utilisateurs
    console.log('\n2. LISTE DE TOUS LES UTILISATEURS')
    console.log('-'.repeat(60))
    const allUsers = await payload.find({
      collection: 'users',
      limit: 100,
    })

    console.log(`Nombre total d'utilisateurs: ${allUsers.totalDocs}`)
    allUsers.docs.forEach((user: any, index: number) => {
      console.log(`\nUtilisateur ${index + 1}:`)
      console.log(`  - ID: ${user.id}`)
      console.log(`  - Email: ${user.email}`)
      console.log(`  - Name: ${user.name}`)
      console.log(`  - Role: ${user.role}`)
      console.log(`  - Login Attempts: ${user.loginAttempts || 0}`)
      console.log(`  - Lock Until: ${user.lockUntil || 'Non verrouillé'}`)
      console.log(`  - Password Hash présent: ${user.password ? 'Oui' : 'Non'}`)
      console.log(`  - Password Hash (premiers 20 chars): ${user.password ? user.password.substring(0, 20) + '...' : 'N/A'}`)
    })

    // 3. Tester le mot de passe pour contact@avdigital.fr
    console.log('\n3. TEST DU MOT DE PASSE')
    console.log('-'.repeat(60))

    const testUser = allUsers.docs.find((u: any) => u.email === 'contact@avdigital.fr')
    if (testUser) {
      console.log(`\nTest pour: ${testUser.email}`)

      const testPasswords = [
        'vDDzM2Gf3n!*NQ',
        'AdminContact2024!',
      ]

      for (const testPassword of testPasswords) {
        try {
          const isValid = testUser.password ? await bcrypt.compare(testPassword, testUser.password) : false
          console.log(`  - Mot de passe "${testPassword}": ${isValid ? '✅ VALIDE' : '❌ INVALIDE'}`)
        } catch (error: any) {
          console.log(`  - Mot de passe "${testPassword}": ❌ ERREUR - ${error.message}`)
        }
      }
    } else {
      console.log('❌ Utilisateur contact@avdigital.fr non trouvé')
    }

    // 4. Tester la méthode de login de Payload
    console.log('\n4. TEST DE LA MÉTHODE LOGIN DE PAYLOAD')
    console.log('-'.repeat(60))

    try {
      const loginResult = await payload.login({
        collection: 'users',
        data: {
          email: 'contact@avdigital.fr',
          password: 'AdminContact2024!',
        },
      })
      console.log('✅ Login réussi!')
      console.log('Token:', loginResult.token ? loginResult.token.substring(0, 50) + '...' : 'N/A')
      console.log('User:', loginResult.user?.email)
    } catch (error: any) {
      console.log('❌ Login échoué:', error.message)
      console.log('Erreur complète:', error)
    }

    // 5. Vérifier la configuration auth
    console.log('\n5. CONFIGURATION AUTH')
    console.log('-'.repeat(60))
    const usersConfig = payload.config.collections.find((c: any) => c.slug === 'users')
    if (usersConfig && typeof usersConfig.auth === 'object') {
      console.log('Configuration auth trouvée:')
      console.log('  - maxLoginAttempts:', (usersConfig.auth as any).maxLoginAttempts)
      console.log('  - lockTime:', (usersConfig.auth as any).lockTime)
    }

    console.log('\n' + '='.repeat(60))
    console.log('DIAGNOSTIC TERMINÉ\n')
    process.exit(0)
  } catch (error: any) {
    console.error('\n❌ ERREUR FATALE:', error.message)
    console.error(error)
    process.exit(1)
  }
}

diagnoseAuth()
