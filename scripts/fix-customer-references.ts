import { MongoClient, ObjectId } from 'mongodb'
import dotenv from 'dotenv'

dotenv.config()

const MONGODB_URI = process.env.DATABASE_URL || 'mongodb://localhost:27017/exclusives_stickers'

async function fixCustomerReferences() {
  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    console.log('✅ Connecté à MongoDB')

    const db = client.db()

    // Récupérer tous les customers
    const customers = await db.collection('customers').find({}).toArray()
    console.log(`📋 ${customers.length} customers trouvés`)

    // Récupérer toutes les commandes
    const orders = await db.collection('orders').find({}).toArray()
    console.log(`📦 ${orders.length} commandes trouvées`)

    let fixed = 0
    let errors = 0

    for (const order of orders) {
      try {
        // Si customer est null ou invalide
        if (!order.customer || typeof order.customer === 'string') {
          // Trouver le customer par email
          const customer = customers.find(c => c.email === order.customerEmail)

          if (customer) {
            // Mettre à jour avec la référence correcte
            await db.collection('orders').updateOne(
              { _id: order._id },
              { $set: { customer: customer._id } }
            )
            fixed++
            console.log(`✓ Commande ${order.orderNumber} corrigée (customer: ${customer.email})`)
          } else {
            console.log(`⚠️  Pas de customer trouvé pour ${order.customerEmail}`)
            errors++
          }
        }
      } catch (error) {
        console.error(`❌ Erreur sur commande ${order.orderNumber}:`, error)
        errors++
      }
    }

    console.log(`\n✅ Correction terminée:`)
    console.log(`  - Commandes corrigées: ${fixed}`)
    console.log(`  - Erreurs: ${errors}`)

  } catch (error) {
    console.error('❌ Erreur:', error)
  } finally {
    await client.close()
  }
}

fixCustomerReferences()
