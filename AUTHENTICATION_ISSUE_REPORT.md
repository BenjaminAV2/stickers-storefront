# Rapport de Problème d'Authentification - Stickers Storefront

## 📋 Résumé du Problème

**Problème**: L'authentification NextAuth.js ne fonctionne pas malgré plusieurs tentatives de correction.
**Impact**: Impossible de se connecter en tant qu'administrateur ou client
**Environnements affectés**: Local ET Production
**Date**: 27 novembre 2025

---

## 🏗️ Architecture du Projet

### Stack Technique
- **Framework**: Next.js 16.0.1 (App Router)
- **Authentification**: NextAuth.js v5 (next-auth@5.0.0-beta.25)
- **CMS**: Payload CMS v3
- **Base de données**: MongoDB Atlas
- **Déploiement**: Vercel
- **Hashing**: bcrypt

### Structure des Collections

#### Collection `users` (Admins)
```typescript
{
  _id: ObjectId,
  email: string,
  name: string,
  role: 'admin' | 'editor',
  password: string (bcrypt hash),
  createdAt: Date,
  updatedAt: Date
}
```

#### Collection `customers` (Clients)
```typescript
{
  _id: ObjectId,
  email: string,
  name: string,
  firstName: string,
  lastName: string,
  password: string (bcrypt hash),
  createdAt: Date,
  updatedAt: Date
}
```

---

## 📁 Fichiers Importants

### 1. `/auth.ts` - Configuration NextAuth

```typescript
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
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.isAdmin = token.isAdmin as boolean
      }
      return session
    },
  },
})
```

### 2. `/app/auth/signin/page.tsx` - Page de connexion

```typescript
'use client'

import { useState, Suspense } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

function SignInContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        isAdmin: isAdmin.toString(),
        redirect: false,
      })

      if (result?.error) {
        setError('Email ou mot de passe incorrect')
      } else {
        router.push(callbackUrl)
        router.refresh()
      }
    } catch (error) {
      setError('Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Connexion
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {isAdmin ? 'Espace Administrateur' : 'Espace Client'}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Mot de passe
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Mot de passe"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="isAdmin"
                name="isAdmin"
                type="checkbox"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="isAdmin" className="ml-2 block text-sm text-gray-900">
                Connexion administrateur
              </label>
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{error}</h3>
                </div>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </div>

          {!isAdmin && (
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Pas encore de compte ?{' '}
                <Link href="/auth/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Créer un compte
                </Link>
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-600">Chargement...</div>
      </div>
    }>
      <SignInContent />
    </Suspense>
  )
}
```

### 3. `/payload/collections/Users.ts` - Configuration Payload Users

```typescript
import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    maxLoginAttempts: 999999,
    lockTime: 1,
    useAPIKey: false,
  },
  admin: {
    useAsTitle: 'email',
  },
  access: {
    // TEMPORARY: Allow unrestricted access while auth is disabled
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
```

### 4. `/payload.config.ts` - Configuration Payload

```typescript
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
      beforeNavLinks: ['@/payload/components/CustomNav'],
    },
  },

  collections: [
    Users,
    Customers,
    Orders,
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
```

---

## 🔐 Données d'Authentification

### Utilisateur Admin (Collection `users`)
```javascript
{
  _id: ObjectId('6915f72382e7455ba893599b'),
  email: 'benjamin@avdigital.fr',
  name: 'Benjamin',
  role: 'admin',
  password: '$2b$10$Vqv2t6QqUUN2n//cts0egO5...' // Hash bcrypt de: vDDzM2Gf3n!*NQ
  createdAt: 2025-11-13T15:20:03.456Z,
  updatedAt: 2025-11-27T12:10:41.934Z
}
```

**Mot de passe en clair**: `vDDzM2Gf3n!*NQ`

### Vérification du Hash
Le hash a été vérifié avec bcrypt et fonctionne:
```javascript
const isValid = await bcrypt.compare('vDDzM2Gf3n!*NQ', '$2b$10$Vqv2t6QqUUN2n//cts0egO5...')
// Résultat: true ✅
```

---

