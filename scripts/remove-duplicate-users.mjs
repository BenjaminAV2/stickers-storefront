import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'

dotenv.config()

const email = 'benjamin@avdigital.fr'

async function removeDuplicates() {
  const client = new MongoClient(process.env.DATABASE_URL)

  try {
    await client.connect()
    console.log('✅ Connecté à MongoDB')

    const db = client.db('exclusives_stickers')
    const usersCollection = db.collection('users')

    // Trouver TOUS les utilisateurs avec cet email
    const users = await usersCollection.find({ email }).toArray()

    console.log()
    console.log('🔍 Utilisateurs trouvés:', users.length)
    console.log()

    if (users.length === 0) {
      console.log('❌ Aucun utilisateur trouvé')
      process.exit(1)
    }

    if (users.length === 1) {
      console.log('✅ Un seul utilisateur (pas de doublon)')
      console.log('   ID:', users[0]._id)
      console.log('   Password:', users[0].password ? `Existe (${users[0].password.substring(0, 20)}...)` : 'Manquant')
      process.exit(0)
    }

    // Afficher tous les utilisateurs trouvés
    console.log('⚠️  DOUBLONS DÉTECTÉS!')
    console.log()
    users.forEach((user, index) => {
      console.log(`Utilisateur ${index + 1}:`)
      console.log('   ID:', user._id)
      console.log('   Email:', user.email)
      console.log('   Name:', user.name)
      console.log('   Password:', user.password ? `Existe (${user.password.substring(0, 20)}...)` : 'MANQUANT ❌')
      console.log('   Created:', user.createdAt)
      console.log()
    })

    // Trouver celui qui a le password
    const userWithPassword = users.find(u => u.password)
    const usersWithoutPassword = users.filter(u => !u.password)

    if (!userWithPassword) {
      console.log('❌ Aucun utilisateur n\'a de password!')
      process.exit(1)
    }

    console.log('✅ Utilisateur à CONSERVER (avec password):')
    console.log('   ID:', userWithPassword._id)
    console.log()

    // Supprimer les utilisateurs sans password
    for (const user of usersWithoutPassword) {
      console.log('🗑️  Suppression du doublon SANS password:')
      console.log('   ID:', user._id)

      const result = await usersCollection.deleteOne({ _id: user._id })
      console.log('   Résultat:', result.deletedCount, 'document(s) supprimé(s)')
      console.log()
    }

    // Vérification finale
    const remaining = await usersCollection.find({ email }).toArray()
    console.log('✅ Vérification finale:')
    console.log('   Utilisateurs restants:', remaining.length)

    if (remaining.length === 1) {
      console.log('   ✅ Un seul utilisateur (doublon supprimé)')
      console.log('   ID:', remaining[0]._id)
      console.log('   Password existe:', !!remaining[0].password)
    }

    await client.close()
    process.exit(0)

  } catch (error) {
    console.error('❌ Erreur:', error.message)
    await client.close()
    process.exit(1)
  }
}

removeDuplicates()
