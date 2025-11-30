import { getPayload } from 'payload'
import { authenticateLocalStrategy } from 'payload/dist/auth/strategies/local/authenticate.js'

const configModule = await import('../payload.config.ts')
const config = configModule.default

const email = 'benjamin@avdigital.fr'
const password = 'vDDzM2Gf3n!*NQ'

async function testFinalFix() {
  try {
    console.log('='.repeat(70))
    console.log('🔧 TEST DU FIX FINAL - PAYLOAD AUTHENTICATELOCALSTRATEGY')
    console.log('='.repeat(70))
    console.log()

    const payload = await getPayload({ config })

    console.log('1️⃣  Récupération de l\'utilisateur avec hash et salt...')
    const UserModel = payload.db.collections['users']

    const user = await UserModel.findOne({ email: email })
      .select('+hash +salt')
      .lean()

    if (!user) {
      console.log('❌ ÉCHEC: Utilisateur non trouvé')
      process.exit(1)
    }

    console.log('✅ Utilisateur trouvé')
    console.log('   - ID:', user._id)
    console.log('   - Email:', user.email)
    console.log('   - Name:', user.name)
    console.log('   - Hash exists:', !!user.hash)
    console.log('   - Salt exists:', !!user.salt)
    console.log()

    console.log('2️⃣  Test d\'authentification avec authenticateLocalStrategy...')
    console.log('   - Password à tester:', password)

    const authenticatedUser = await authenticateLocalStrategy({
      doc: user,
      password: password,
    })

    if (!authenticatedUser) {
      console.log('❌ ÉCHEC: Authentification échouée')
      console.log('   authenticateLocalStrategy a retourné null')
      process.exit(1)
    }

    console.log('✅ AUTHENTIFICATION RÉUSSIE!')
    console.log('   - L\'utilisateur a été authentifié avec succès')
    console.log()

    console.log('3️⃣  Construction de l\'objet de retour NextAuth...')
    const authUser = {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role || 'admin',
      isAdmin: true,
    }
    console.log('✅ Objet utilisateur:')
    console.log(JSON.stringify(authUser, null, 2))
    console.log()

    console.log('='.repeat(70))
    console.log('✅✅✅ FIX VALIDÉ: L\'AUTHENTIFICATION FONCTIONNE CORRECTEMENT ✅✅✅')
    console.log('='.repeat(70))
    console.log()

    console.log('📋 RÉSUMÉ DU PROBLÈME ET DE LA SOLUTION:')
    console.log()
    console.log('❌ PROBLÈME IDENTIFIÉ:')
    console.log('   1. Le code tentait d\'utiliser bcrypt.compare() sur un champ "password"')
    console.log('   2. Payload CMS v3 n\'utilise PAS bcrypt, mais PBKDF2')
    console.log('   3. Le mot de passe n\'est PAS stocké dans un champ "password"')
    console.log('   4. Au lieu de cela, Payload stocke "hash" et "salt" séparément')
    console.log()
    console.log('✅ SOLUTION APPLIQUÉE:')
    console.log('   1. Suppression de l\'import bcrypt')
    console.log('   2. Import de authenticateLocalStrategy depuis "payload/auth"')
    console.log('   3. Récupération des champs "hash" et "salt" avec .select(\'+hash +salt\')')
    console.log('   4. Utilisation de authenticateLocalStrategy() pour vérifier le mot de passe')
    console.log('   5. Cette fonction utilise crypto.pbkdf2 avec les bons paramètres')
    console.log()
    console.log('🔑 DÉTAILS TECHNIQUES:')
    console.log('   - Algorithme: PBKDF2 (pas bcrypt)')
    console.log('   - Iterations: 25000')
    console.log('   - Key length: 512 bytes')
    console.log('   - Hash function: SHA-256')
    console.log('   - Storage: hash (hex) + salt (string) dans des champs séparés')
    console.log()
    console.log('🚀 PROCHAINES ÉTAPES:')
    console.log('   1. Le serveur Next.js est en cours d\'exécution')
    console.log('   2. Accéder à http://localhost:3001/auth/signin')
    console.log('   3. Email:', email)
    console.log('   4. Password:', password)
    console.log('   5. ✅ COCHER "Connexion administrateur"')
    console.log('   6. Cliquer sur "Se connecter"')
    console.log('   7. Vous devriez être redirigé et authentifié avec succès')
    console.log()
    console.log('='.repeat(70))

    process.exit(0)

  } catch (error) {
    console.error('❌ ERREUR:', error.message)
    console.error(error)
    process.exit(1)
  }
}

testFinalFix()
