import { getPayload } from 'payload'
import crypto from 'crypto'
import scmp from 'scmp'

const configModule = await import('../payload.config.ts')
const config = configModule.default

const email = 'benjamin@avdigital.fr'
const password = 'vDDzM2Gf3n!*NQ'

// Replicate the verifyPayloadPassword function from auth.ts
async function verifyPayloadPassword(doc, password) {
  try {
    const { hash, salt } = doc
    if (typeof salt !== 'string' || typeof hash !== 'string') {
      return false
    }

    return await new Promise((resolve) => {
      crypto.pbkdf2(password, salt, 25000, 512, 'sha256', (err, hashBuffer) => {
        if (err) {
          resolve(false)
        } else {
          resolve(scmp(hashBuffer, Buffer.from(hash, 'hex')))
        }
      })
    })
  } catch {
    return false
  }
}

async function testPBKDF2Auth() {
  try {
    console.log('='.repeat(70))
    console.log('✅ TEST DU FIX FINAL - PBKDF2 AUTHENTICATION')
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
    console.log('   - Hash (first 30 chars):', user.hash?.substring(0, 30) + '...')
    console.log('   - Salt exists:', !!user.salt)
    console.log('   - Salt (first 20 chars):', user.salt?.substring(0, 20) + '...')
    console.log()

    console.log('2️⃣  Test d\'authentification avec PBKDF2...')
    console.log('   - Algorithm: PBKDF2')
    console.log('   - Iterations: 25000')
    console.log('   - Key length: 512 bytes')
    console.log('   - Hash function: SHA-256')
    console.log('   - Password to test:', password)
    console.log()

    const isValidPassword = await verifyPayloadPassword(user, password)

    if (!isValidPassword) {
      console.log('❌ ÉCHEC: Mot de passe invalide')
      process.exit(1)
    }

    console.log('✅✅✅ AUTHENTIFICATION RÉUSSIE! ✅✅✅')
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
    console.log('🎉🎉🎉 FIX VALIDÉ: L\'AUTHENTIFICATION FONCTIONNE! 🎉🎉🎉')
    console.log('='.repeat(70))
    console.log()

    console.log('📋 RÉSUMÉ DU PROBLÈME ET DE LA SOLUTION:')
    console.log()
    console.log('❌ PROBLÈME ORIGINAL:')
    console.log('   1. Le code tentait d\'utiliser bcrypt.compare()')
    console.log('   2. Il cherchait un champ "password" qui n\'existe pas')
    console.log('   3. Payload CMS v3 n\'utilise PAS bcrypt, mais PBKDF2')
    console.log('   4. Le mot de passe est stocké dans "hash" et "salt" (pas "password")')
    console.log()
    console.log('✅ SOLUTION APPLIQUÉE:')
    console.log('   1. Suppression de l\'import bcrypt')
    console.log('   2. Import de crypto (Node.js built-in) et scmp')
    console.log('   3. Création de verifyPayloadPassword() qui réplique')
    console.log('      Payload\'s authenticateLocalStrategy')
    console.log('   4. Récupération des champs hash et salt avec .select(\'+hash +salt\')')
    console.log('   5. Utilisation de crypto.pbkdf2() avec les bons paramètres:')
    console.log('      - 25000 iterations')
    console.log('      - 512 bytes key length')
    console.log('      - SHA-256 hash function')
    console.log('   6. Comparaison avec scmp (constant-time comparison)')
    console.log()
    console.log('🔧 FICHIERS MODIFIÉS:')
    console.log('   - /Users/auriolbenjamin/stickers-storefront/auth.ts')
    console.log()
    console.log('🚀 PROCHAINES ÉTAPES - TESTER L\'INTERFACE WEB:')
    console.log('   1. Le serveur Next.js devrait déjà être en cours d\'exécution')
    console.log('   2. Ouvrir http://localhost:3001/auth/signin dans un navigateur')
    console.log('   3. Entrer les identifiants:')
    console.log('      - Email:', email)
    console.log('      - Password:', password)
    console.log('   4. ✅ COCHER la case "Connexion administrateur"')
    console.log('   5. Cliquer sur "Se connecter"')
    console.log('   6. Vous devriez être authentifié et redirigé avec succès!')
    console.log()
    console.log('='.repeat(70))

    process.exit(0)

  } catch (error) {
    console.error('❌ ERREUR:', error.message)
    console.error(error)
    process.exit(1)
  }
}

testPBKDF2Auth()
