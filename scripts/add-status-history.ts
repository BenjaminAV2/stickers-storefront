import dotenv from 'dotenv'
import { resolve } from 'path'
import { MongoClient } from 'mongodb'

dotenv.config({ path: resolve(process.cwd(), '.env.local') })
dotenv.config({ path: resolve(process.cwd(), '.env') })

async function addStatusHistory() {
  const uri = process.env.DATABASE_URL || ''
  const client = new MongoClient(uri)

  try {
    await client.connect()
    console.log('✅ Connected to MongoDB Atlas')

    const db = client.db()
    const orders = await db.collection('orders').find({}).toArray()

    console.log(`📝 Ajout d'historiques de statuts à ${orders.length} commandes...`)

    for (const order of orders) {
      const history = []
      const createdAt = new Date(order.createdAt)

      // 1. Toujours commencer par pending_payment
      history.push({
        status: 'pending_payment',
        changedAt: createdAt,
        changedBy: 'system',
        note: 'Commande créée',
      })

      const currentStatus = order.status

      // Ajouter les étapes intermédiaires selon le statut actuel
      const statusFlow = {
        pending_payment: [],
        paid_awaiting_bat: [
          {
            status: 'paid_awaiting_bat',
            note: 'Paiement validé, en attente de validation du BAT',
            days: 1,
          },
        ],
        in_production: [
          {
            status: 'paid_awaiting_bat',
            note: 'Paiement validé, en attente de validation du BAT',
            days: 1,
          },
          { status: 'in_production', note: 'BAT validé, mise en production', days: 2 },
        ],
        production_complete: [
          {
            status: 'paid_awaiting_bat',
            note: 'Paiement validé, en attente de validation du BAT',
            days: 1,
          },
          { status: 'in_production', note: 'BAT validé, mise en production', days: 2 },
          { status: 'production_complete', note: 'Production terminée avec succès', days: 5 },
        ],
        preparing_shipment: [
          {
            status: 'paid_awaiting_bat',
            note: 'Paiement validé, en attente de validation du BAT',
            days: 1,
          },
          { status: 'in_production', note: 'BAT validé, mise en production', days: 2 },
          { status: 'production_complete', note: 'Production terminée avec succès', days: 5 },
          { status: 'preparing_shipment', note: 'Commande en préparation pour expédition', days: 7 },
        ],
        in_delivery: [
          {
            status: 'paid_awaiting_bat',
            note: 'Paiement validé, en attente de validation du BAT',
            days: 1,
          },
          { status: 'in_production', note: 'BAT validé, mise en production', days: 2 },
          { status: 'production_complete', note: 'Production terminée avec succès', days: 5 },
          { status: 'preparing_shipment', note: 'Commande en préparation pour expédition', days: 7 },
          { status: 'in_delivery', note: 'Colis remis au transporteur', days: 9 },
        ],
        delivered: [
          {
            status: 'paid_awaiting_bat',
            note: 'Paiement validé, en attente de validation du BAT',
            days: 1,
          },
          { status: 'in_production', note: 'BAT validé, mise en production', days: 2 },
          { status: 'production_complete', note: 'Production terminée avec succès', days: 5 },
          { status: 'preparing_shipment', note: 'Commande en préparation pour expédition', days: 7 },
          { status: 'in_delivery', note: 'Colis remis au transporteur', days: 9 },
          { status: 'delivered', note: 'Commande livrée au client', days: 12 },
        ],
      }

      const flow = statusFlow[currentStatus] || []

      for (const step of flow) {
        const stepDate = new Date(createdAt)
        stepDate.setDate(stepDate.getDate() + step.days)

        history.push({
          status: step.status,
          changedAt: stepDate,
          changedBy: Math.random() > 0.5 ? 'admin' : 'system',
          note: step.note,
        })
      }

      await db.collection('orders').updateOne({ _id: order._id }, { $set: { statusHistory: history } })
    }

    console.log(`✅ ${orders.length} commandes mises à jour avec historiques de statuts`)
  } catch (error) {
    console.error('❌ Error:', error)
    throw error
  } finally {
    await client.close()
  }
}

addStatusHistory()
