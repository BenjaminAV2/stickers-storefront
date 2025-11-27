import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcrypt'

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

        // Si c'est un admin, on cherche dans la collection users de Payload
        if (isAdmin) {
          // Access MongoDB directly to get the password field
          // Payload's find() filters out password for security, so we need direct DB access
          const db = payload.db
          const User = (db as any).collections['users']

          const user = await User.findOne({ email: credentials.email as string })

          if (!user) {
            throw new Error('Email ou mot de passe incorrect')
          }

          // Vérifier le mot de passe
          if (!user.password) {
            throw new Error('Utilisateur invalide')
          }

          const isValidPassword = await bcrypt.compare(
            credentials.password as string,
            user.password
          )

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
        // Access MongoDB directly to get the password field
        const db = payload.db
        const Customer = (db as any).collections['customers']

        const customer = await Customer.findOne({ email: credentials.email as string })

        if (!customer) {
          throw new Error('Email ou mot de passe incorrect')
        }

        // Vérifier le mot de passe
        if (!customer.password) {
          throw new Error('Client invalide')
        }

        const isValidPassword = await bcrypt.compare(
          credentials.password as string,
          customer.password
        )

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
