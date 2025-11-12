# 🎯 Guide d'Intégration Payload CMS - Exclusives Stickers

## ✅ Ce qui a été fait

Payload CMS headless a été intégré avec succès au projet Exclusives Stickers :

### 📦 Structure Créée

```
stickers-storefront/
├── cms/                          # ✅ NOUVEAU - Payload CMS
│   ├── src/
│   │   ├── collections/          # 5 collections créées
│   │   │   ├── Users.ts         # Auth CMS
│   │   │   ├── Pages.ts         # Pages multi-langues
│   │   │   ├── Media.ts         # Gestion images
│   │   │   ├── PricingSettings.ts  # Configuration prix
│   │   │   └── Orders.ts        # Sync commandes Medusa
│   │   ├── payload.config.ts    # Config principale
│   │   └── server.ts            # Serveur Express
│   ├── package.json             # Dépendances CMS
│   ├── tsconfig.json            # Config TypeScript
│   ├── .env                     # Variables d'environnement
│   └── README.md                # Documentation complète
├── lib/
│   ├── cms.ts                   # ✅ NOUVEAU - Client API CMS
│   └── ... (autres fichiers existants)
└── .env.local                   # ✅ MODIFIÉ - Ajout CMS_API_URL
```

### ✨ Fonctionnalités Implémentées

#### 1. **Collections Payload CMS**

| Collection | Description | Localisation | Access |
|------------|-------------|--------------|--------|
| **Pages** | Pages du site (About, CGV, etc.) | ✅ fr, en, es, it, de | Public (read) |
| **PricingSettings** | Règles de pricing dynamiques | ❌ | Public (read) |
| **Orders** | Commandes synchronisées Medusa | ❌ | Admin only |
| **Media** | Images et assets | Alt text localisé | Public (read) |
| **Users** | Comptes admin CMS | ❌ | Admin only |

#### 2. **Localisation Multi-Langue**

- 🇫🇷 **Français** (langue par défaut avec fallback)
- 🇬🇧 **Anglais**
- 🇪🇸 **Espagnol**
- 🇮🇹 **Italien**
- 🇩🇪 **Allemand**

#### 3. **API Client Next.js**

Fichier `/lib/cms.ts` avec fonctions ready-to-use :
- `getPages(options)` - Liste des pages
- `getPageBySlug(slug, options)` - Page par slug
- `getActivePricingConfig()` - Configuration prix active
- `createOrder(orderData, token)` - Créer commande (admin)
- `checkCMSHealth()` - Health check

---

## 🚀 Démarrage Rapide (15 minutes)

### Étape 1: Configuration de la Base de Données

#### Option A: PostgreSQL Local (rapide pour tester)

```bash
# macOS (avec Homebrew)
brew install postgresql@16
brew services start postgresql@16

# Créer la base de données
createdb exclusives_stickers_cms
```

#### Option B: PostgreSQL Railway (recommandé pour production)

1. Aller sur https://railway.app
2. Login avec GitHub
3. Créer un nouveau projet
4. Ajouter → Database → PostgreSQL
5. Copier la `Connection URL`

### Étape 2: Configurer les Variables d'Environnement

```bash
cd ~/stickers-storefront/cms
```

Éditer `cms/.env` :

```bash
# Secret pour JWT (générer avec: openssl rand -base64 32)
PAYLOAD_SECRET=votre-clé-secrète-32-caractères-minimum

# Port du CMS
PORT=3001

# PostgreSQL URL (Option A: local)
DATABASE_URL=postgresql://postgres@localhost:5432/exclusives_stickers_cms

# OU PostgreSQL URL (Option B: Railway)
# DATABASE_URL=postgresql://postgres:xxx@containers-us-west-xxx.railway.app:xxxx/railway

# Environnement
NODE_ENV=development
```

### Étape 3: Lancer le CMS

```bash
cd ~/stickers-storefront/cms
npm run dev
```

