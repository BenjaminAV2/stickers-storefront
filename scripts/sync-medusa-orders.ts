/**
 * Script CLI pour synchroniser manuellement les commandes Medusa
 *
 * Usage:
 *   npm run sync:orders              # Synchroniser toutes les commandes
 *   npm run sync:orders -- --id=XXX  # Synchroniser une commande spécifique
 *   npm run sync:orders -- --status=pending  # Synchroniser par statut
 */

import { syncOrder, syncAllOrders } from '../lib/medusa/sync-orders'

async function main() {
  const args = process.argv.slice(2)

  // Parser les arguments
  const orderId = args.find(arg => arg.startsWith('--id='))?.split('=')[1]
  const status = args.find(arg => arg.startsWith('--status='))?.split('=')[1]
  const limitArg = args.find(arg => arg.startsWith('--limit='))?.split('=')[1]
  const limit = limitArg ? parseInt(limitArg, 10) : undefined

  console.log('='.repeat(60))
  console.log('📦 Synchronisation Medusa → Payload CMS')
  console.log('='.repeat(60))
  console.log()

  try {
    if (orderId) {
      // Synchroniser une commande spécifique
      console.log(`🔄 Synchronisation de la commande: ${orderId}`)
      await syncOrder(orderId)
      console.log(`✅ Commande ${orderId} synchronisée avec succès`)
    } else {
      // Synchroniser toutes les commandes
      console.log('🔄 Synchronisation de toutes les commandes...')
      if (status) {
        console.log(`   Filtre: status = ${status}`)
      }
      if (limit) {
        console.log(`   Limite: ${limit} commandes par page`)
      }
      console.log()

      await syncAllOrders({ status, limit })
      console.log()
      console.log('✅ Toutes les commandes ont été synchronisées')
    }

    console.log()
    console.log('='.repeat(60))
    console.log('✨ Synchronisation terminée avec succès')
    console.log('='.repeat(60))

    process.exit(0)
  } catch (error) {
    console.error()
    console.error('='.repeat(60))
    console.error('❌ Erreur lors de la synchronisation')
    console.error('='.repeat(60))
    console.error()
    console.error(error)
    process.exit(1)
  }
}

main()
