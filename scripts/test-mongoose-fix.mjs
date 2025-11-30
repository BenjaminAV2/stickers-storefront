import bcrypt from 'bcrypt'
import { getPayload } from 'payload'

const configModule = await import('../payload.config.ts')
const config = configModule.default

const email = 'benjamin@avdigital.fr'
const password = 'vDDzM2Gf3n!*NQ'

async function testMongooseFix() {
  try {
    console.log('='.repeat(60))
    console.log('🔧 TEST DU FIX MONGOOSE')
    console.log('='.repeat(60))
    console.log()

    const payload = await getPayload({ config })

    console.log('1️⃣  Testing Mongoose Model access...')
    console.log('   - Email:', email)
    console.log()

    // Test the fixed approach - accessing Mongoose model
    console.log('2️⃣  Accessing UserModel from payload.db.collections...')
    const UserModel = payload.db.collections['users']
    console.log('✅ UserModel retrieved successfully')
    console.log('   - Type:', typeof UserModel)
    console.log('   - Has findOne:', typeof UserModel.findOne === 'function')
    console.log('   - Has select:', typeof UserModel.findOne({}).select === 'function')
    console.log()

    // Test the query with +password
    console.log('3️⃣  Querying with .select(\'+password\')...')
    const user = await UserModel.findOne({ email: email })
      .select('+password')
      .lean()

    if (!user) {
      console.log('❌ ÉCHEC: Utilisateur non trouvé')
      process.exit(1)
    }

    console.log('✅ Utilisateur trouvé avec le password field')
    console.log('   - ID:', user._id)
    console.log('   - Email:', user.email)
    console.log('   - Name:', user.name)
    console.log('   - Password hash exists:', !!user.password)
    console.log('   - Password hash (first 30 chars):', user.password?.substring(0, 30))
    console.log()

    // Test password comparison
    console.log('4️⃣  Testing bcrypt.compare...')
    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
      console.log('❌ ÉCHEC: Mot de passe invalide')
      process.exit(1)
    }

    console.log('✅ Mot de passe valide!')
    console.log()

    // Test the return object
    console.log('5️⃣  Building auth return object...')
    const authUser = {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role || 'admin',
      isAdmin: true,
    }
    console.log('✅ Auth object:')
    console.log(JSON.stringify(authUser, null, 2))
    console.log()

    console.log('='.repeat(60))
    console.log('✅ FIX VALIDÉ: L\'AUTHENTIFICATION DEVRAIT FONCTIONNER')
    console.log('='.repeat(60))
    console.log()
    console.log('🎯 Le problème était:')
    console.log('   ❌ Avant: Utilisation de (db as any).collections[\'users\'] comme collection MongoDB')
    console.log('   ✅ Après: Utilisation correcte du Mongoose Model avec .select(\'+password\')')
    console.log()
    console.log('📝 Changements clés:')
    console.log('   1. payload.db.collections[\'users\'] retourne un Mongoose Model')
    console.log('   2. Mongoose Models utilisent .findOne() avec .select(\'+password\')')
    console.log('   3. .lean() retourne un objet JavaScript simple (pas un document Mongoose)')
    console.log()
    console.log('🚀 Prochaines étapes:')
    console.log('   1. Accéder à http://localhost:3001/auth/signin')
    console.log('   2. Utiliser:', email)
    console.log('   3. Mot de passe:', password)
    console.log('   4. Cocher "Connexion administrateur"')
    console.log('   5. Cliquer sur "Se connecter"')
    console.log()

    process.exit(0)

  } catch (error) {
    console.error('❌ ERREUR:', error.message)
    console.error(error)
    process.exit(1)
  }
}

testMongooseFix()
