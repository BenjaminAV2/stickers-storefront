# Exclusives Stickers - Storefront Frontend

## 📦 Projet créé et configuré

**Framework:** Next.js 16 + TypeScript + Tailwind CSS
**API Backend:** Railway (`https://medusa-production-58da.up.railway.app`)

## ✅ Configuration actuelle

### Couleurs brand (Tailwind)
- `primary-orange`: #F1A93B
- `primary-blue`: #519DDA
- `primary-purple`: #4C3ACF
- `primary-black`: #000000

### Classes CSS glossy disponibles
- `.btn-primary` - Bouton avec gradient glossy
- `.btn-secondary` - Bouton bordure avec hover
- `.card-glossy` - Carte avec effet brillant
- `.text-gradient` - Texte avec gradient brand

### Structure du projet
```
stickers-storefront/
├── app/
│   ├── layout.tsx       # Layout avec metadata SEO
│   ├── globals.css      # Styles Tailwind + glossy
│   └── page.tsx         # Page d'accueil (à compléter)
├── lib/
│   ├── api.ts           # Client API complet
│   └── types.ts         # Types TypeScript
├── .env.local           # Variables d'environnement
└── tailwind.config.js   # Config Tailwind avec couleurs
```

## 🎯 Prochaines étapes pour finaliser le frontend

### 1. Créer les composants (prioritaire)
```bash
components/
├── Header.tsx           # Navigation avec logo "Exclusives Stickers"
├── Footer.tsx           # Footer avec réassurances
├── ProductCard.tsx      # Carte produit avec design glossy
└── CartContext.tsx      # Context React pour le panier
```

### 2. Compléter les pages
```bash
app/
├── page.tsx             # Page d'accueil avec hero + grid produits
├── products/
│   ├── page.tsx        # Listing avec filtres (Support/Forme/Taille)
│   └── [id]/page.tsx   # Détail produit avec sélecteur variante
├── cart/
│   └── page.tsx        # Panier avec localStorage
└── checkout/
    └── page.tsx        # Checkout simple
```

### 3. Fonctionnalités à implémenter

#### Gestion du panier (localStorage)
```typescript
// lib/cart.ts à créer
const CART_KEY = 'exclusives_cart'

export function addToCart(variantId: string, quantity: number)
export function getCart(): CartItem[]
export function updateQuantity(itemId: string, quantity: number)
export function removeItem(itemId: string)
```

#### Filtres produits
- Par Support: Vinyle blanc, transparent, holographique, miroir
- Par Forme: Cut contour, carré, rectangle, rond
- Par Taille: 5×5, 8×8, 10×10, 15×15 cm

## 🚀 Lancer en développement

```bash
cd /Users/auriolbenjamin/stickers-storefront
npm run dev
# Ouvre http://localhost:3000
```

## 📱 Design mobile-first requis

### Réassurances à intégrer
- ✓ Qualité professionnelle garantie
- ✓ Livraison rapide sous 48-72h
- ✓ Résistant eau & UV
- ✓ Paiement sécurisé
- ✓ Support client réactif

### Éléments placeholder à remplacer
- [ ] Logo "Exclusives Stickers" (glossy)
- [ ] Images produits (actuellement placeholder)
- [ ] Photos hero section
- [ ] Icons réassurance
- [ ] Photos process/qualité

## 🌐 Backend API disponible

### Endpoints publics (storefront)
- `GET /store/products` - Liste produits
- `GET /store/products/:id` - Détail produit
- `GET /store/categories` - Liste catégories
- `POST /store/cart` - Créer panier
- `POST /store/cart/line-items` - Ajouter au panier
- `PUT /store/cart/line-items/:id` - Modifier quantité
- `DELETE /store/cart/line-items/:id` - Retirer du panier

### Produits disponibles
16 produits (4 supports × 4 formes) avec 4 tailles chacun = 64 variantes

## 📊 Optimisations SEO techniques

### Déjà fait
- ✅ Metadata complète (title, description, OG)
- ✅ Lang="fr" sur <html>
- ✅ Scroll smooth
- ✅ Fonts optimisées (Inter)

### À faire
- [ ] Ajouter schema.org Product pour chaque produit
- [ ] Sitemap.xml dynamique
- [ ] Robots.txt
- [ ] Alt text sur toutes les images
- [ ] URLs SEO-friendly (/produits/sticker-carre-vinyle-blanc)

## 🎨 Design system

### Typographie
- Headers: font-bold avec text-gradient
- Body: font-normal text-gray-700
- CTA: font-semibold uppercase tracking-wide

### Spacing
- Sections: py-12 sm:py-16 lg:py-20
- Cards: p-6 sm:p-8
- Gutters: gap-6 sm:gap-8 lg:gap-12

### Breakpoints Tailwind
- sm: 640px
- md: 768px
- lg: 1024px
- xl: 1280px
- 2xl: 1536px

## 🔧 Commandes utiles

```bash
# Build production
npm run build

# Linter
npm run lint

# Type check
npx tsc --noEmit
```

## 📦 Déploiement Vercel

```bash
# Depuis stickers-storefront/
vercel login
vercel --prod

# Variables d'environnement à configurer sur Vercel:
NEXT_PUBLIC_API_URL=https://medusa-production-58da.up.railway.app
```

## 🎯 Roadmap suggérée

### Phase 1 (MVP - 2-3 jours)
- [ ] Créer Header + Footer
- [ ] Page d'accueil avec grid produits
- [ ] Page détail produit basique
- [ ] Panier localStorage
- [ ] Déployer sur Vercel

### Phase 2 (Features - 1 semaine)
- [ ] Filtres avancés
- [ ] Page checkout complète
- [ ] Gestion variantes (tailles)
- [ ] Animations glossy avancées
- [ ] Intégration Stripe/paiement

### Phase 3 (Polish - 1 semaine)
- [ ] Remplacer tous les placeholders
- [ ] Tests UX mobiles
- [ ] Optimisation performance (Lighthouse 90+)
- [ ] A/B testing CTA
- [ ] Analytics & tracking

## 📞 Support

Backend déployé et opérationnel sur Railway
Frontend base créé et prêt pour le développement

**Prochaine étape recommandée:** Créer les composants Header/Footer et compléter page.tsx avec l'affichage des produits.
