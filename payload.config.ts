import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import sharp from 'sharp'

// Import collections
import { Users } from './payload/collections/Users'
import { Customers } from './payload/collections/Customers'
import { Pages } from './payload/collections/Pages'
import { Media } from './payload/collections/Media'
import { PricingSettings } from './payload/collections/PricingSettings'
import { Orders } from './payload/collections/Orders'
import { OrdersMinimal } from './payload/collections/Orders-minimal-test'
import { OrdersUltraMinimal } from './payload/collections/Orders-ultra-minimal'
import { ShippingProviders } from './payload/collections/ShippingProviders'
import { Categories } from './payload/collections/Categories'
import { Products } from './payload/collections/Products'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    disable: false,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: '- Exclusives Stickers CMS',
    },
    components: {
      beforeNavLinks: ['@/payload/components/CustomNavWrapper#default'],
    },
  },

  collections: [
    Users,
    Customers,
    Orders,
    OrdersMinimal, // Collection de test minimale
    OrdersUltraMinimal, // Collection ultra-minimale pour tester le bug
    Products,
    Categories,
    Pages,
    Media,
    ShippingProviders,
    PricingSettings,
  ],

  editor: lexicalEditor(),

  secret: process.env.PAYLOAD_SECRET || 'your-secret-key-change-in-production',

  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  db: mongooseAdapter({
    url: (() => {
      const dbUrl = process.env.DATABASE_URL || 'mongodb://localhost:27017/exclusives_stickers'
      console.log('[Payload Config] DATABASE_URL:', dbUrl.substring(0, 50) + '...')
      return dbUrl
    })(),
  }),

  sharp,

  // Configure multi-language support
  localization: {
    locales: ['fr', 'en', 'es', 'it', 'de'],
    defaultLocale: 'fr',
    fallback: true,
  },
})
