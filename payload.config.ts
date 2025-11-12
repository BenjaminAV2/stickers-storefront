import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import sharp from 'sharp'

// Import collections
import { Users } from './payload/collections/Users'
import { Pages } from './payload/collections/Pages'
import { Media } from './payload/collections/Media'
import { PricingSettings } from './payload/collections/PricingSettings'
import { Orders } from './payload/collections/Orders'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: '- Exclusives Stickers CMS',
    },
  },

  collections: [Users, Pages, Media, PricingSettings, Orders],

  editor: lexicalEditor(),

  secret: process.env.PAYLOAD_SECRET || 'your-secret-key-change-in-production',

  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  db: mongooseAdapter({
    url: process.env.DATABASE_URL || 'mongodb://localhost:27017/exclusives_stickers',
  }),

  sharp,

  // Configure multi-language support
  localization: {
    locales: ['fr', 'en', 'es', 'it', 'de'],
    defaultLocale: 'fr',
    fallback: true,
  },
})