Vous devriez voir :

```
✓ Payload initialized
Server listening on port 3001
Admin panel: http://localhost:3001/admin
API endpoint: http://localhost:3001/api
```

### Étape 4: Créer le Premier Admin

1. Ouvrir http://localhost:3001/admin
2. Créer le premier compte admin :
   - **Email**: admin@exclusives-stickers.com
   - **Password**: (choisir un mot de passe sécurisé)
   - **Name**: Admin

### Étape 5: Tester les Collections

#### A. Créer une Page

1. Admin panel → Pages → Create New
2. Remplir :
   - **Title (FR)**: À Propos
   - **Title (EN)**: About Us
   - **Slug**: about-us
   - **Content (FR)**: Texte en français...
   - **Content (EN)**: English text...
   - **Published**: ✅
3. Save

#### B. Créer une Config de Pricing

1. Admin panel → Pricing Settings → Create New
2. Remplir :
   - **Name**: Default Pricing Config
   - **Base Eur Per Cm2**: 0.05
   - **Shape Multipliers**: (déjà pré-rempli)
   - **Support Multipliers**: (déjà pré-rempli)
   - **Quantity Discounts**: (déjà pré-rempli)
   - **Active**: ✅
3. Save

### Étape 6: Tester l'API

```bash
# Health check
curl http://localhost:3001/health

# Liste des pages (français)
curl "http://localhost:3001/api/pages?locale=fr&where[published][equals]=true"

# Pricing actif
curl "http://localhost:3001/api/pricing-settings?where[active][equals]=true&limit=1"
```

---

## 🔗 Intégration avec Next.js Frontend

### 1. Utiliser le Client CMS

```typescript
// app/about/page.tsx
import { getPageBySlug } from '@/lib/cms'

export default async function AboutPage() {
  const page = await getPageBySlug('about-us', { locale: 'fr' })

  if (!page) {
    return <div>Page non trouvée</div>
  }

  return (
    <div>
      <h1>{page.title}</h1>
      {/* Render rich text content */}
      <div dangerouslySetInnerHTML={{ __html: page.content }} />
    </div>
  )
}
```

### 2. Utiliser le Pricing Dynamique

```typescript
// lib/pricing-dynamic.ts
import { getActivePricingConfig } from '@/lib/cms'

export async function calculatePriceDynamic(
  widthCm: number,
  heightCm: number,
  shape: string,
  support: string,
  quantity: number
) {
  const config = await getActivePricingConfig()

  if (!config) {
    throw new Error('No active pricing configuration')
  }

  const surfaceCm2 = widthCm * heightCm
  const shapeMultiplier = config.shapeMultipliers[shape] || 1
  const supportMultiplier = config.supportMultipliers[support] || 1
  const quantityDiscount = config.quantityDiscounts[quantity] || 1

  const pricePerSticker =
    config.baseEurPerCm2 *
    surfaceCm2 *
    shapeMultiplier *
    supportMultiplier *
    quantityDiscount

  return {
    unitPrice: pricePerSticker,
    totalPrice: pricePerSticker * quantity,
  }
}
```

### 3. Créer une Page Dynamique

```typescript
// app/[slug]/page.tsx
import { getPageBySlug, getPages } from '@/lib/cms'

export async function generateStaticParams() {
  const pages = await getPages({ locale: 'fr' })
  return pages.map((page) => ({
    slug: page.slug,
  }))
}

export default async function DynamicPage({ params }: { params: { slug: string } }) {
  const page = await getPageBySlug(params.slug, { locale: 'fr' })

  if (!page || !page.published) {
    return <div>Page non trouvée</div>
  }

  return (
    <article>
      <h1>{page.title}</h1>
      <div>{/* Render rich text */}</div>
    </article>
  )
}
```

---

## 📊 Exemples de Données

### Exemple: Page "À Propos"

