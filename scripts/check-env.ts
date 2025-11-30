import dotenv from 'dotenv'
import { resolve } from 'path'

// Load .env files in order (simulating Next.js behavior)
dotenv.config({ path: resolve(process.cwd(), '.env.local') })
dotenv.config({ path: resolve(process.cwd(), '.env') })

console.log('📊 Environment variables:')
console.log('DATABASE_URL:', process.env.DATABASE_URL?.replace(/:[^:]*@/, ':****@'))
console.log('PAYLOAD_SECRET:', process.env.PAYLOAD_SECRET ? '✅ Set' : '❌ Not set')
console.log('NEXT_PUBLIC_SERVER_URL:', process.env.NEXT_PUBLIC_SERVER_URL)