## 🐛 Historique des Tentatives de Correction

### Tentative 1: Reset via Payload API
**Fichier**: `scripts/reset-password.mjs`
**Méthode**: `payload.update()` avec hash bcrypt
**Résultat**: ❌ ÉCHEC - Le hash n'était pas sauvegardé en base

### Tentative 2: Update via Payload API (sans hash manuel)
**Fichier**: `scripts/fix-admin-password.mjs`
**Méthode**: `payload.update()` avec mot de passe en clair (Payload devait hasher)
**Résultat**: ❌ ÉCHEC - Le hash n'était toujours pas sauvegardé

### Tentative 3: Accès Direct MongoDB
**Fichier**: `scripts/direct-password-fix.mjs`
**Méthode**: Connexion MongoDB directe avec `MongoClient`
**Résultat**: ✅ SUCCÈS - Hash correctement sauvegardé en base

### Tentative 4: Modification auth.ts
**Fichier**: `auth.ts`
**Modification**: Accès direct MongoDB via `payload.db.collections['users']`
**Raison**: Payload `find()` filtre le champ `password` pour la sécurité
**Résultat**: ❌ Le problème persiste selon l'utilisateur

---

## 🔍 Problème Identifié

### Issue 1: Payload Filtre le Champ Password
Payload CMS filtre automatiquement le champ `password` dans les réponses de `payload.find()` pour des raisons de sécurité. C'est pourquoi les scripts utilisant Payload API ne fonctionnaient pas.

### Issue 2: Possible Problème de Typage TypeScript
```typescript
const db = payload.db
const User = (db as any).collections['users']
```
L'utilisation de `as any` pourrait masquer des problèmes de typage.

### Issue 3: ID Format Mismatch
MongoDB utilise `_id` tandis que Payload utilise `id`. Il pourrait y avoir une confusion dans les conversions.

---

## 🌐 Configuration Environnement

### Variables d'Environnement (.env)
```bash
# MongoDB Atlas
DATABASE_URL="mongodb+srv://exclusives_stickers_prod:4CpczjPkK8VEiyh5@clusterm0.sedc1fl.mongodb.net/exclusives_stickers?retryWrites=true&w=majority&appName=clusterM0"

# Payload CMS
PAYLOAD_SECRET="[REDACTED]"

# NextAuth
NEXTAUTH_SECRET="[REDACTED]"
NEXTAUTH_URL="http://localhost:3001"

# URLs
NEXT_PUBLIC_SERVER_URL="http://localhost:3001"
```

### Configuration Production (Vercel)
- Base de données: Même MongoDB Atlas
- Variables d'environnement: Configurées dans Vercel Dashboard
- Build: Successful
- URL Production: https://stickers-storefront-n8u91bbr9-benjaminav2s-projects.vercel.app

---

## 📊 Tests de Diagnostic

### Test 1: Vérification Hash en Base
```bash
npx tsx scripts/check-all-users.mjs
```
**Résultat**:
```
✅ Connecté à MongoDB Atlas
📊 Total utilisateurs dans la collection: 1
📧 Utilisateurs avec email benjamin@avdigital.fr: 1

Utilisateur 1:
   _id: new ObjectId('6915f72382e7455ba893599b')
   email: benjamin@avdigital.fr
   password: EXISTS ($2b$10$Vqv2t6QqUUN2n//cts...)
```

### Test 2: Test Bcrypt Direct
```bash
npx tsx scripts/direct-password-fix.mjs
```
**Résultat**:
```
✅ Connecté à MongoDB
✅ Utilisateur trouvé: benjamin@avdigital.fr
🔄 Génération du hash bcrypt...
🔄 Mise à jour en base de données...
✅ Résultat: 1 document(s) modifié(s)
🧪 Test de comparaison bcrypt...
   Résultat: ✅ VALIDE
```

### Test 3: Test Flux Payload
```bash
npx tsx scripts/test-auth-flow.mjs
```
**Résultat**: ❌ ÉCHEC
```
2️⃣  Recherche dans la collection "users"...
✅ Utilisateur trouvé
   - ID: 6914a9bfc7b1d1a1063eb24f
3️⃣  Vérification du hash password...
❌ ÉCHEC: Pas de password hash en base
```
**Note**: L'ID retourné (6914a9bfc7b1d1a1063eb24f) est différent de celui en base (6915f72382e7455ba893599b) - probablement un cache Payload.

