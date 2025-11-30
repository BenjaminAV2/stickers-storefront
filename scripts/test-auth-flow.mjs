import bcrypt from 'bcrypt'
import { getPayload } from 'payload'
import { fileURLToPath } from 'url'
import path from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const configModule = await import('../payload.config.ts')
const config = configModule.default

const email = 'benjamin@avdigital.fr'
const password = 'vDDzM2Gf3n!*NQ'

async function testAuthFlow() {
  try {
    console.log('='.repeat(60))
    console.log('🧪 TEST DU FLUX D\'AUTHENTIFICATION COMPLET')
    console.log('='.repeat(60))
    console.log()

    const payload = await getPayload({ config })

    // 1. Simuler exactement ce que fait auth.ts
    console.log('1️⃣  Simulation de la fonction authorize de NextAuth...')
    console.log('   - Email:', email)
    console.log('   - Password:', password)
    console.log('   - isAdmin: true')
    console.log()

    // 2. Chercher l'utilisateur dans la collection users
    console.log('2️⃣  Recherche dans la collection "users"...')
    const users = await payload.find({
      collection: 'users',
      where: {
        email: { equals: email }
      }
    })

    if (users.docs.length === 0) {
      console.log('❌ ÉCHEC: Utilisateur non trouvé')
      process.exit(1)
    }

    console.log('✅ Utilisateur trouvé')
    const user = users.docs[0]
    console.log('   - ID:', user.id)
    console.log('   - Email:', user.email)
    console.log('   - Name:', user.name)
    console.log()

    // 3. Vérifier que le password existe
    console.log('3️⃣  Vérification du hash password...')
    if (!user.password) {
      console.log('❌ ÉCHEC: Pas de password hash en base')
      process.exit(1)
    }
    console.log('✅ Password hash existe')
    console.log('   - Hash (30 premiers chars):', user.password.substring(0, 30))
    console.log()

    // 4. Comparer le mot de passe (comme le fait auth.ts)
    console.log('4️⃣  Comparaison bcrypt du mot de passe...')
    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
      console.log('❌ ÉCHEC: Mot de passe invalide')
      console.log('   Le hash ne correspond pas au mot de passe fourni')
      process.exit(1)
    }
    console.log('✅ Mot de passe valide')
    console.log()

    // 5. Construire l'objet user retourné (comme le fait auth.ts)
    console.log('5️⃣  Construction de l\'objet utilisateur retourné...')
    const authUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role || 'admin',
      isAdmin: true
    }
    console.log('✅ Objet utilisateur:')
    console.log(JSON.stringify(authUser, null, 2))
    console.log()

    // 6. Résumé final
    console.log('='.repeat(60))
    console.log('✅ RÉSULTAT FINAL: AUTHENTIFICATION RÉUSSIE')
    console.log('='.repeat(60))
    console.log()
    console.log('📋 Détails de connexion:')
    console.log('   📧 Email:', email)
    console.log('   🔑 Mot de passe:', password)
    console.log('   ✅ Validation bcrypt: SUCCÈS')
    console.log('   👤 Utilisateur ID:', user.id)
    console.log('   🔐 Type: Admin (cochez "Connexion administrateur")')
    console.log()
    console.log('🎯 Prochaines étapes:')
    console.log('   1. Accéder à http://localhost:3001/auth/signin')
    console.log('   2. Entrer email:', email)
    console.log('   3. Entrer mot de passe:', password)
    console.log('   4. COCHER la case "Connexion administrateur"')
    console.log('   5. Cliquer sur "Se connecter"')
    console.log('   → Devrait rediriger vers la page d\'accueil avec session active')
    console.log()
    console.log('='.repeat(60))

    process.exit(0)

  } catch (error) {
    console.error('❌ ERREUR:', error.message)
    console.error(error)
    process.exit(1)
  }
}

testAuthFlow()
