import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import crypto from 'crypto'
import bcrypt from 'bcrypt'
// @ts-expect-error - no types available
import scmp from 'scmp'

// Verify password using bcrypt (legacy format)
async function verifyBcryptPassword(passwordHash: string, password: string): Promise<boolean> {
  try {
    return await bcrypt.compare(password, passwordHash)
  } catch {
    return false
  }
}

// Payload CMS uses PBKDF2 for password hashing
// This function replicates Payload's authenticateLocalStrategy
async function verifyPayloadPassword(doc: any, password: string): Promise<boolean> {
  try {
    const { hash, salt } = doc
    if (typeof salt !== 'string' || typeof hash !== 'string') {
      return false
    }

    return await new Promise((resolve) => {
      crypto.pbkdf2(password, salt, 25000, 512, 'sha256', (err, hashBuffer) => {
        if (err) {
          resolve(false)
        } else {
          resolve(scmp(hashBuffer, Buffer.from(hash, 'hex')))
        }
      })
    })
  } catch {
    return false
  }
}

// Verify password - tries bcrypt first (legacy), then PBKDF2
async function verifyPassword(doc: any, password: string): Promise<boolean> {
  // If there's a password field (bcrypt), use it
  if (doc.password && typeof doc.password === 'string' && doc.password.startsWith('$2')) {
    console.log('🔍 [AUTH] Using bcrypt verification')
    return await verifyBcryptPassword(doc.password, password)
  }

  // Otherwise, use PBKDF2 (hash + salt fields)
  if (doc.hash && doc.salt) {
    console.log('🔍 [AUTH] Using PBKDF2 verification')
    return await verifyPayloadPassword(doc, password)
  }

  console.log('❌ [AUTH] No valid password format found')
  return false
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },

  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        isAdmin: { label: 'Is Admin', type: 'boolean' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email et mot de passe requis')
        }

        // Import Payload dynamically to avoid edge runtime issues
        const { getPayload } = await import('payload')
        const config = (await import('./payload.config')).default

        const payload = await getPayload({ config })
        const isAdmin = credentials.isAdmin === 'true' || credentials.isAdmin === true

        console.log('🔍 [AUTH] Starting authentication:', {
          email: credentials.email,
          isAdmin,
          hasPassword: !!credentials.password,
        })

        // Si c'est un admin, on cherche dans la collection users de Payload
        if (isAdmin) {
          // Access Mongoose model directly to get hash and salt fields
          const UserModel = payload.db.collections['users']

          console.log('🔍 [AUTH] Searching in users collection...')

          // Query for user with all password fields (bcrypt password, or hash + salt)
          const user = await UserModel.findOne({ email: credentials.email as string })
            .select('+password +hash +salt')
            .lean()

          console.log('🔍 [AUTH] User found:', {
            found: !!user,
            hasPassword: !!(user as any)?.password,
            hasHash: !!(user as any)?.hash,
            hasSalt: !!(user as any)?.salt,
          })

          if (!user) {
            throw new Error('Email ou mot de passe incorrect')
          }

          // Verify password - supports both bcrypt (legacy) and PBKDF2 (Payload)
          const isValidPassword = await verifyPassword(user, credentials.password as string)

          console.log('🔍 [AUTH] Password verification result:', isValidPassword)

          if (!isValidPassword) {
            throw new Error('Email ou mot de passe incorrect')
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role || 'admin',
            isAdmin: true,
          }
        }

        // Sinon, c'est un client (collection customers de Payload)
        // Access Mongoose model directly to get all password fields
        const CustomerModel = payload.db.collections['customers']

        // Query for customer with all password fields (bcrypt password, or hash + salt)
        const customer = await CustomerModel.findOne({ email: credentials.email as string })
          .select('+password +hash +salt')
          .lean()

        if (!customer) {
          throw new Error('Email ou mot de passe incorrect')
        }

        // Verify password - supports both bcrypt (legacy) and PBKDF2 (Payload)
        const isValidPassword = await verifyPassword(customer, credentials.password as string)

        if (!isValidPassword) {
          throw new Error('Email ou mot de passe incorrect')
        }

        return {
          id: customer._id.toString(),
          email: customer.email,
          name: customer.name || customer.firstName + ' ' + customer.lastName,
          role: 'customer',
          isAdmin: false,
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role
        token.isAdmin = (user as any).isAdmin
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.isAdmin = token.isAdmin as boolean
      }
      return session
    },
  },

  debug: process.env.NODE_ENV === 'development',
})
