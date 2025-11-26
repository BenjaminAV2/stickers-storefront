# Documentation Projet Exclusives Stickers

## 📋 Table des matières
1. [Vue d'ensemble](#vue-densemble)
2. [Architecture technique](#architecture-technique)
3. [Technologies utilisées](#technologies-utilisées)
4. [Structure du projet](#structure-du-projet)
5. [Fonctionnalités implémentées](#fonctionnalités-implémentées)
6. [Fonctionnalités à développer](#fonctionnalités-à-développer)
7. [Accès et URLs](#accès-et-urls)
8. [Configuration](#configuration)
9. [API et intégrations](#api-et-intégrations)
10. [Déploiement](#déploiement)
11. [Guide de développement](#guide-de-développement)

---

## 🎯 Vue d'ensemble

**Exclusives Stickers** est une plateforme e-commerce moderne de vente de stickers personnalisés pour marques et événements exclusifs. Le projet combine :
- Un **storefront Next.js 16** (frontend client)
- Un **CMS Payload** intégré (gestion du contenu)
- Une **API Medusa** (backend e-commerce - séparé)

### Objectifs du projet
- Vendre des stickers personnalisés haute qualité
- Offrir une configuration produit flexible (tailles, quantités, formes de support)
- Processus de checkout optimisé avec sélection de transporteur
- Interface admin pour gérer les commandes, les pages et les paramètres

---

## 🏗️ Architecture technique

### Architecture globale

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT (Navigateur)                     │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              Next.js 16 Storefront (Vercel)                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Frontend (React 19 + Tailwind CSS 4)               │   │
│  │  - Pages: Home, Products, Checkout, Cart            │   │
│  │  - Components: ProductCard, SizePicker, etc.        │   │
│  │  - Context: CartContext, CheckoutContext            │   │
│  └─────────────────────────────────────────────────────┘   │
│                         │                                    │
│  ┌─────────────────────┴─────────────────────────────┐     │
│  │  CMS Payload (intégré)                            │     │
│  │  - Admin: /admin                                  │     │
│  │  - Collections: Orders, Pages, ShippingProviders │     │
│  │  - Database: MongoDB                              │     │
│  └───────────────────────────────────────────────────┘     │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              Medusa Backend API (Railway)                   │
│  - Products, Variants, Pricing                              │
│  - Orders Management                                        │
│  - Payments (Stripe)                                        │
└─────────────────────────────────────────────────────────────┘
```

### Flux de données

1. **Produits** : Medusa → Next.js API Routes → Frontend
2. **Panier** : Context local (CartContext) → Medusa au checkout
3. **Commandes** : Medusa → Webhook → Payload CMS (synchronisation)
4. **Contenu CMS** : Payload MongoDB → Next.js API → Frontend
5. **Paiement** : Stripe (via Medusa)

---

## 💻 Technologies utilisées

### Frontend
- **Next.js 16.0.1** - Framework React avec App Router
- **React 19.2.0** - Bibliothèque UI
- **TypeScript 5** - Typage statique
- **Tailwind CSS 4** - Framework CSS utility-first
- **Lucide React** - Icônes
- **React Hot Toast** - Notifications
- **Lottie React** - Animations

### CMS & Backend
- **Payload CMS 3.63.0** - Headless CMS
  - `@payloadcms/next` - Intégration Next.js
  - `@payloadcms/db-mongodb` - Adapter MongoDB
  - `@payloadcms/richtext-lexical` - Éditeur de texte riche
- **MongoDB** - Base de données NoSQL
- **Sharp** - Traitement d'images

### E-commerce
- **Medusa.js** - Backend e-commerce (API séparée)
- **Stripe** - Paiement en ligne
- **PayPal** - Alternative de paiement (prévu)

### Déploiement
- **Vercel** - Hébergement frontend + CMS
- **Railway** - Hébergement backend Medusa
- **MongoDB Atlas** - Base de données production
- **Git + GitHub** - Contrôle de version

---

## 📁 Structure du projet

```
stickers-storefront/
├── app/                          # Next.js App Router
│   ├── (frontend)/              # Routes frontend
│   │   ├── page.tsx             # Page d'accueil
│   │   ├── products/            # Catalogue produits
│   │   │   ├── page.tsx         # Liste des produits
│   │   │   └── [handle]/        # Détail produit
│   │   │       └── page.tsx
│   │   └── checkout/            # Processus de commande
│   │       └── page.tsx         # Page checkout refactorisée
│   ├── (payload)/               # Routes Payload CMS
│   │   ├── admin/               # Interface admin
│   │   └── api/                 # API Payload
│   ├── api/                     # API Routes custom
│   │   ├── products/            # Proxy Medusa products
│   │   ├── cart/                # Gestion panier
│   │   └── webhooks/            # Webhooks Medusa
│   ├── cart/                    # Page panier
│   │   └── page.tsx
│   ├── globals.css              # Styles globaux
│   ├── layout.tsx               # Layout principal
│   └── page.tsx                 # Page d'accueil
│
├── components/                   # Composants React réutilisables
│   ├── checkout/                # Composants checkout
│   │   ├── AddressForm.tsx      # Formulaire adresse
│   │   ├── OrderSummary.tsx     # Récapitulatif commande
│   │   ├── PaymentSelector.tsx  # Sélection paiement
│   │   ├── ShippingMethodSelector.tsx
│   │   └── RelayPointPicker.tsx
│   ├── CartContent.tsx          # Contenu du panier
│   ├── CartItem.tsx             # Item du panier
│   ├── Header.tsx               # En-tête site
│   ├── Footer.tsx               # Pied de page
│   ├── ProductCard.tsx          # Carte produit
│   ├── ProductsClient.tsx       # Liste produits (client)
│   ├── ProductConfigurator.tsx  # Configuration produit
│   ├── ProductImageSlider.tsx   # Slider images produit
│   ├── SizePicker.tsx           # Sélection taille
│   ├── QuantityMatrix.tsx       # Matrice quantités/prix
│   ├── SupportShapePicker.tsx   # Sélection forme support
│   └── StickyCheckoutButton.tsx # Bouton panier sticky
│
├── contexts/                     # React Context
│   ├── CartContext.tsx          # Gestion panier
│   └── CheckoutContext.tsx      # Gestion checkout
│
├── hooks/                        # Custom React Hooks
│   ├── useFilteredShippers.ts   # Filtrage transporteurs
│   └── useProductPricing.ts     # Calcul prix produit
│
├── lib/                          # Utilitaires
│   ├── medusa/                  # Client API Medusa
│   │   └── client.ts
│   ├── types/                   # Types TypeScript
│   │   ├── checkout.ts
│   │   ├── medusa.ts
│   │   └── product.ts
│   ├── pricing.ts               # Logique de prix
│   └── utils.ts                 # Fonctions utilitaires
│
├── payload/                      # Configuration Payload CMS
│   └── collections/             # Collections CMS
│       ├── Users.ts             # Utilisateurs admin
│       ├── Pages.ts             # Pages dynamiques
│       ├── Media.ts             # Médias (images)
│       ├── Orders.ts            # Commandes (sync Medusa)
│       ├── ShippingProviders.ts # Transporteurs
│       └── PricingSettings.ts   # Paramètres de prix
│
├── public/                       # Assets statiques
│   ├── images/                  # Images
│   ├── animations/              # Animations Lottie
│   └── logos/                   # Logos transporteurs
│
├── scripts/                      # Scripts utilitaires
│   └── sync-medusa-orders.ts    # Sync commandes Medusa
│
├── .env.local                   # Variables d'environnement (local)
├── .env.example                 # Template variables d'env
├── next.config.ts               # Configuration Next.js
├── payload.config.ts            # Configuration Payload
├── tailwind.config.js           # Configuration Tailwind
├── tsconfig.json                # Configuration TypeScript
├── package.json                 # Dépendances npm
│
└── Documentation/               # Documentation
    ├── CHECKOUT_README.md       # Doc checkout
    ├── CMS_INTEGRATION_GUIDE.md # Guide CMS
    ├── DEPLOYMENT.md            # Guide déploiement
    ├── MEDUSA_SYNC_SETUP.md     # Config sync Medusa
    └── PRODUCTION_SETUP.md      # Setup production
```

---

## ✅ Fonctionnalités implémentées

### 🛍️ Catalogue & Produits
- ✅ Page d'accueil avec hero section et slider produits
- ✅ Liste de produits avec filtres et catégories
- ✅ Page détail produit avec :
  - Slider d'images produit
  - Sélection de taille (8 tailles de 4x4cm à 20x20cm)
  - Matrice quantité/prix dynamique (paliers de prix)
  - Sélection de forme de support (Carré, Rond, Ovale, Rectangle)
  - Calcul de prix en temps réel
  - Ajout au panier avec configuration
- ✅ Gestion du panier (CartContext)
  - Ajout/suppression d'articles
  - Modification des quantités
  - Persistance locale (localStorage)
  - Calcul des totaux TTC/HT
  - TVA 20%

### 🚚 Checkout & Livraison
- ✅ Page checkout refactorisée (single-page)
  - 4 étapes visuelles : Adresse, Livraison, Paiement, Confirmation
  - Progression basée sur la complétion des champs
  - Indicateurs de progression sticky (desktop/mobile)
- ✅ Formulaire d'adresse complet
  - Validation des champs email, téléphone, adresse
  - Sélection pays (France, Belgique, Suisse, etc.)
  - Code postal pour filtrage des transporteurs
- ✅ Sélection du mode de livraison
  - Filtrage des transporteurs par pays et code postal
  - Affichage des délais de livraison
  - Prix de livraison dynamique
  - Support point relais (Mondial Relay, etc.)
  - Logos des transporteurs
  - Réinitialisation si adresse modifiée
- ✅ Récapitulatif de commande (OrderSummary)
  - Liste des articles du panier
  - Sous-total HT
  - TVA (20%)
  - Frais de livraison
  - Total TTC
  - Sticky en desktop
- ✅ Validation et erreurs
  - Validation des champs obligatoires
  - Scroll automatique vers les erreurs
  - Bordures rouges sur erreurs
  - Messages d'erreur contextuels

### 🎨 UI/UX
- ✅ Design moderne et épuré (violet #5b40d7)
- ✅ Responsive mobile/tablet/desktop
- ✅ Header sticky avec panier
- ✅ Animations Lottie
- ✅ Notifications toast (succès/erreur)
- ✅ Loading states
- ✅ Transitions fluides

### 🔧 CMS Payload
- ✅ Configuration de base Payload CMS
- ✅ Collections implémentées :
  - **Users** : Utilisateurs admin
  - **Pages** : Pages dynamiques (à configurer)
  - **Media** : Gestion des médias/images
  - **Orders** : Synchronisation commandes Medusa
  - **ShippingProviders** : Configuration transporteurs
  - **PricingSettings** : Paramètres de tarification
- ✅ Multi-langue (FR, EN, ES, IT, DE)
- ✅ Interface admin accessible via `/admin`
- ✅ Upload d'images avec Sharp
- ✅ Éditeur Lexical pour contenu riche

### 🔌 Intégrations
- ✅ API Medusa pour produits et commandes
- ✅ Webhook Medusa → Payload pour sync commandes
- ✅ MongoDB pour base de données CMS
- ✅ API Routes Next.js pour proxy Medusa

---

## 🚧 Fonctionnalités à développer

### 🔐 Authentification & Comptes Clients
- ⬜ Système d'authentification (NextAuth.js ?)
- ⬜ Inscription/Connexion client
- ⬜ Page "Mon compte"
  - Informations personnelles
  - Historique des commandes
  - Adresses enregistrées
  - Wishlist (facultatif)
- ⬜ Réinitialisation mot de passe
- ⬜ Protection des routes authentifiées

### 💳 Paiement
- ⬜ Intégration Stripe Checkout
- ⬜ Intégration PayPal
- ⬜ Page de confirmation de paiement
- ⬜ Envoi email de confirmation
- ⬜ Génération PDF facture

### 📦 Gestion des commandes
- ⬜ Tracking de commande
- ⬜ Statuts de commande détaillés
  - En attente
  - Payée
  - En préparation
  - Expédiée
  - Livrée
- ⬜ Notifications email par statut
- ⬜ Numéro de suivi transporteur

### 📝 CMS & Pages dynamiques
- ⬜ Configuration complète des Pages dans Payload
- ⬜ Page "À propos"
- ⬜ Page "CGV/CGU"
- ⬜ Page "Mentions légales"
- ⬜ Page "FAQ"
- ⬜ Page "Contact"
- ⬜ Blog (articles/actualités) - facultatif
- ⬜ Témoignages clients - facultatif

### 🛠️ Admin Payload
- ⬜ Dashboard admin avec statistiques
  - Ventes du jour/mois
  - Commandes en cours
  - Revenus
  - Produits populaires
- ⬜ Gestion avancée des commandes
  - Modification statut
  - Remboursements
  - Notes internes
- ⬜ Gestion des clients
  - Liste clients
  - Détails client
  - Historique d'achat
- ⬜ Gestion des paramètres site
  - Logo
  - Coordonnées
  - Réseaux sociaux
  - Horaires
- ⬜ Gestion des transporteurs
  - Activation/désactivation
  - Modification des prix
  - Zones de livraison
- ⬜ Gestion des codes promo
  - Création
  - Conditions
  - Utilisation
- ⬜ Système de notifications admin

### 🔍 SEO & Performance
- ⬜ Métadonnées dynamiques (next/metadata)
- ⬜ Sitemap XML
- ⬜ robots.txt
- ⬜ Schema.org markup
- ⬜ Open Graph tags
- ⬜ Optimisation images (next/image)
- ⬜ Lazy loading
- ⬜ Analyse de performance (Google Analytics)

### 📧 Emailing
- ⬜ Configuration service email (SendGrid, Mailgun, etc.)
- ⬜ Templates email
  - Confirmation de commande
  - Expédition
  - Livraison
  - Réinitialisation mot de passe
  - Newsletter (facultatif)

### 🌍 Multi-langue
- ⬜ Traduction complète du site
- ⬜ Sélecteur de langue
- ⬜ URLs localisées
- ⬜ Contenu CMS multilingue

### 🎁 Fonctionnalités avancées
- ⬜ Codes promo / réductions
- ⬜ Programme de fidélité
- ⬜ Personnalisation stickers (upload image client)
- ⬜ Devis personnalisé pour grandes quantités
- ⬜ Calcul automatique TVA UE selon pays
- ⬜ Support multi-devises
- ⬜ Système d'avis clients
- ⬜ Comparateur de produits
- ⬜ Recommandations produits

---

## 🔗 Accès et URLs

### Environnement Production

| Service | URL | Description |
|---------|-----|-------------|
| **Storefront** | https://stickers-storefront-84120o6f2-benjaminav2s-projects.vercel.app | Site client principal |
| **Admin CMS** | https://stickers-storefront-84120o6f2-benjaminav2s-projects.vercel.app/admin | Interface admin Payload |
| **Backend Medusa** | https://your-medusa-backend.railway.app | API e-commerce (à configurer) |

### Environnement Développement

| Service | URL | Description |
|---------|-----|-------------|
| **Storefront** | http://localhost:3000 | Site client local |
| **Admin CMS** | http://localhost:3000/admin | Interface admin locale |
| **MongoDB** | mongodb://localhost:27017/exclusives_stickers | Base de données locale |

### Pages principales

| Route | Description |
|-------|-------------|
| `/` | Page d'accueil |
| `/products` | Catalogue produits |
| `/products/[handle]` | Détail d'un produit |
| `/cart` | Panier |
| `/checkout` | Processus de commande |
| `/admin` | Interface admin Payload CMS |

---

## ⚙️ Configuration

### Variables d'environnement

Créer un fichier `.env.local` à la racine du projet :

```bash
# Next.js Public URLs
NEXT_PUBLIC_API_URL=https://your-medusa-backend.railway.app
NEXT_PUBLIC_CMS_API_URL=http://localhost:3000/api

# Payload CMS Configuration
PAYLOAD_SECRET=your-secret-key-generate-with-openssl
DATABASE_URL=mongodb://localhost:27017/exclusives_stickers

# Medusa API Configuration
MEDUSA_API_URL=https://your-medusa-backend.railway.app
MEDUSA_PUBLISHABLE_KEY=pk_your_publishable_key_here

# Medusa Webhook Secret (pour vérifier les webhooks en production)
MEDUSA_WEBHOOK_SECRET=your_webhook_secret_here

# Optional: Medusa Admin Token
MEDUSA_ADMIN_TOKEN=your_admin_token_here
```

### Générer un secret Payload

```bash
openssl rand -base64 32
```

### Configuration MongoDB

**Développement local :**
1. Installer MongoDB : `brew install mongodb-community` (macOS)
2. Démarrer MongoDB : `brew services start mongodb-community`
3. Créer la base de données : `mongosh` puis `use exclusives_stickers`

**Production :**
- Utiliser MongoDB Atlas (cloud)
- Créer un cluster gratuit
- Obtenir l'URL de connexion
- Ajouter à `.env.local` : `DATABASE_URL=mongodb+srv://user:pass@cluster.mongodb.net/exclusives_stickers`

---

## 🔌 API et intégrations

### API Medusa (Backend)

**Base URL:** `https://your-medusa-backend.railway.app`

#### Endpoints principaux utilisés

```typescript
// Produits
GET /store/products              // Liste produits
GET /store/products/:id          // Détail produit

// Panier
POST /store/carts                // Créer un panier
POST /store/carts/:id/line-items // Ajouter au panier
DELETE /store/carts/:id/line-items/:line_id // Supprimer du panier

// Checkout
POST /store/carts/:id/payment-sessions // Créer session paiement
POST /store/carts/:id/complete   // Finaliser commande

// Régions
GET /store/regions               // Liste régions/pays disponibles

// Shipping options
GET /store/shipping-options      // Options de livraison
```

### API Payload CMS

**Base URL:** `/api` (Next.js API Routes + Payload)

#### Collections accessibles

```typescript
// ShippingProviders
GET /api/shipping-providers      // Liste transporteurs
POST /api/shipping-providers     // Créer transporteur (admin)

// Orders
GET /api/orders                  // Liste commandes
GET /api/orders/:id              // Détail commande

// Pages
GET /api/pages                   // Liste pages CMS
GET /api/pages/:slug             // Page par slug

// Media
POST /api/media                  // Upload média
```

### Webhooks Medusa → Payload

Pour synchroniser les commandes de Medusa vers Payload :

```typescript
// Endpoint webhook
POST /api/webhooks/medusa

// Événements écoutés
- order.placed               // Commande créée
- order.updated              // Commande mise à jour
- order.canceled             // Commande annulée
- order.completed            // Commande finalisée
```

Configuration dans Medusa :
1. Aller dans l'admin Medusa
2. Settings → Webhooks
3. Ajouter : `https://your-vercel-app.vercel.app/api/webhooks/medusa`
4. Sélectionner les événements : `order.*`

---

## 🚀 Déploiement

### Déploiement Vercel (Frontend + CMS)

#### Via Vercel CLI

```bash
# Installer Vercel CLI
npm install -g vercel

# Se connecter
vercel login

# Déployer en production
vercel --prod
```

#### Via GitHub

1. Connecter le repo GitHub à Vercel
2. Configurer les variables d'environnement dans Vercel Dashboard
3. Chaque push sur `main` déclenche un déploiement automatique

### Variables d'environnement Vercel

Dans Vercel Dashboard → Settings → Environment Variables :

```
PAYLOAD_SECRET=xxx
DATABASE_URL=mongodb+srv://xxx
MEDUSA_API_URL=https://xxx
MEDUSA_PUBLISHABLE_KEY=pk_xxx
MEDUSA_WEBHOOK_SECRET=xxx
NEXT_PUBLIC_API_URL=https://xxx
```

### Déploiement Medusa Backend (Railway)

Voir la documentation Medusa pour déployer sur Railway.

### Base de données MongoDB Atlas

1. Créer un compte sur https://www.mongodb.com/cloud/atlas
2. Créer un cluster (Free tier M0)
3. Créer un utilisateur de base de données
4. Whitelist l'IP Vercel (ou `0.0.0.0/0` pour toutes)
5. Obtenir l'URL de connexion
6. L'ajouter dans Vercel comme `DATABASE_URL`

---

## 👨‍💻 Guide de développement

### Installation

```bash
# Cloner le repo
git clone https://github.com/BenjaminAV2/stickers-storefront.git
cd stickers-storefront

# Installer les dépendances
npm install

# Créer .env.local
cp .env.example .env.local
# Éditer .env.local avec vos valeurs

# Démarrer MongoDB (local)
brew services start mongodb-community

# Lancer le serveur de développement
npm run dev
```

Le site est accessible sur http://localhost:3000
L'admin Payload sur http://localhost:3000/admin

### Commandes utiles

```bash
# Développement
npm run dev              # Lancer le serveur Next.js

# Build & Production
npm run build            # Build de production
npm run start            # Démarrer en mode production

# Linting
npm run lint             # Vérifier le code

# Payload CMS
npm run generate:payload-types  # Générer les types TypeScript

# Scripts custom
npm run sync:orders      # Synchroniser les commandes Medusa
```

### Structure d'un nouveau composant

```tsx
// components/MonComposant.tsx
'use client'  // Si utilise des hooks ou interactivité

import { useState } from 'react'

interface MonComposantProps {
  title: string
  onAction?: () => void
}

export function MonComposant({ title, onAction }: MonComposantProps) {
  const [state, setState] = useState(false)

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      {/* Contenu */}
    </div>
  )
}
```

### Ajouter une nouvelle collection Payload

```typescript
// payload/collections/MaCollection.ts
import { CollectionConfig } from 'payload'

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
    {
      name: 'description',
      type: 'textarea',
    },
  ],
}
```

Puis ajouter dans `payload.config.ts` :
```typescript
import { MaCollection } from './payload/collections/MaCollection'

export default buildConfig({
  collections: [Users, Pages, Media, MaCollection, ...],
})
```

### Travailler avec le CartContext

```tsx
'use client'

import { useCart } from '@/contexts/CartContext'

export function MonComposant() {
  const { items, addItem, removeItem, totalCents } = useCart()

  const handleAddToCart = () => {
    addItem({
      variantId: 'variant_123',
      productId: 'prod_123',
      title: 'Mon sticker',
      pricePerUnit: 500, // en centimes
      quantity: 10,
      size: '10x10',
      // ...
    })
  }

  return (
    <button onClick={handleAddToCart}>
      Ajouter au panier ({items.length})
    </button>
  )
}
```

### Tests recommandés

```bash
# Tester le build de production
npm run build

# Vérifier les erreurs TypeScript
npx tsc --noEmit

# Tester sur différents navigateurs
# Chrome, Firefox, Safari, Mobile

# Tester les webhooks en local avec ngrok
ngrok http 3000
# Utiliser l'URL ngrok dans Medusa webhooks
```

---

## 📚 Ressources et documentation

### Documentation officielle
- **Next.js 16:** https://nextjs.org/docs
- **Payload CMS 3:** https://payloadcms.com/docs
- **Medusa.js:** https://docs.medusajs.com
- **Tailwind CSS 4:** https://tailwindcss.com/docs
- **React 19:** https://react.dev

### Documentation du projet
- [CHECKOUT_README.md](./CHECKOUT_README.md) - Documentation checkout
- [CMS_INTEGRATION_GUIDE.md](./CMS_INTEGRATION_GUIDE.md) - Guide intégration CMS
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Guide déploiement
- [MEDUSA_SYNC_SETUP.md](./MEDUSA_SYNC_SETUP.md) - Configuration sync Medusa
- [PRODUCTION_SETUP.md](./PRODUCTION_SETUP.md) - Setup production

### Dépôt Git
- **GitHub:** https://github.com/BenjaminAV2/stickers-storefront

---

## 🆘 Résolution de problèmes

### Le serveur ne démarre pas
```bash
# Supprimer .next et node_modules
rm -rf .next node_modules package-lock.json

# Réinstaller
npm install

# Relancer
npm run dev
```

### MongoDB ne se connecte pas
```bash
# Vérifier que MongoDB tourne
brew services list

# Redémarrer MongoDB
brew services restart mongodb-community

# Tester la connexion
mongosh mongodb://localhost:27017/exclusives_stickers
```

### Erreur TypeScript payload-types.ts
```bash
# Régénérer les types
npm run generate:payload-types
```

### Produits Medusa ne s'affichent pas
1. Vérifier `NEXT_PUBLIC_API_URL` dans `.env.local`
2. Vérifier que Medusa backend est accessible
3. Vérifier la clé publishable `MEDUSA_PUBLISHABLE_KEY`
4. Tester l'API directement : `curl https://your-medusa-backend.railway.app/store/products`

### Images ne s'affichent pas
1. Vérifier que Sharp est installé : `npm list sharp`
2. Réinstaller si besoin : `npm install sharp --force`
3. Vérifier les permissions du dossier `public/`

---

## 📝 Notes importantes

### Sécurité
- **Ne jamais commiter** `.env.local` (déjà dans `.gitignore`)
- Utiliser des secrets forts pour `PAYLOAD_SECRET`
- Configurer CORS sur Medusa backend
- Valider toutes les entrées utilisateur côté serveur
- Utiliser HTTPS en production

### Performance
- Optimiser les images avec next/image
- Lazy loading des composants lourds
- Mettre en cache les appels API Medusa
- Utiliser ISR (Incremental Static Regeneration) pour les pages produits
- Minimiser les re-renders avec React.memo

### SEO
- Ajouter des métadonnées à chaque page
- Utiliser des URLs sémantiques
- Optimiser les temps de chargement
- Ajouter des alt text sur toutes les images
- Implémenter les breadcrumbs

---

## 🤝 Contribution

Pour contribuer au projet :

1. Créer une branche : `git checkout -b feature/ma-feature`
2. Commiter les changements : `git commit -m "Add: Ma nouvelle feature"`
3. Push la branche : `git push origin feature/ma-feature`
4. Créer une Pull Request sur GitHub

### Conventions de code
- **Composants** : PascalCase (`ProductCard.tsx`)
- **Fonctions/variables** : camelCase (`handleAddToCart`)
- **Constantes** : UPPER_SNAKE_CASE (`PAYMENT_METHODS`)
- **CSS** : Tailwind classes uniquement (éviter le CSS custom)
- **Types** : Interfaces pour les props, Types pour les unions

---

## 📞 Contact et support

Pour toute question ou problème :
- **GitHub Issues:** https://github.com/BenjaminAV2/stickers-storefront/issues
- **Email:** contact@exclusives-stickers.com (à configurer)

---

**Dernière mise à jour:** 26 novembre 2024
**Version:** 0.1.0
**Statut:** En développement actif
