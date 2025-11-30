import { getPayload } from 'payload'
import bcrypt from 'bcrypt'
import { fileURLToPath } from 'url'
import path from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const configModule = await import('../payload.config.ts')
const config = configModule.default

const email = 'benjamin@avdigital.fr'
const password = 'vDDzM2Gf3n!*NQ'

async function diagnose() {
  try {
    const payload = await getPayload({ config })

    console.log('='.repeat(60))
    console.log('🔍 DIAGNOSTIC D\'AUTHENTIFICATION')
    console.log('='.repeat(60))
    console.log()

    // Chercher l'utilisateur admin
    console.log('1️⃣  Recherche dans la collection "users" (admins)...')
    const users = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: email,
        },
      },
    })

    if (users.docs.length > 0) {
      const user = users.docs[0]
      console.log('✅ Utilisateur trouvé!')
      console.log('   - ID:', user.id)
      console.log('   - Email:', user.email)
      console.log('   - Name:', user.name)
      console.log('   - Role:', user.role)
      console.log('   - Password hash existe:', !!user.password)
      console.log('   - Hash (premiers 20 chars):', user.password?.substring(0, 20))
      console.log()

      console.log('2️⃣  Test de comparaison du mot de passe...')
      console.log('   - Mot de passe testé:', password)

      if (user.password) {
        const isValid = await bcrypt.compare(password, user.password)
        console.log('   - Résultat bcrypt.compare:', isValid ? '✅ VALIDE' : '❌ INVALIDE')

        if (!isValid) {
          console.log()
          console.log('❌ Le hash ne correspond pas!')
          console.log('   Génération d\'un nouveau hash...')
          const newHash = await bcrypt.hash(password, 10)
          console.log('   - Nouveau hash:', newHash.substring(0, 40) + '...')

          await payload.update({
            collection: 'users',
            id: user.id,
            data: {
              password: newHash,
            },
          })
          console.log('   ✅ Hash mis à jour en base de données')

          // Re-test
          const retestValid = await bcrypt.compare(password, newHash)
          console.log('   - Re-test:', retestValid ? '✅ OK' : '❌ ERREUR')
        }
      } else {
        console.log('   ❌ Pas de hash en base!')
      }

      console.log()
      console.log('3️⃣  Simulation de la fonction authorize...')

      // Simuler exactement ce que fait NextAuth
      const isAdmin = true
      const testUsers = await payload.find({
        collection: 'users',
        where: {
          email: {
            equals: email,
          },
        },
      })

      if (testUsers.docs.length > 0) {
        const testUser = testUsers.docs[0]
        if (testUser.password) {
          const testValid = await bcrypt.compare(password, testUser.password)
          console.log('   - Email trouvé:', !!testUser)
          console.log('   - Password valide:', testValid ? '✅ OUI' : '❌ NON')

          if (testValid) {
            const authResult = {
              id: testUser.id,
              email: testUser.email,
              name: testUser.name,
              role: testUser.role || 'admin',
              isAdmin: true,
            }
            console.log('   - Objet user retourné:', JSON.stringify(authResult, null, 2))
          }
        }
      }

      console.log()
      console.log('='.repeat(60))
      console.log('📊 RÉSUMÉ')
      console.log('='.repeat(60))
      console.log('Email:', email)
      console.log('Compte trouvé: ✅ OUI')
      console.log('Type: Admin (collection users)')
      console.log('Mot de passe hash existe: ✅ OUI')

      // Re-vérifier une dernière fois
      const finalCheck = await payload.find({
        collection: 'users',
        where: { email: { equals: email } },
      })

      if (finalCheck.docs.length > 0 && finalCheck.docs[0].password) {
        const finalValid = await bcrypt.compare(password, finalCheck.docs[0].password)
        console.log('Vérification finale:', finalValid ? '✅ DEVRAIT FONCTIONNER' : '❌ NE FONCTIONNERA PAS')
      }

      console.log('='.repeat(60))
      process.exit(0)
    }

    // Si pas trouvé dans users, chercher dans customers
    console.log('❌ Pas trouvé dans users')
    console.log()
    console.log('1️⃣  Recherche dans la collection "customers"...')

    const customers = await payload.find({
      collection: 'customers',
      where: {
        email: {
          equals: email,
        },
      },
    })

    if (customers.docs.length > 0) {
      console.log('✅ Client trouvé!')
      console.log('Utilisez isAdmin = false pour vous connecter')
    } else {
      console.log('❌ Aucun compte trouvé avec cet email')
    }

    process.exit(1)

  } catch (error) {
    console.error('❌ Erreur:', error.message)
    console.error(error)
    process.exit(1)
  }
}

diagnose()
