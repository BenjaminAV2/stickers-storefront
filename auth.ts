import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'

const MEDUSA_API_URL = process.env.NEXT_PUBLIC_MEDUSA_API_URL || 'https://backend-production-f3de.up.railway.app'

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
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email et mot de passe requis')
        }

        try {
          // Authenticate with Medusa customer API
          const response = await fetch(`${MEDUSA_API_URL}/auth/customer/emailpass`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          })

          if (!response.ok) {
            throw new Error('Email ou mot de passe incorrect')
          }

          const data = await response.json()

          if (data.token) {
            // Get customer details
            const customerResponse = await fetch(`${MEDUSA_API_URL}/store/customers/me`, {
              headers: {
                'Authorization': `Bearer ${data.token}`,
              },
            })

            if (customerResponse.ok) {
              const customerData = await customerResponse.json()
              const customer = customerData.customer

              return {
                id: customer.id,
                email: customer.email,
                name: `${customer.first_name || ''} ${customer.last_name || ''}`.trim() || customer.email,
                role: 'customer',
                isAdmin: false,
                token: data.token,
              }
            }
          }

          throw new Error('Échec de l\'authentification')
        } catch (error) {
          console.error('[AUTH] Error:', error)
          throw new Error('Email ou mot de passe incorrect')
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role
        token.medusaToken = (user as any).token
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        ;(session as any).medusaToken = token.medusaToken
      }
      return session
    },
  },

  debug: process.env.NODE_ENV === 'development',
})
