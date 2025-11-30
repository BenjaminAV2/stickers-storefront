import { getPayload } from 'payload'
import config from '../payload.config'
import dotenv from 'dotenv'
import { resolve } from 'path'

// Load .env files explicitly
dotenv.config({ path: resolve(process.cwd(), '.env.local') })
dotenv.config({ path: resolve(process.cwd(), '.env') })

async function checkPayloadDbName() {
  try {
    console.log('🔄 Initialisation de Payload...')
    const payload = await getPayload({ config })

    console.log('✅ Payload initialisé\n')

    // @ts-ignore - accessing internal db connection
    const db = payload.db.connection

    console.log('📊 Informations de connexion Payload:')
    console.log('Database name:', db.name)
    console.log('Host:', db.host)

    // List all collections
    const collections = await db.db.listCollections().toArray()
    console.log('\n📚 Collections disponibles:')
    collections.forEach((col: any) => {
      console.log(`   - ${col.name}`)
    })

    // Count documents in each collection
    console.log('\n📊 Nombre de documents par collection:')
    for (const col of collections) {
      const count = await db.db.collection(col.name).countDocuments()
      console.log(`   - ${col.name}: ${count} documents`)
    }

    process.exit(0)
  } catch (error) {
    console.error('❌ Erreur:', error)
    process.exit(1)
  }
}

checkPayloadDbName()
