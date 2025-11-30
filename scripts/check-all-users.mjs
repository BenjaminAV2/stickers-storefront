import { MongoClient, ObjectId } from 'mongodb'
import dotenv from 'dotenv'

dotenv.config()

const email = 'benjamin@avdigital.fr'

async function checkAll() {
  const client = new MongoClient(process.env.DATABASE_URL)

  try {
    await client.connect()
    console.log('✅ Connecté à MongoDB Atlas')

    const db = client.db('exclusives_stickers')
    const usersCollection = db.collection('users')

    // Compter TOUS les utilisateurs
    const totalUsers = await usersCollection.countDocuments()
    console.log('\n📊 Total utilisateurs dans la collection:', totalUsers)

    // Trouver TOUS les utilisateurs avec cet email
    const users = await usersCollection.find({ email }).toArray()
    console.log('📧 Utilisateurs avec email', email + ':', users.length)
    console.log()

    if (users.length > 0) {
      users.forEach((user, index) => {
        console.log(`Utilisateur ${index + 1}:`)
        console.log('   _id:', user._id)
        console.log('   id:', user.id)
        console.log('   email:', user.email)
        console.log('   name:', user.name)
        console.log('   password:', user.password ? `EXISTS (${user.password.substring(0, 25)}...)` : 'MISSING ❌')
        console.log('   createdAt:', user.createdAt)
        console.log('   updatedAt:', user.updatedAt)
        console.log()
      })
    }

    // Chercher aussi par les deux IDs spécifiques
    console.log('🔍 Recherche par IDs spécifiques:')
    console.log()

    const user1 = await usersCollection.findOne({ _id: new ObjectId('6915f72382e7455ba893599b') })
    if (user1) {
      console.log('✅ Utilisateur 6915f72382e7455ba893599b trouvé:')
      console.log('   email:', user1.email)
      console.log('   password:', user1.password ? 'EXISTS' : 'MISSING')
    } else {
      console.log('❌ Utilisateur 6915f72382e7455ba893599b NOT FOUND')
    }
    console.log()

    const user2 = await usersCollection.findOne({ _id: new ObjectId('6914a9bfc7b1d1a1063eb24f') })
    if (user2) {
      console.log('✅ Utilisateur 6914a9bfc7b1d1a1063eb24f trouvé:')
      console.log('   email:', user2.email)
      console.log('   password:', user2.password ? 'EXISTS' : 'MISSING')
    } else {
      console.log('❌ Utilisateur 6914a9bfc7b1d1a1063eb24f NOT FOUND')
    }
    console.log()

    // Liste de TOUS les utilisateurs
    console.log('📋 TOUS les utilisateurs dans la base:')
    const allUsers = await usersCollection.find().toArray()
    allUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email || 'NO EMAIL'} - ID: ${user._id} - Password: ${user.password ? 'YES' : 'NO'}`)
    })

    await client.close()
    process.exit(0)

  } catch (error) {
    console.error('❌ Erreur:', error.message)
    await client.close()
    process.exit(1)
  }
}

checkAll()