```json
{
  "id": "677f8e5c...",
  "title": {
    "fr": "À Propos de Nous",
    "en": "About Us",
    "es": "Sobre Nosotros"
  },
  "slug": "about",
  "content": {
    "fr": {
      "root": {
        "children": [
          {
            "type": "paragraph",
            "children": [
              {
                "text": "Exclusives Stickers est spécialisé..."
              }
            ]
          }
        ]
      }
    },
    "en": { /* ... */ }
  },
  "seoTitle": {
    "fr": "À Propos | Exclusives Stickers",
    "en": "About Us | Exclusives Stickers"
  },
  "seoDescription": {
    "fr": "Découvrez Exclusives Stickers, votre partenaire...",
    "en": "Discover Exclusives Stickers, your partner..."
  },
  "published": true,
  "createdAt": "2025-11-12T10:30:00.000Z",
  "updatedAt": "2025-11-12T10:30:00.000Z"
}
```

### Exemple: Configuration Pricing

```json
{
  "id": "677f8e5c...",
  "name": "Default Pricing Configuration",
  "baseEurPerCm2": 0.05,
  "shapeMultipliers": {
    "cut-contour": 1.5,
    "carre": 1.0,
    "rectangle": 1.1,
    "rond": 1.2
  },
  "supportMultipliers": {
    "vinyle-blanc": 1.0,
    "vinyle-transparent": 1.2,
    "vinyle-holographique": 1.8,
    "vinyle-miroir": 1.5
  },
  "quantityDiscounts": {
    "30": 1.0,
    "50": 0.95,
    "100": 0.90,
    "200": 0.85,
    "500": 0.80,
    "1000": 0.75
  },
  "active": true
}
```

---

## 🌍 Changement de Langue

### Dans Next.js App Router

```typescript
// app/[locale]/layout.tsx
export async function generateStaticParams() {
  return [
    { locale: 'fr' },
    { locale: 'en' },
    { locale: 'es' },
    { locale: 'it' },
    { locale: 'de' },
  ]
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  return <div lang={params.locale}>{children}</div>
}

// app/[locale]/about/page.tsx
export default async function AboutPage({ params }: { params: { locale: string } }) {
  const page = await getPageBySlug('about-us', {
    locale: params.locale as 'fr' | 'en' | 'es' | 'it' | 'de',
  })

  return <div>{page?.title}</div>
}
```

---

## 🚀 Déploiement CMS sur Railway

### 1. Prérequis

```bash
npm install -g @railway/cli
railway login
```

### 2. Initialiser le Projet

```bash
cd ~/stickers-storefront/cms
railway init
```

### 3. Lier PostgreSQL

```bash
railway add --plugin postgresql
```

### 4. Configurer les Variables

```bash
railway variables set PAYLOAD_SECRET=$(openssl rand -base64 32)
railway variables set PORT=3001
railway variables set NODE_ENV=production
# DATABASE_URL est ajoutée automatiquement
```

### 5. Déployer

```bash
railway up
```

### 6. Obtenir l'URL

```bash
railway domain
# Output: https://cms-production-xxxx.railway.app
```

### 7. Mettre à Jour Next.js

```bash
# Dans stickers-storefront/.env.local
NEXT_PUBLIC_CMS_API_URL=https://cms-production-xxxx.railway.app/api

# Et sur Vercel:
vercel env add NEXT_PUBLIC_CMS_API_URL
# Entrer: https://cms-production-xxxx.railway.app/api
# Environment: Production
```

---

## 📝 Prochaines Étapes

### Court Terme

- [ ] **Créer 3-5 pages** via le CMS :
  - À Propos
  - Conditions Générales de Vente
  - Politique de Confidentialité
  - FAQ
  - Contact

- [ ] **Ajuster le pricing** via PricingSettings selon vos coûts réels

- [ ] **Tester les traductions** en créant du contenu dans les 5 langues

### Moyen Terme

