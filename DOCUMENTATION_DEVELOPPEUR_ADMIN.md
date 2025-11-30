# Documentation Développeur - Exclusives Stickers Admin

**Version** : 1.0.0
**Date** : 27 novembre 2025
**Auteur** : Benjamin AV
**Contact** : benjamin@avdigital.fr

---

## Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Architecture du projet](#architecture-du-projet)
3. [Stack technique](#stack-technique)
4. [Structure des dossiers](#structure-des-dossiers)
5. [Système d'authentification](#système-dauthentification)
6. [Collections Payload CMS](#collections-payload-cms)
7. [Intégration Medusa Commerce](#intégration-medusa-commerce)
8. [API Routes](#api-routes)
9. [Configuration et déploiement](#configuration-et-déploiement)
10. [Guide de développement](#guide-de-développement)
11. [Troubleshooting](#troubleshooting)

---

## Vue d'ensemble

### Description du projet

**Exclusives Stickers** est une plateforme e-commerce complète pour la vente de stickers personnalisés. Le projet combine :

- **Frontend client** : Interface utilisateur pour parcourir et commander des stickers
- **Backend admin** : Panel d'administration Payload CMS pour gérer le contenu et les commandes
- **E-commerce backend** : Medusa.js hébergé sur Railway pour la gestion des produits et paiements
- **Authentification dual** : NextAuth.js pour le frontend + Payload CMS auth native pour l'admin

### Objectifs du projet

1. Permettre aux clients de configurer et commander des stickers personnalisés
2. Fournir une interface admin complète pour gérer les commandes, produits et clients
3. Synchroniser automatiquement les données entre Medusa (produits) et Payload (contenu)
4. Offrir des statistiques et rapports pour le business

### URLs principales

- **Frontend client** : https://stickers-storefront-psxg795rf-benjaminav2s-projects.vercel.app
- **Admin Payload** : https://stickers-storefront-psxg795rf-benjaminav2s-projects.vercel.app/admin
- **Medusa Backend** : https://medusa-production-58da.up.railway.app
- **GitHub** : https://github.com/BenjaminAV2/stickers-storefront

---

## Architecture du projet

### Diagramme d'architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (Next.js 16)                     │
│                     Vercel Deployment                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Client     │  │   Admin      │  │  Payload     │      │
│  │   Routes     │  │   Routes     │  │   Admin      │      │
│  │              │  │              │  │   Panel      │      │
│  │ /products    │  │ /dashboard   │  │  /admin      │      │
│  │ /cart        │  │ /statistics  │  │              │      │
│  │ /checkout    │  │ /orders-list │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │         Authentication Layer (NextAuth.js v5)        │   │
│  │  - Admin login: /admin/signin                        │   │
│  │  - Client login: /mon-compte/signin                  │   │
│  │  - JWT sessions (30 days)                            │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
└───────────────────────┬─────────────────────┬───────────────┘
                        │                     │
                        ▼                     ▼
        ┌───────────────────────┐ ┌──────────────────────┐
        │   Payload CMS API     │ │  Medusa Commerce     │
        │   (MongoDB Atlas)     │ │  (Railway)           │
        ├───────────────────────┤ ├──────────────────────┤
        │ Collections:          │ │ - Products           │
        │ - Users (admins)      │ │ - Carts              │
        │ - Customers           │ │ - Orders             │
        │ - Orders (local copy) │ │ - Payments (Stripe)  │
        │ - Products (metadata) │ │ - Shipping           │
        │ - Pages               │ │                      │
        │ - Media               │ │                      │
        │ - Categories          │ │                      │
        │ - Pricing Settings    │ │                      │
        │ - Shipping Providers  │ │                      │
        └───────────────────────┘ └──────────────────────┘
                        │                     │
                        └──────────┬──────────┘
                                   ▼
                        ┌──────────────────────┐
                        │   MongoDB Atlas      │
                        │   Database           │
                        │   (Shared)           │
                        └──────────────────────┘
```

### Flux de données

#### 1. Flux de commande client

```
Client → Configuration produit → Ajout au panier → Checkout
  ↓
Medusa API (création commande + paiement Stripe)
  ↓
Webhook Medusa → Payload (/api/webhooks/medusa)
  ↓
Création Order dans Payload pour tracking admin
  ↓
Email confirmation + Tableau de bord admin mis à jour
```

#### 2. Flux d'authentification admin

```
Admin → /admin/signin (NextAuth)
  ↓
Vérification credentials (PBKDF2 ou bcrypt)
  ↓
Création JWT session (30 jours)
  ↓
Redirection vers /admin (Payload CMS)
  ↓
Payload vérifie sa propre auth (PBKDF2)
  ↓
Accès au panel admin
```

---

## Stack technique

### Frontend

| Technologie | Version | Rôle |
|------------|---------|------|
| **Next.js** | 16.0.1 | Framework React avec App Router |
| **React** | 19.2.0 | Library UI |
| **TypeScript** | 5.x | Typage statique |
| **Tailwind CSS** | 4.x | Framework CSS utility-first |
| **NextAuth.js** | 5.0.0-beta.30 | Authentification frontend |

### Backend & CMS

| Technologie | Version | Rôle |
|------------|---------|------|
| **Payload CMS** | 3.63.0 | Headless CMS et admin panel |
| **MongoDB** | 7.0.0 | Base de données principale |
| **Mongoose** | 8.9.4 | ODM MongoDB |
| **Medusa.js** | Latest | E-commerce backend (Railway) |

### Authentification & Sécurité

| Technologie | Usage |
|------------|-------|
| **PBKDF2** | Hash passwords Payload (25,000 iterations, SHA-256) |
| **bcrypt** | Support legacy passwords (rounds: 10) |
| **JWT** | Sessions NextAuth (HS256) |
| **Scmp** | Constant-time comparison (timing attack prevention) |

### Déploiement

| Service | Usage |
|---------|-------|
| **Vercel** | Hébergement frontend + serverless functions |
| **Railway** | Hébergement Medusa backend |
| **MongoDB Atlas** | Base de données cloud (shared cluster) |
| **GitHub** | Version control |

---

## Structure des dossiers

```
stickers-storefront/
│
├── app/                              # Next.js App Router
│   ├── (frontend)/                   # Routes frontend client
│   │   └── checkout/
│   │       ├── page.tsx              # Page checkout
│   │       ├── success/page.tsx      # Confirmation commande
│   │       └── failure/page.tsx      # Échec paiement
│   │
│   ├── (payload)/                    # Routes admin personnalisées
│   │   ├── admin/[[...segments]]/    # Payload admin catch-all
│   │   ├── dashboard/page.tsx        # Dashboard stats
│   │   ├── statistics/page.tsx       # Page statistiques
│   │   ├── orders-list/page.tsx      # Liste commandes
│   │   ├── order-detail/[id]/        # Détail commande
│   │   └── api/[...slug]/route.ts    # Payload API routes
│   │
│   ├── admin/                        # Auth admin
│   │   └── signin/page.tsx           # Login admin NextAuth
│   │
│   ├── mon-compte/                   # Auth client
│   │   └── signin/page.tsx           # Login client NextAuth
│   │
│   ├── auth/                         # Auth legacy
│   │   ├── signin/page.tsx           # Login générique
│   │   ├── signup/page.tsx           # Inscription client
│   │   └── error/page.tsx            # Erreurs auth
│   │
│   ├── products/                     # Catalogue produits
│   │   ├── page.tsx                  # Liste produits
│   │   └── [handle]/page.tsx         # Détail produit
│   │
│   ├── cart/page.tsx                 # Panier
│   ├── page.tsx                      # Homepage
│   ├── layout.tsx                    # Layout racine
│   │
│   └── api/                          # API Routes
│       ├── auth/[...nextauth]/       # NextAuth API
│       ├── webhooks/medusa/          # Webhooks Medusa
│       ├── customers/                # CRUD customers
│       ├── shipping-providers-filtered/
│       └── admin/                    # API admin
│           ├── dashboard-stats/
│           ├── statistics/
│           └── orders/
│
├── payload/                          # Configuration Payload
│   ├── collections/                  # Définitions collections
│   │   ├── Users.ts                  # Admins
│   │   ├── Customers.ts              # Clients
│   │   ├── Orders.ts                 # Commandes
│   │   ├── Products.ts               # Produits metadata
│   │   ├── Categories.ts             # Catégories
│   │   ├── Pages.ts                  # Pages CMS
│   │   ├── Media.ts                  # Fichiers
│   │   ├── PricingSettings.ts        # Paramètres prix
│   │   └── ShippingProviders.ts      # Transporteurs
│   │
│   └── components/                   # Composants Payload
│       └── CustomNav.tsx             # Navigation personnalisée
│
├── components/                       # Composants React
│   ├── ProductConfigurator.tsx       # Configurateur stickers
│   ├── QuantityMatrix.tsx            # Matrice quantités/prix
│   └── HeroStickerSection.tsx        # Section hero homepage
│
├── contexts/                         # React Contexts
│   ├── CartContext.tsx               # State panier global
│   └── CheckoutContext.tsx           # State checkout
│
├── scripts/                          # Scripts utilitaires
│   ├── sync-medusa-orders.ts         # Sync commandes Medusa
│   ├── reset-admin-password-payload.mjs
│   ├── check-all-users.mjs
│   └── [autres scripts diagnostics]
│
├── auth.ts                           # Configuration NextAuth
├── middleware.ts                     # Next.js middleware (auth)
├── payload.config.ts                 # Configuration Payload CMS
├── tailwind.config.js                # Configuration Tailwind
├── tsconfig.json                     # Configuration TypeScript
├── .env                              # Variables d'environnement
├── package.json                      # Dependencies
└── README.md                         # Documentation projet
```

---

## Système d'authentification

### Vue d'ensemble

Le projet utilise **deux systèmes d'authentification distincts** :

1. **NextAuth.js v5** - Pour l'authentification frontend (admin et clients)
2. **Payload CMS Auth** - Pour l'authentification native du panel admin

### Architecture d'authentification

```
┌────────────────────────────────────────────────────────┐
│              Pages de connexion                        │
├────────────────────────────────────────────────────────┤
│                                                         │
│  /admin/signin (NextAuth)     /admin (Payload natif)  │
│       ↓                              ↓                 │
│  NextAuth.js v5              Payload CMS Auth          │
│       ↓                              ↓                 │
│  JWT Session                 Payload Session           │
│  (30 jours)                  (2 heures par défaut)     │
│       ↓                              ↓                 │
│  /admin redirect             Direct admin access       │
│                                                         │
└────────────────────────────────────────────────────────┘
                        ↓
            ┌──────────────────────┐
            │  MongoDB Collection  │
            │       "users"        │
            ├──────────────────────┤
            │ Fields:              │
            │ - email              │
            │ - hash (PBKDF2)      │
            │ - salt               │
            │ - password (bcrypt)* │
            │ - role               │
            │ - loginAttempts      │
            │ - sessions           │
            └──────────────────────┘
                * Legacy support
```

### Configuration NextAuth (`auth.ts`)

#### Providers

```typescript
providers: [
  Credentials({
    credentials: {
      email: { type: 'email' },
      password: { type: 'password' },
      isAdmin: { type: 'boolean' }
    },
    async authorize(credentials) {
      // Authentification dual: PBKDF2 (Payload) ou bcrypt (legacy)
    }
  })
]
```

#### Support dual hash (PBKDF2 + bcrypt)

Le système vérifie automatiquement quel algorithme utiliser :

```typescript
async function verifyPassword(doc: any, password: string): Promise<boolean> {
  // 1. Vérifier si hash bcrypt présent
  if (doc.password && doc.password.startsWith('$2')) {
    return await bcrypt.compare(password, doc.password)
  }

  // 2. Sinon utiliser PBKDF2 (Payload natif)
  if (doc.hash && doc.salt) {
    return await crypto.pbkdf2(
      password,
      doc.salt,
      25000,  // iterations
      512,    // keylen
      'sha256'
    )
  }

  return false
}
```

#### Sessions JWT

```typescript
session: {
  strategy: 'jwt',
  maxAge: 30 * 24 * 60 * 60  // 30 jours
}

callbacks: {
  async jwt({ token, user }) {
    if (user) {
      token.id = user.id
      token.role = user.role
      token.isAdmin = user.isAdmin
    }
    return token
  },

  async session({ session, token }) {
    session.user.id = token.id
    session.user.role = token.role
    session.user.isAdmin = token.isAdmin
    return session
  }
}
```

### Configuration Payload Auth

#### Collection Users (`payload/collections/Users.ts`)

```typescript
export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    maxLoginAttempts: 999999,  // Illimité pour éviter les lockouts
    lockTime: 1,
    useAPIKey: false
  },
  admin: {
    useAsTitle: 'email'
  },
  access: {
    read: () => true,    // TEMPORAIRE - À sécuriser en production
    create: () => true,
    update: () => true,
    delete: () => true
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' }
      ]
    }
  ]
}
```

### Middleware de protection (`middleware.ts`)

```typescript
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Routes publiques
  const publicRoutes = [
    '/',
    '/products',
    '/admin/signin',
    '/mon-compte/signin',
    '/api/auth'
  ]

  // Autoriser Payload admin (a sa propre auth)
  if (pathname.startsWith('/admin')) {
    return NextResponse.next()
  }

  // Vérifier JWT pour routes protégées
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  if (!token && !isPublicRoute) {
    const signInPath = isProtectedClientRoute
      ? '/mon-compte/signin'
      : '/auth/signin'
    return NextResponse.redirect(new URL(signInPath, req.url))
  }

  // Vérifier rôle admin pour routes admin
  if (isAdminRoute && !token.isAdmin) {
    return NextResponse.redirect(new URL('/auth/error', req.url))
  }

  return NextResponse.next()
}
```

### Pages de connexion

#### Admin (`app/admin/signin/page.tsx`)

- Design bleu/indigo
- Formulaire avec email/password
- Toggle voir/cacher mot de passe
- Redirection automatique vers `/admin` après connexion
- Lien vers login client

#### Client (`app/mon-compte/signin/page.tsx`)

- Design vert/teal
- Formulaire avec email/password
- Toggle voir/cacher mot de passe
- Redirection vers `/mon-compte` après connexion
- Liens vers inscription et login admin

### Identifiants admin par défaut

```
Email: benjamin@avdigital.fr
Password: vDDzM2Gf3n!*NQ
```

**⚠️ IMPORTANT** : Changer ces identifiants en production !

---

## Collections Payload CMS

### Users (Administrateurs)

**Slug** : `users`
**Auth enabled** : Oui

#### Champs

| Champ | Type | Description | Requis |
|-------|------|-------------|--------|
| email | email | Email admin | ✅ |
| password | password | Hash PBKDF2 ou bcrypt | ✅ |
| name | text | Nom admin | ✅ |
| role | select | admin / editor | ✅ |
| hash | text | Hash PBKDF2 (auto) | - |
| salt | text | Salt PBKDF2 (auto) | - |
| loginAttempts | number | Tentatives connexion | - |
| lockUntil | date | Lock jusqu'à | - |
| sessions | array | Sessions actives | - |

#### Access Control

```typescript
access: {
  read: () => true,    // À sécuriser
  create: () => true,
  update: () => true,
  delete: () => true
}
```

---

### Customers (Clients)

**Slug** : `customers`
**Auth enabled** : Oui

#### Champs

| Champ | Type | Description | Requis |
|-------|------|-------------|--------|
| email | email | Email client | ✅ |
| password | password | Hash PBKDF2 | ✅ |
| firstName | text | Prénom | ✅ |
| lastName | text | Nom | ✅ |
| phone | text | Téléphone | - |
| company | text | Entreprise | - |
| address | group | Adresse complète | - |

#### Synchronisation Medusa

Les customers sont synchronisés avec Medusa pour les commandes :
- Création auto dans Medusa lors de l'inscription
- Mise à jour bidirectionnelle via webhooks

---

### Orders (Commandes)

**Slug** : `orders`

#### Champs

| Champ | Type | Description |
|-------|------|-------------|
| medusaOrderId | text | ID Medusa unique |
| orderNumber | text | Numéro commande |
| customer | relationship | → customers |
| status | select | pending/paid/shipped/delivered/cancelled |
| total | number | Montant total |
| subtotal | number | Sous-total |
| shippingTotal | number | Frais de port |
| taxTotal | number | TVA |
| items | array | Produits commandés |
| shippingAddress | group | Adresse livraison |
| billingAddress | group | Adresse facturation |
| paymentStatus | select | Statut paiement |
| trackingNumber | text | Numéro de suivi |
| estimatedDelivery | date | Livraison estimée |
| notes | textarea | Notes internes |

#### Hooks

```typescript
hooks: {
  afterChange: [
    async ({ doc, req, operation }) => {
      // Envoyer email au client si changement de statut
      if (operation === 'update' && doc.status === 'shipped') {
        await sendShippingEmail(doc)
      }
    }
  ]
}
```

---

### Products (Produits - Metadata)

**Slug** : `products`

Cette collection stocke les **métadonnées** des produits. Les produits réels sont dans Medusa.

#### Champs

| Champ | Type | Description |
|-------|------|-------------|
| medusaId | text | ID Medusa |
| title | text | Titre produit |
| handle | text | URL slug |
| description | richText | Description riche |
| category | relationship | → categories |
| featured | checkbox | Produit vedette |
| seoTitle | text | Meta title SEO |
| seoDescription | textarea | Meta description |
| customFields | json | Données custom |

---

### Categories

**Slug** : `categories`

#### Champs

| Champ | Type | Description |
|-------|------|-------------|
| name | text | Nom catégorie |
| slug | text | URL slug |
| description | richText | Description |
| image | upload | Image catégorie |
| parent | relationship | Catégorie parent (self) |
| order | number | Ordre affichage |

---

### Pages (CMS)

**Slug** : `pages`

#### Champs

| Champ | Type | Description |
|-------|------|-------------|
| title | text | Titre page |
| slug | text | URL |
| content | richText | Contenu riche |
| layout | blocks | Blocks (Hero, Gallery, etc.) |
| seo | group | SEO metadata |
| publishedAt | date | Date publication |
| status | select | draft/published |

---

### Media

**Slug** : `media`

#### Configuration

```typescript
{
  slug: 'media',
  upload: {
    staticDir: 'media',
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*', 'application/pdf'],
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre'
      },
      {
        name: 'card',
        width: 768,
        height: 1024,
        position: 'centre'
      },
      {
        name: 'tablet',
        width: 1024,
        height: undefined,
        position: 'centre'
      }
    ]
  }
}
```

**⚠️ IMPORTANT** : En production Vercel, configurer un storage adapter (AWS S3, Cloudinary, etc.)

---

### PricingSettings (Paramètres de prix)

**Slug** : `pricingSettings`

Collection singleton pour paramètres globaux de pricing.

#### Champs

| Champ | Type | Description |
|-------|------|-------------|
| basePrice | number | Prix de base par sticker |
| quantityDiscounts | array | Remises par quantité |
| sizeMultipliers | array | Multiplicateurs par taille |
| materialPrices | array | Prix par matériau |
| shippingRates | array | Tarifs port |

---

### ShippingProviders (Transporteurs)

**Slug** : `shippingProviders`

#### Champs

| Champ | Type | Description |
|-------|------|-------------|
| name | text | Nom transporteur |
| code | text | Code unique |
| apiKey | text | Clé API (encrypted) |
| trackingUrl | text | URL de tracking |
| zones | array | Zones de livraison |
| rates | array | Tarifs |
| active | checkbox | Actif |

---

## Intégration Medusa Commerce

### Architecture Medusa

```
Medusa Backend (Railway)
├── Products (catalogue complet)
├── Carts (paniers actifs)
├── Orders (commandes)
├── Payments (Stripe)
├── Shipping (calcul)
└── Customers (sync avec Payload)
```

### API Medusa

**Base URL** : `https://medusa-production-58da.up.railway.app`

#### Endpoints utilisés

```typescript
// Products
GET /store/products              // Liste produits
GET /store/products/:handle      // Détail produit

// Cart
POST /store/carts                // Créer panier
POST /store/carts/:id/line-items // Ajouter item
PUT /store/carts/:id             // Mettre à jour
DELETE /store/carts/:id/line-items/:line_id

// Checkout
POST /store/carts/:id/payment-sessions
POST /store/carts/:id/complete

// Orders
GET /store/orders/:id            // Détail commande
```

### Webhooks Medusa → Payload

**Endpoint** : `POST /api/webhooks/medusa`

#### Events gérés

1. **order.placed** - Nouvelle commande
2. **order.payment_captured** - Paiement validé
3. **order.fulfilled** - Commande expédiée
4. **order.canceled** - Annulation

#### Implémentation (`app/api/webhooks/medusa/route.ts`)

```typescript
export async function POST(req: Request) {
  const body = await req.json()
  const event = body.type

  const payload = await getPayload({ config })

  switch (event) {
    case 'order.placed':
      // Créer Order dans Payload
      await payload.create({
        collection: 'orders',
        data: {
          medusaOrderId: body.data.id,
          status: 'pending',
          // ... mapper toutes les données
        }
      })
      break

    case 'order.payment_captured':
      // Mettre à jour statut
      await payload.update({
        collection: 'orders',
        where: { medusaOrderId: { equals: body.data.id } },
        data: {
          status: 'paid',
          paymentStatus: 'paid'
        }
      })
      break

    // ... autres events
  }

  return Response.json({ received: true })
}
```

### Synchronisation produits

**Script** : `scripts/sync-medusa-orders.ts`

```bash
npm run sync:orders
```

Ce script :
1. Récupère tous les produits depuis Medusa
2. Crée/met à jour les Products dans Payload
3. Associe les catégories
4. Synchronise les images

---

## API Routes

### Admin API

#### Dashboard Stats

**Endpoint** : `GET /api/admin/dashboard-stats`
**Auth** : Admin required

```typescript
// Response
{
  totalOrders: number,
  totalRevenue: number,
  averageOrderValue: number,
  ordersToday: number,
  revenueToday: number,
  ordersByStatus: {
    pending: number,
    paid: number,
    shipped: number,
    delivered: number,
    cancelled: number
  },
  recentOrders: Order[]
}
```

#### Statistics

**Endpoint** : `GET /api/admin/statistics?period=30`
**Auth** : Admin required
**Query params** : `period` (7, 30, 90)

```typescript
// Response
{
  revenue: {
    total: number,
    byDay: Array<{ date: string, amount: number }>,
    growth: number  // % vs période précédente
  },
  orders: {
    total: number,
    byDay: Array<{ date: string, count: number }>,
    growth: number
  },
  topProducts: Array<{
    productId: string,
    title: string,
    quantity: number,
    revenue: number
  }>,
  topCustomers: Array<{
    customerId: string,
    name: string,
    ordersCount: number,
    totalSpent: number
  }>
}
```

#### Orders Management

**Endpoint** : `GET /api/admin/orders`
**Auth** : Admin required
**Query params** :
- `status` : filter par statut
- `from` : date début
- `to` : date fin
- `page` : pagination
- `limit` : résultats par page

```typescript
// Response
{
  docs: Order[],
  totalDocs: number,
  limit: number,
  page: number,
  totalPages: number,
  hasNextPage: boolean,
  hasPrevPage: boolean
}
```

**Endpoint** : `PUT /api/admin/orders/:id`
**Auth** : Admin required

```typescript
// Request body
{
  status?: OrderStatus,
  trackingNumber?: string,
  notes?: string,
  shippingProvider?: string
}
```

### Customer API

**Endpoint** : `POST /api/customers`

```typescript
// Request
{
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  phone?: string,
  company?: string
}

// Response
{
  customer: Customer,
  medusaCustomer: MedusaCustomer
}
```

### Shipping Providers Filtered

**Endpoint** : `GET /api/shipping-providers-filtered`

Retourne les transporteurs actifs triés par zone de livraison.

---

## Configuration et déploiement

### Variables d'environnement

#### `.env` (local et production)

```bash
# Database
DATABASE_URL="mongodb+srv://user:password@cluster.mongodb.net/db?retryWrites=true&w=majority"

# Payload CMS
PAYLOAD_SECRET="votre-secret-payload-ici"  # openssl rand -base64 32

# NextAuth
NEXTAUTH_SECRET="votre-secret-nextauth-ici"  # openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3001"  # En prod: votre URL Vercel
NEXTAUTH_URL_INTERNAL="http://localhost:3001"

# Medusa Backend
NEXT_PUBLIC_MEDUSA_BACKEND_URL="https://medusa-production-58da.up.railway.app"
MEDUSA_WEBHOOK_SECRET="votre-secret-webhook"

# Stripe (via Medusa)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."

# URLs
NEXT_PUBLIC_SERVER_URL="http://localhost:3001"  # En prod: URL Vercel

# Email (optionnel)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
```

### Déploiement Vercel

#### 1. Connexion GitHub

Le projet est déjà connecté à Vercel via GitHub. Chaque push sur `main` déclenche un déploiement automatique.

#### 2. Variables d'environnement Vercel

Dans le dashboard Vercel, configurer :

1. Settings → Environment Variables
2. Ajouter toutes les variables du `.env`
3. **IMPORTANT** : `NEXTAUTH_URL` doit être l'URL de production

#### 3. Build Settings

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "devCommand": "npm run dev",
  "framework": "nextjs"
}
```

#### 4. Domaine personnalisé (optionnel)

1. Settings → Domains
2. Ajouter votre domaine
3. Configurer DNS selon instructions Vercel

### Déploiement Medusa (Railway)

Le backend Medusa est déjà déployé sur Railway :

**URL** : https://medusa-production-58da.up.railway.app

#### Configuration Railway

1. Database PostgreSQL (fourni par Railway)
2. Redis (cache)
3. Variables d'environnement Medusa
4. Webhooks configurés vers Vercel

### Gestion MongoDB Atlas

#### 1. Backup automatique

MongoDB Atlas effectue des backups automatiques. Pour restaurer :

1. Atlas Dashboard → Clusters
2. Browse Collections
3. Actions → Restore

#### 2. Monitoring

- Query Performance
- Real-time Performance Panel
- Custom Alerts

#### 3. Scaling

Pour augmenter la capacité :
1. Cluster → Configuration
2. Choisir tier supérieur (M10, M20, etc.)
3. Apply Changes

---

## Guide de développement

### Installation locale

```bash
# 1. Cloner le repository
git clone https://github.com/BenjaminAV2/stickers-storefront.git
cd stickers-storefront

# 2. Installer les dépendances
npm install

# 3. Configurer .env
cp .env.example .env
# Éditer .env avec vos valeurs

# 4. Générer les types Payload
npm run generate:payload-types

# 5. Lancer le serveur de dev
npm run dev

# Serveur accessible sur http://localhost:3001
```

### Scripts disponibles

```bash
# Développement
npm run dev              # Serveur Next.js dev (port 3001)

# Build
npm run build            # Build production
npm start                # Serveur production

# Payload
npm run generate:payload-types  # Générer types TypeScript

# Synchronisation
npm run sync:orders      # Sync commandes Medusa → Payload

# Utilitaires (scripts/)
npx tsx scripts/reset-admin-password-payload.mjs  # Reset password admin
npx tsx scripts/check-all-users.mjs               # Lister users
```

### Structure de développement

#### 1. Créer une nouvelle collection Payload

```typescript
// payload/collections/MaCollection.ts
import type { CollectionConfig } from 'payload'

export const MaCollection: CollectionConfig = {
  slug: 'ma-collection',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    // ... autres champs
  ],
}

