import { getPayload } from 'payload'
import config from '../payload.config'

async function finalVerification() {
  try {
    console.log('\n✅ VÉRIFICATION FINALE DES COMPTES ADMIN\n')
    console.log('='.repeat(60))

    const payload = await getPayload({ config })

    const accounts = [
      { email: 'contact@avdigital.fr', password: 'AdminContact2024!' },
      { email: 'benjamin@avdigital.fr', password: 'vDDzM2Gf3n!*NQ' },
    ]

    for (const account of accounts) {
      console.log(`\n${account.email}`)
      console.log('-'.repeat(60))

      try {
        const loginResult = await payload.login({
          collection: 'users',
          data: {
            email: account.email,
            password: account.password,
          },
        })

        console.log('✅ LOGIN RÉUSSI')
        console.log('  - Token généré:', loginResult.token ? 'Oui ✅' : 'Non ❌')
        console.log('  - User email:', (loginResult.user as any)?.email)
        console.log('  - User role:', (loginResult.user as any)?.role)
        console.log(`  - Mot de passe: ${account.password}`)
      } catch (error: any) {
        console.log('❌ LOGIN ÉCHOUÉ')
        console.log('  - Erreur:', error.message)
      }
    }

    console.log('\n' + '='.repeat(60))
    console.log('\n📋 RÉSUMÉ')
    console.log('='.repeat(60))
    console.log('\nDomaine de production:')
    console.log('https://stickers-storefront-7an7t52ko-benjaminav2s-projects.vercel.app')
    console.log('\nPage de connexion admin:')
    console.log('https://stickers-storefront-7an7t52ko-benjaminav2s-projects.vercel.app/admin')
    console.log('\nPage de bypass (si nécessaire):')
    console.log('https://stickers-storefront-7an7t52ko-benjaminav2s-projects.vercel.app/bypass-login')
    console.log('\nComptes disponibles:')
    console.log('1. contact@avdigital.fr / AdminContact2024!')
    console.log('2. benjamin@avdigital.fr / vDDzM2Gf3n!*NQ')
    console.log('\n' + '='.repeat(60))
    console.log('VÉRIFICATION TERMINÉE\n')

    process.exit(0)
  } catch (error: any) {
    console.error('\n❌ ERREUR:', error.message)
    console.error(error)
    process.exit(1)
  }
}

finalVerification()
