import { getPayload } from 'payload'

const configModule = await import('../payload.config.ts')
const config = configModule.default

async function checkSchema() {
  try {
    const payload = await getPayload({ config })
    const model = payload.db.collections['users']

    console.log('Schema paths:', Object.keys(model.schema.paths))
    console.log('\nPassword field config:')
    if (model.schema.paths.password) {
      const pwdPath = model.schema.paths.password
      console.log('  - Type:', pwdPath.instance)
      console.log('  - Selected:', pwdPath.selected)
      console.log('  - Options:', JSON.stringify(pwdPath.options, null, 4))
    } else {
      console.log('  - Password field not found in schema!')
    }

    process.exit(0)
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

checkSchema()
