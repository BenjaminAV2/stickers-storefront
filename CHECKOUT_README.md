# Checkout Configurable - Exclusives Stickers

Système de checkout complet et configurable pour Next.js 16 avec Medusa v2, PayloadCMS et support Stripe/PayPal.

## 📋 Table des matières

- [Architecture](#architecture)
- [Configuration](#configuration)
- [Utilisation](#utilisation)
- [Transporteurs](#transporteurs)
- [Paiements](#paiements)
- [Personnalisation](#personnalisation)

## 🏗️ Architecture

### Structure des fichiers

```
├── app/
│   ├── api/
│   │   └── shipping-providers-filtered/
│   │       └── route.ts                # API pour récupérer les transporteurs filtrés
│   └── (frontend)/
│       └── checkout/
│           ├── page.tsx                # Page checkout principale
│           ├── success/page.tsx        # Page de succès
│           └── failure/page.tsx        # Page d'échec
├── components/
│   └── checkout/
│       ├── ProgressBar.tsx             # Barre de progression des étapes
│       ├── ShippingAddressForm.tsx     # Formulaire d'adresse
│       ├── ShippingMethodSelector.tsx  # Sélection du transporteur
│       └── PaymentSelector.tsx         # Sélection du paiement
├── contexts/
│   └── CheckoutContext.tsx             # Context React pour l'état du checkout
├── hooks/
│   └── useFilteredShippers.ts          # Hook pour filtrer les transporteurs
├── lib/
│   ├── types/
│   │   └── checkout.ts                 # Types TypeScript
│   └── medusa/
│       └── checkout.ts                 # Helpers Medusa
└── payload/
    └── collections/
        └── ShippingProviders.ts        # Collection PayloadCMS
```

## ⚙️ Configuration

### 1. Variables d'environnement

Ajoutez ces variables dans `.env.local` :

```bash
# PayloadCMS
DATABASE_URL=mongodb://localhost:27017/exclusives_stickers
PAYLOAD_SECRET=your-secret-key

# Medusa
MEDUSA_API_URL=https://your-medusa-backend.com
NEXT_PUBLIC_MEDUSA_API_URL=https://your-medusa-backend.com
MEDUSA_WEBHOOK_SECRET=your-webhook-secret

# URLs publiques
NEXT_PUBLIC_API_URL=https://your-medusa-backend.com
NEXT_PUBLIC_CMS_API_URL=http://localhost:3000/api
```

### 2. Installation des dépendances

Les dépendances nécessaires sont déjà installées :
- `lucide-react` : Icônes
- `payload` : CMS headless
- Medusa client

### 3. Base de données

Le checkout nécessite une base MongoDB pour PayloadCMS. La collection `shipping-providers` sera automatiquement créée au premier démarrage.

## 📦 Transporteurs

### Ajouter un transporteur dans PayloadCMS

1. Accédez à l'admin PayloadCMS : `/admin`
2. Naviguez vers **E-commerce** → **Shipping Providers**
3. Cliquez sur **Create New**
4. Remplissez les champs :

#### Champs obligatoires

- **Nom du transporteur** : Ex: "Colissimo"
- **Prix TTC** : Ex: 4.95
- **Délai estimé** : Ex: "2-3 jours ouvrés"
- **Pays desservis** : Sélectionnez un ou plusieurs pays

#### Champs optionnels

- **Description courte** : Ex: "Livraison à domicile"
- **Logo** : Upload le logo du transporteur
- **Règles de code postal** :
  - Activez pour filtrer par code postal
  - Pattern RegEx : Ex: `^75\\d{3}$` pour Paris
  - Description : Ex: "Paris uniquement"

- **Service point relais** :
  - Cochez si c'est un service de point relais
  - Configurez l'API (Mondial Relay, Relais Colis, etc.)

- **URL de suivi** : Ex: `https://tracking.com/{trackingNumber}`
- **Caractéristiques** : Liste de features (Suivi en temps réel, Remise en main propre, etc.)
- **Ordre d'affichage** : Plus petit = affiché en premier
- **Actif** : Désactivez pour masquer temporairement

### Exemples de configuration

#### Colissimo Standard

```
Nom: Colissimo
Prix: 4.95 €
Délai: 2-3 jours ouvrés
Pays: FR, BE, CH
Code postal: Non
Point relais: Non
Features:
  - Suivi en ligne
  - Livraison à domicile
```

#### Mondial Relay

```
Nom: Mondial Relay
Prix: 3.50 €
Délai: 3-5 jours ouvrés
Pays: FR, BE
Code postal: Non
Point relais: Oui
  - Provider: mondial-relay
  - API Key: votre-clé-api
Features:
  - Plus de 10 000 points relais
  - Retrait sous 14 jours
```

#### Chronopost Express (Paris uniquement)

```
Nom: Chronopost Express
Prix: 9.90 €
Délai: 24h
Pays: FR
Code postal: Oui
  - Pattern: ^75\\d{3}$
  - Description: Livraison Paris intra-muros uniquement
Point relais: Non
Features:
  - Livraison express 24h
  - Suivi en temps réel
```

## 💳 Paiements

### Configuration Stripe

1. Créez un compte Stripe : https://stripe.com
2. Configurez Medusa avec Stripe :
   ```bash
   # Dans votre backend Medusa
   npm install @medusajs/medusa-payment-stripe
   ```
3. Ajoutez les clés dans Medusa `.env` :
   ```bash
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_PUBLISHABLE_KEY=pk_test_...
   ```

### Configuration PayPal

1. Créez un compte PayPal Business : https://developer.paypal.com
2. Configurez Medusa avec PayPal :
   ```bash
   # Dans votre backend Medusa
   npm install @medusajs/medusa-payment-paypal
   ```
3. Ajoutez les clés dans Medusa `.env` :
   ```bash
   PAYPAL_CLIENT_ID=your-client-id
   PAYPAL_CLIENT_SECRET=your-client-secret
   ```

## 🎨 Personnalisation

### Couleurs

La couleur primaire du checkout est `#5b40d7` (violet). Pour la changer :

1. Cherchez `#5b40d7` dans les fichiers checkout
2. Remplacez par votre couleur de marque
3. Mettez à jour les variantes hover (ex: `#4a33b8`)

### Pays supportés

Pour ajouter/supprimer des pays, modifiez :

**`components/checkout/ShippingAddressForm.tsx`**
```typescript
const COUNTRIES = [
  { code: 'FR', name: 'France' },
  { code: 'BE', name: 'Belgique' },
  // Ajoutez vos pays ici
]
```

**`payload/collections/ShippingProviders.ts`**
```typescript
options: [
  { label: 'France', value: 'FR' },
  { label: 'Belgique', value: 'BE' },
  // Ajoutez vos pays ici
]
```

### Étapes du checkout

Pour ajouter/modifier les étapes, éditez `app/(frontend)/checkout/page.tsx` :

```typescript
const STEPS = [
  { id: 'address', title: 'Adresse' },
  { id: 'shipping', title: 'Livraison' },
  { id: 'payment', title: 'Paiement' },
  // Ajoutez vos étapes ici
]
```

## 🔌 API

### GET /api/shipping-providers-filtered

Récupère les transporteurs filtrés par pays et code postal.

**Paramètres de requête :**
- `country` (requis) : Code pays (FR, BE, etc.)
- `postal_code` (optionnel) : Code postal pour filtrage
- `locale` (optionnel, défaut: 'fr') : Langue

**Exemple :**
```bash
curl "http://localhost:3000/api/shipping-providers-filtered?country=FR&postal_code=75001"
```

**Réponse :**
```json
{
  "success": true,
  "providers": [
    {
      "id": "provider-id",
      "title": "Colissimo",
      "subtitle": "Livraison à domicile",
      "logo": "/media/colissimo.png",
      "price": 4.95,
      "estimatedDelivery": "2-3 jours ouvrés",
      "isRelayService": false,
      "features": ["Suivi en ligne", "Livraison à domicile"]
    }
  ],
  "count": 1,
  "filters": {
    "country": "FR",
    "postalCode": "75001"
  }
}
```

## 🚀 Déploiement

### Vercel

1. Connectez votre repo GitHub
2. Ajoutez les variables d'environnement
3. Déployez

### Railway (Backend Medusa)

1. Créez un nouveau projet
2. Ajoutez MongoDB
3. Configurez Stripe/PayPal
4. Déployez

## 📱 Mobile-first

Le checkout est optimisé pour mobile :
- Formulaires tactiles optimisés
- Boutons CTA sticky en bas
- Espacements adaptés
- Polices lisibles (16px minimum)

## ♿ Accessibilité

- Labels sur tous les champs
- Focus states visibles
- Navigation clavier complète
- ARIA labels appropriés
- Contraste suffisant (WCAG AA)

## 🐛 Troubleshooting

### Les transporteurs n'apparaissent pas

1. Vérifiez que des transporteurs sont créés dans PayloadCMS
2. Vérifiez qu'ils sont actifs (champ `active`)
3. Vérifiez que le pays correspond
4. Vérifiez les logs de l'API : `/api/shipping-providers`

### Le paiement échoue

1. Vérifiez les clés Stripe/PayPal dans Medusa
2. Vérifiez que Medusa est accessible
3. Vérifiez les logs Medusa
4. Testez avec les clés de test

### Erreur MongoDB

1. Vérifiez que MongoDB est lancé
2. Vérifiez la variable `DATABASE_URL`
3. Vérifiez les permissions de connexion

## 📚 Ressources

- [Documentation Medusa](https://docs.medusajs.com)
- [Documentation PayloadCMS](https://payloadcms.com/docs)
- [Documentation Stripe](https://stripe.com/docs)
- [Documentation Next.js](https://nextjs.org/docs)

## 🤝 Support

Pour toute question, consultez :
- Les issues GitHub
- La documentation Medusa
- Le Discord Medusa

---

**Version** : 1.0.0
**Dernière mise à jour** : 2025-11-12
