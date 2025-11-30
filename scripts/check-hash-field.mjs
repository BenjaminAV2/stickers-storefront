import { getPayload } from 'payload'

const configModule = await import('../payload.config.ts')
const config = configModule.default

const email = 'benjamin@avdigital.fr'

async function checkHashField() {
  try {
    console.log('Checking hash field in database...\n')

    const payload = await getPayload({ config })
    const UserModel = payload.db.collections['users']

    // Query with all fields
    const user = await UserModel.findOne({ email: email }).lean()

    if (!user) {
      console.log('User not found!')
      process.exit(1)
    }

    console.log('User fields:')
    console.log('  - _id:', user._id)
    console.log('  - email:', user.email)
    console.log('  - name:', user.name)
    console.log('  - password:', user.password)
    console.log('  - hash:', user.hash?.substring(0, 30) + '...')
    console.log('  - salt:', user.salt?.substring(0, 20) + '...')
    console.log('\n  All fields:', Object.keys(user))

    process.exit(0)
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

checkHashField()