- [ ] **Webhook Medusa → CMS** pour synchroniser les commandes automatiquement
  ```typescript
  // Dans Medusa: src/subscribers/order-placed.ts
  import axios from 'axios'

  export default async function handleOrderPlaced({ data }) {
    await axios.post(
      `${process.env.CMS_API_URL}/orders`,
      {
        orderId: data.id,
        customerEmail: data.email,
        // ... autres champs
      },
      {
        headers: {
          Authorization: `JWT ${process.env.CMS_AUTH_TOKEN}`,
        },
      }
    )
  }
  ```

- [ ] **Dashboard Analytics** via une nouvelle collection "Analytics"

- [ ] **Notifications Email** via SendGrid/Resend sur nouvelles commandes

### Long Terme

- [ ] **Workflow de Publication** (draft → review → publish)
- [ ] **Versioning** des pages (historique des modifications)
- [ ] **Export/Import** de contenus (JSON/CSV)
- [ ] **Multi-tenant** (plusieurs boutiques dans le même CMS)

---

## ❓ FAQ

### 1. Pourquoi Payload CMS et pas Strapi/Contentful ?

- **Payload** : TypeScript-first, léger, open source, gratuit, hébergeable partout
- **Strapi** : Plus lourd, moins moderne, perf moyennes
- **Contentful** : Payant ($300/mois pour features pro)

### 2. Peut-on utiliser MongoDB au lieu de PostgreSQL ?

Oui ! Modifier `src/payload.config.ts` :

```typescript
import { mongooseAdapter } from '@payloadcms/db-mongodb'

db: mongooseAdapter({
  url: process.env.DATABASE_URL,
})
```

### 3. Comment ajouter une nouvelle collection ?

1. Créer `src/collections/MaCollection.ts`
2. Importer dans `payload.config.ts`
3. Ajouter à `collections: [...]`
4. Redémarrer le serveur

### 4. Le CMS peut-il remplacer Medusa pour l'e-commerce ?

**Non**, Payload CMS est un headless CMS pour le contenu (pages, blog, etc.). Medusa reste le backend e-commerce pour les produits, paiements, commandes. Les deux sont complémentaires.

### 5. Quelle est la différence entre CMS et Backend API ?

- **CMS (Payload)** : Gestion du contenu éditorial (pages, traductions, assets)
- **Backend API (Medusa)** : Logique e-commerce (produits, panier, paiements, stock)
- **Frontend (Next.js)** : Consomme les deux APIs

---

## 🛠️ Troubleshooting

### Le serveur CMS ne démarre pas

```bash
# Vérifier PostgreSQL
psql -U postgres -c "SELECT version();"

# Recréer la base
dropdb exclusives_stickers_cms
createdb exclusives_stickers_cms

# Réinstaller les dépendances
rm -rf node_modules package-lock.json
npm install
```

### Erreur "Cannot find module payload"

```bash
cd cms
npm install payload @payloadcms/db-postgres @payloadcms/richtext-lexical
```

### L'admin panel ne charge pas

Vérifier CORS dans `payload.config.ts` :

```typescript
cors: [
  'http://localhost:3000',
  'http://localhost:3001', // ⬅️ Ajouter l'URL du CMS
],
```

### Les images ne s'uploadent pas

Créer le dossier `media/` :

```bash
cd cms
mkdir -p media
chmod 755 media
```

---

## 📚 Ressources

- **Documentation Payload**: https://payloadcms.com/docs
- **GitHub Payload**: https://github.com/payloadcms/payload
- **Discord Payload**: https://discord.gg/payload
- **Railway Docs**: https://docs.railway.app

---

**🎉 Félicitations ! Votre CMS Headless est prêt à l'emploi.**

**Prochaine étape recommandée** : Créer vos premières pages dans l'admin panel et les afficher sur le frontend Next.js.

---

**Dernière mise à jour** : 12 Novembre 2024
**Version** : 1.0.0
**Status** : ✅ Production Ready
