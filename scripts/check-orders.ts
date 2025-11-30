import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'

dotenv.config()

const MONGODB_URI = process.env.DATABASE_URL || 'mongodb://localhost:27017/exclusives_stickers'

async function checkOrders() {
  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    console.log('✅ Connecté à MongoDB')

    const db = client.db()

    // Compter les commandes
    const ordersCount = await db.collection('orders').countDocuments()
    console.log(`📦 Nombre de commandes: ${ordersCount}`)

    // Compter les customers
    const customersCount = await db.collection('customers').countDocuments()
    console.log(`👥 Nombre de customers: ${customersCount}`)

    // Afficher quelques commandes
    if (ordersCount > 0) {
      console.log('\n📋 Exemples de commandes:')
      const samples = await db.collection('orders').find().limit(3).toArray()
      samples.forEach((order, i) => {
        console.log(`\n${i + 1}. Commande ${order.orderNumber}`)
        console.log(`   Client: ${order.customerName} (${order.customerEmail})`)
        console.log(`   Statut: ${order.status}`)
        console.log(`   Total: ${(order.totalCents / 100).toFixed(2)}€`)
        console.log(`   Créée le: ${new Date(order.createdAt).toLocaleString('fr-FR')}`)
      })
    }

    // Vérifier les indexes
    console.log('\n🔍 Indexes de la collection orders:')
    const indexes = await db.collection('orders').indexes()
    indexes.forEach(idx => {
      console.log(`   - ${idx.name}`)
    })

  } catch (error) {
    console.error('❌ Erreur:', error)
  } finally {
    await client.close()
  }
}

checkOrders()
