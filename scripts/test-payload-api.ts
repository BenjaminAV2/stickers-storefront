import { getPayload } from 'payload'
import config from '../payload.config'

async function testPayloadAPI() {
  try {
    console.log('🔄 Initialisation de Payload...')
    const payload = await getPayload({ config })

    console.log('✅ Payload initialisé\n')

    // Test 1: Fetch orders-minimal
    console.log('📊 Test 1: Récupération des orders-minimal...')
    try {
      const minimalOrders = await payload.find({
        collection: 'orders-minimal',
        limit: 10,
      })
      console.log(`✅ Orders-minimal trouvés: ${minimalOrders.totalDocs}`)
      console.log('Docs:', JSON.stringify(minimalOrders.docs, null, 2))
    } catch (error) {
      console.error('❌ Erreur orders-minimal:', error)
    }

    // Test 2: Fetch orders
    console.log('\n📊 Test 2: Récupération des orders...')
    try {
      const orders = await payload.find({
        collection: 'orders',
        limit: 10,
        depth: 0, // No depth to avoid relationship issues
      })
      console.log(`✅ Orders trouvés: ${orders.totalDocs}`)
      console.log('Premier order:', JSON.stringify(orders.docs[0], null, 2))
    } catch (error) {
      console.error('❌ Erreur orders:', error)
    }

    // Test 3: Direct count
    console.log('\n📊 Test 3: Count direct...')
    try {
      const count = await payload.count({
        collection: 'orders',
      })
      console.log(`✅ Count orders: ${count.totalDocs}`)
    } catch (error) {
      console.error('❌ Erreur count:', error)
    }

    process.exit(0)
  } catch (error) {
    console.error('❌ Erreur:', error)
    process.exit(1)
  }
}

testPayloadAPI()