---

## 🚨 Symptômes du Problème

1. **Formulaire de connexion**: Affiche "Email ou mot de passe incorrect"
2. **Logs serveur**: Pas d'erreur spécifique visible
3. **Base de données**: Hash bcrypt présent et valide
4. **Payload find()**: Ne retourne pas le champ password
5. **MongoDB direct**: Hash accessible et fonctionnel

---

## 🎯 Pistes de Solution pour le Développeur

### Piste 1: Vérifier la Configuration NextAuth
- Vérifier que les callbacks JWT et session fonctionnent correctement
- S'assurer que le provider Credentials est correctement configuré
- Vérifier les pages de redirection

### Piste 2: Vérifier l'Accès MongoDB via Payload
```typescript
// Au lieu de:
const User = (db as any).collections['users']

// Essayer:
const mongoose = require('mongoose')
const User = mongoose.connection.db.collection('users')
```

### Piste 3: Vérifier les Middleware NextAuth
Le fichier `middleware.ts` doit être configuré pour NextAuth v5:
```typescript
export { auth as middleware } from './auth'
```

### Piste 4: Vérifier les Logs en Production
```bash
vercel logs https://stickers-storefront-n8u91bbr9-benjaminav2s-projects.vercel.app
```

### Piste 5: Tester avec Payload Login Direct
Essayer de se connecter directement via Payload Admin à `/admin/login` pour vérifier si le problème est spécifique à NextAuth.

### Piste 6: Vérifier la Compatibilité NextAuth v5 Beta
NextAuth v5 est en beta. Considérer:
- Downgrade vers NextAuth v4 (stable)
- Ou upgrade vers la dernière beta de NextAuth v5

---

## 📝 Étapes pour Reproduire

1. Cloner le repository
2. Installer les dépendances: `npm install`
3. Configurer `.env` avec les variables d'environnement
4. Lancer le serveur: `npm run dev`
5. Accéder à http://localhost:3001/auth/signin
6. Entrer:
   - Email: `benjamin@avdigital.fr`
   - Password: `vDDzM2Gf3n!*NQ`
   - Cocher "Connexion administrateur"
7. Cliquer sur "Se connecter"
8. **Résultat attendu**: Redirection vers la page d'accueil avec session active
9. **Résultat obtenu**: Message "Email ou mot de passe incorrect"

---

## 📦 Dépendances Pertinentes

```json
{
  "next": "^16.0.1",
  "next-auth": "^5.0.0-beta.25",
  "payload": "^3.8.0",
  "@payloadcms/db-mongodb": "^3.8.0",
  "bcrypt": "^5.1.1",
  "mongodb": "^6.12.0",
  "mongoose": "^8.9.4"
}
```

---

## 🔗 Liens Utiles

- Repository GitHub: https://github.com/BenjaminAV2/stickers-storefront
- Production URL: https://stickers-storefront-n8u91bbr9-benjaminav2s-projects.vercel.app
- MongoDB Atlas Dashboard: [Lien à ajouter]

---

## 📞 Contact

**Propriétaire**: Benjamin AV
**Email**: benjamin@avdigital.fr
**Projet**: Stickers Storefront
**Date du rapport**: 27 novembre 2025

---

## ✅ Checklist pour le Développeur

- [ ] Vérifier la configuration NextAuth v5
- [ ] Tester la connexion Payload Admin directement
- [ ] Vérifier les logs de production Vercel
- [ ] Tester l'accès MongoDB direct dans auth.ts
- [ ] Vérifier les middleware Next.js
- [ ] Tester en local avec les mêmes variables d'environnement
- [ ] Vérifier la compatibilité NextAuth v5 beta
- [ ] Envisager un downgrade vers NextAuth v4
- [ ] Vérifier les CORS et les cookies
- [ ] Vérifier la session strategy (JWT vs Database)
