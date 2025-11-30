import { MongoClient } from 'mongodb'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'

dotenv.config()

const email = 'benjamin@avdigital.fr'
const password = 'vDDzM2Gf3n!*NQ'

async function directFix() {
  const client = new MongoClient(process.env.DATABASE_URL)

  try {
    await client.connect()
    console.log('✅ Connecté à MongoDB')

    const db = client.db('exclusives_stickers')
    const usersCollection = db.collection('users')

    // Trouver l'utilisateur
    const user = await usersCollection.findOne({ email })

    if (!user) {
      console.log('❌ Utilisateur non trouvé')
      process.exit(1)
    }

    console.log('✅ Utilisateur trouvé:', email)
    console.log('   ID:', user._id)
    console.log('   Password actuel:', user.password ? 'Existe' : 'Manquant')

    // Générer le hash
    console.log('🔄 Génération du hash bcrypt...')
    const hashedPassword = await bcrypt.hash(password, 10)
    console.log('   Hash généré (premiers 30 chars):', hashedPassword.substring(0, 30))

    // Mettre à jour directement en BDD
    console.log('🔄 Mise à jour en base de données...')
    const result = await usersCollection.updateOne(
      { _id: user._id },
      { $set: { password: hashedPassword } }
    )

    console.log('✅ Résultat:', result.modifiedCount, 'document(s) modifié(s)')

    // Vérifier
    const updated = await usersCollection.findOne({ email })
    console.log('\n📋 Vérification finale:')
    console.log('   Password hash existe:', !!updated.password)
    console.log('   Hash (premiers 30 chars):', updated.password?.substring(0, 30))

    // Test du hash
    console.log('\n🧪 Test de comparaison bcrypt...')
    const isValid = await bcrypt.compare(password, updated.password)
    console.log('   Résultat:', isValid ? '✅ VALIDE' : '❌ INVALIDE')

    console.log('\n' + '='.repeat(60))
    console.log('📧 Email:', email)
    console.log('🔑 Mot de passe:', password)
    console.log('✅ Status:', isValid ? 'PRÊT À UTILISER' : 'ERREUR')
    console.log('='.repeat(60))

    await client.close()
    process.exit(0)

  } catch (error) {
    console.error('❌ Erreur:', error.message)
    await client.close()
    process.exit(1)
  }
}

directFix()