// Ajouter dans payload.config.ts
import { MaCollection } from './payload/collections/MaCollection'

export default buildConfig({
  collections: [
    // ... autres collections
    MaCollection,
  ],
})
```

#### 2. Créer une nouvelle API route

```typescript
// app/api/mon-endpoint/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function GET(req: NextRequest) {
  const payload = await getPayload({ config })

  const data = await payload.find({
    collection: 'ma-collection',
    limit: 10,
  })

  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const payload = await getPayload({ config })

  const doc = await payload.create({
    collection: 'ma-collection',
    data: body,
  })

  return NextResponse.json(doc)
}
```

#### 3. Créer une page admin personnalisée

```typescript
// app/(payload)/ma-page/page.tsx
import { getPayload } from 'payload'
import config from '@/payload.config'

export default async function MaPageAdmin() {
  const payload = await getPayload({ config })

  const data = await payload.find({
    collection: 'ma-collection',
  })

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Ma Page Admin</h1>
      {/* Votre UI */}
    </div>
  )
}
```

### Testing

#### 1. Test authentification

```bash
# Tester login admin
curl -X POST http://localhost:3001/api/auth/callback/credentials \
  -H "Content-Type: application/json" \
  -d '{
    "email": "benjamin@avdigital.fr",
    "password": "vDDzM2Gf3n!*NQ",
    "isAdmin": "true"
  }'
