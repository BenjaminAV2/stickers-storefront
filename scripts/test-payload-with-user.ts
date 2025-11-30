import { getPayload } from 'payload'
import config from '../payload.config'

async function testPayloadWithUser() {
  try {
    console.log('🔄 Initialisation de Payload...')
    const payload = await getPayload({ config })

    console.log('✅ Payload initialisé\n')

    // Test 1: Find with no user context
    console.log('📊 Test 1: Find sans contexte utilisateur...')
    try {
      const result1 = await payload.find({
        collection: 'orders-minimal',
        limit: 10,
        overrideAccess: false, // Respect access control
      })
      console.log(`Results: ${result1.totalDocs} docs`)
    } catch (error) {
      console.error('❌ Erreur:', error instanceof Error ? error.message : error)
    }

    // Test 2: Find with override access
    console.log('\n📊 Test 2: Find avec overrideAccess=true...')
    try {
      const result2 = await payload.find({
        collection: 'orders-minimal',
        limit: 10,
        overrideAccess: true, // Bypass access control
      })
      console.log(`Results: ${result2.totalDocs} docs`)
      if (result2.docs.length > 0) {
        console.log('Premier doc:', JSON.stringify(result2.docs[0], null, 2))
      }
    } catch (error) {
      console.error('❌ Erreur:', error instanceof Error ? error.message : error)
    }

    // Test 3: Find orders with override access
    console.log('\n📊 Test 3: Find orders avec overrideAccess=true...')
    try {
      const result3 = await payload.find({
        collection: 'orders',
        limit: 5,
        overrideAccess: true,
        depth: 0,
      })
      console.log(`Results: ${result3.totalDocs} docs`)
      if (result3.docs.length > 0) {
        console.log('Premier order:', JSON.stringify(result3.docs[0], null, 2))
      }
    } catch (error) {
      console.error('❌ Erreur:', error instanceof Error ? error.message : error)
    }

    // Test 4: Raw MongoDB query via Payload
    console.log('\n📊 Test 4: Direct MongoDB query...')
    try {
      const db = payload.db
      // @ts-ignore - accessing internal db connection
      const rawCount = await db.connection.db.collection('orders-minimal').countDocuments()
      console.log(`Direct MongoDB count: ${rawCount}`)
    } catch (error) {
      console.error('❌ Erreur:', error instanceof Error ? error.message : error)
    }

    process.exit(0)
  } catch (error) {
    console.error('❌ Erreur globale:', error)
    process.exit(1)
  }
}

testPayloadWithUser()