```

#### 2. Test Payload API

```bash
# Login Payload
curl -X POST http://localhost:3001/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "benjamin@avdigital.fr",
    "password": "vDDzM2Gf3n!*NQ"
  }'

# Utiliser le token dans les requêtes
curl http://localhost:3001/api/orders \
  -H "Authorization: JWT <token>"
```

### Best practices

#### 1. Sécurité

- ✅ Toujours valider les inputs (zod)
- ✅ Utiliser les access controls Payload
- ✅ Ne jamais exposer les secrets dans le code
- ✅ Vérifier l'authentification dans les API routes
- ✅ Sanitize les données utilisateur

#### 2. Performance

- ✅ Utiliser `lean()` sur les queries Mongoose
- ✅ Limiter les résultats avec pagination
- ✅ Cacher les requêtes fréquentes
- ✅ Optimiser les images (Sharp)
- ✅ Lazy loading pour les composants lourds

#### 3. Code quality

- ✅ TypeScript strict mode
- ✅ ESLint + Prettier
- ✅ Nommer clairement les variables
- ✅ Commenter le code complexe
- ✅ Utiliser les types Payload générés

---

## Troubleshooting

### Problème : Authentification échoue

#### Symptôme
```
Error: Email ou mot de passe incorrect
```

#### Solution

1. Vérifier que l'utilisateur existe :
```bash
npx tsx scripts/check-all-users.mjs
```

2. Reset le password :
```bash
npx tsx scripts/reset-admin-password-payload.mjs
```

3. Vérifier les logs du serveur pour voir quel algorithme est utilisé

---

### Problème : Build Vercel échoue

#### Symptôme
```
Type error: Property 'X' does not exist on type 'Y'
```

#### Solution

1. Vérifier les types générés Payload :
```bash
npm run generate:payload-types
```

2. Ajouter des casts `as any` si nécessaire (temporaire)

3. Vérifier que toutes les dépendances sont dans `package.json`

---

### Problème : MongoDB connection timeout

#### Symptôme
```
MongoServerError: connection timeout
```

#### Solution

1. Vérifier que l'IP est whitelistée dans MongoDB Atlas
2. Vérifier la connection string dans `.env`
3. Tester la connexion :
```bash
npx tsx scripts/check-all-users.mjs
```

---

### Problème : Payload admin inaccessible

#### Symptôme
Page blanche ou 404 sur `/admin`

#### Solution

1. Vérifier que `PAYLOAD_SECRET` est défini
2. Vérifier le build :
```bash
npm run build
```

3. Vérifier les logs Next.js

---

### Problème : Webhooks Medusa ne fonctionnent pas

#### Symptôme
Orders non créés dans Payload après commande

#### Solution

1. Vérifier que l'URL webhook est configurée dans Medusa
2. Tester manuellement :
```bash
curl -X POST https://votre-url.vercel.app/api/webhooks/medusa \
  -H "Content-Type: application/json" \
  -d '{"type":"order.placed","data":{"id":"order_123"}}'
```

3. Vérifier les logs Vercel pour erreurs

---

## Ressources

### Documentation officielle

- [Next.js 16](https://nextjs.org/docs)
- [Payload CMS v3](https://payloadcms.com/docs)
- [NextAuth.js v5](https://authjs.dev/)
- [Medusa.js](https://docs.medusajs.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [MongoDB](https://www.mongodb.com/docs/)

### Support

- **Email** : benjamin@avdigital.fr
- **GitHub Issues** : https://github.com/BenjaminAV2/stickers-storefront/issues
- **Payload Community** : https://payloadcms.com/community
- **Medusa Discord** : https://discord.gg/medusajs

---

**Document créé le** : 27 novembre 2025
**Dernière mise à jour** : 27 novembre 2025
**Version** : 1.0.0
