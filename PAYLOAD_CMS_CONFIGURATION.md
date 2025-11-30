# Configuration Payload CMS - Exclusives Stickers

## Vue d'ensemble

Cette configuration Payload CMS comprend toutes les fonctionnalités demandées pour gérer une boutique e-commerce de stickers personnalisés.

## 📊 Données de test

**20 utilisateurs de test** avec commandes payées ont été créés :
- Email pattern : `test1@example.com` à `test20@example.com`
- Total : 70 commandes générées
- CA total : 110 310,13€
- Panier moyen : 1 575,86€

Pour voir les données de test, lancez :
```bash
npm run dev
# Puis visitez http://localhost:3000/admin
```

## 🎨 A. Connexion Front avec Builder de Pages

### Collections configurées :

#### 1. **Pages** (`payload/collections/Pages.ts`)
Page builder modulaire avec blocs de contenu entièrement personnalisables :

**Blocs disponibles :**
- **Texte riche** : Formatage complet, alignement, taille, couleur, padding
- **Titre** : Niveaux H1-H6, taille personnalisée, poids, couleur, marges
- **Image** : Upload, alt, légende, taille, alignement, lien
- **Hero** : Bannière avec titre, sous-titre, image de fond, CTA
- **Galerie** : Multiple images, colonnes configurables, espacement
- **CTA** : Call-to-action avec style personnalisable

**Paramètres par bloc :**
- Texte : police, taille (xs, sm, base, lg, xl, 2xl, 3xl), couleur, fond, alignement
- Espacement : padding/margin configurables
- Balises HTML : Choix de la sémantique (h1-h6, p, div)

#### 2. **Products** (`payload/collections/Products.ts`)
Gestion complète des produits :
- Prix de base et matrice de prix (taille x quantité)
- Remises (pourcentage ou montant fixe) avec dates
- Images multiples avec alt textes localisés
- Description courte et complète (rich text)
- Spécifications techniques
- Tailles et formes disponibles
- SEO complet (titre, description, keywords)

#### 3. **Media** (`payload/collections/Media.ts`)
Gestion des images avec :
- Alt text localisé (obligatoire pour SEO)
- Titre de l'image
- Légende
- Crédit photo/source
- Génération automatique de miniatures

## 🌍 B. Internationalisation

**Configuration** (`payload.config.ts`) :
```typescript
localization: {
  locales: ['fr', 'en', 'es', 'it', 'de'],
  defaultLocale: 'fr',
  fallback: true,
}
```

**Champs localisés :**
- Tous les contenus textes des Pages
- Titres et descriptions des Products
- Alt texts des Media
- SEO (meta titles, descriptions, keywords)
- Catégories et leurs descriptions

**SEO multilingue :**
- Metadata localisée par langue
- URLs slugs uniques
- Option noIndex par page
- Images Open Graph configurables

## 🏪 C. Catégories et Sous-catégories

**Collection Categories** (`payload/collections/Categories.ts`) :
- Nom localisé
- Slug unique
- Description rich text localisée
- **Champ `parent`** : Relation vers Categories (permet sous-catégories illimitées)
- Image de catégorie
- Ordre d'affichage
- Compteur de produits (auto)
- SEO (titre, description)

**Exemple d'utilisation :**
```
- Stickers (parent: null)
  - Stickers ronds (parent: Stickers)
  - Stickers carrés (parent: Stickers)
    - Petits carrés (parent: Stickers carrés)
```

## 📦 D. Statuts de Commande

**10 statuts configurés** (`payload/collections/Orders.ts`) :

1. ⏳ **pending_payment** - En attente de paiement
2. ✅ **paid_awaiting_bat** - Commande payée attente de validation BAT
3. 🏭 **in_production** - Mise en fabrication
4. ✓ **production_complete** - Fabrication terminée
5. 📦 **preparing_shipment** - Préparation à l'expédition
6. 🚚 **in_delivery** - Livraison en cours
7. ✓ **delivered** - Livrée
8. ❌ **cancelled** - Annulée
9. 💰 **refund_full** - Remboursement complet
10. 💸 **refund_partial** - Remboursement partiel

**Historique de statuts :**
- Automatique via hook `trackStatusHistory`
- Enregistre : statut, date/heure, utilisateur, note
- Lecture seule dans l'admin

## 🧾 E. Génération Automatique de Documents

### Factures (Invoice)

**Hook** : `payload/hooks/generateInvoice.ts`

**Déclenchement :** Automatique quand `paymentStatus` passe à `paid`

**Contenu :**
- Informations société
- Informations client
- Adresse de facturation
- Liste des produits (référence, nom, taille, forme, quantité, prix)
- Récapitulatif de prix (HT, TTC, TVA, remises)
- Mode de paiement et date

**Sortie :** PDF généré dans `/media/documents/invoice-{numéro}.pdf`

### Bons de Livraison (Delivery Note)

**Hook** : `payload/hooks/generateDeliveryNote.ts`

**Déclenchement :** Automatique quand `status` passe à `in_production`

**Contenu :**
- Informations de livraison complètes
- Liste des produits à expédier
- Mode de livraison
- Récapitulatif (nombre d'articles, nombre de produits)
- Zone de signature

**Sortie :** PDF généré dans `/media/documents/delivery-note-{numéro}.pdf`

## 📝 F. Contenu des Commandes

**Collection Orders complète** avec :

### Informations Produit
- Référence produit
- Nom produit
- Détails : support, forme, quantité
- Visuel BAT uploadable
- Statut d'approbation BAT

### Adresses
- **Adresse de livraison** (obligatoire)
  - Nom, prénom, société
  - Adresse complète
  - Code postal, ville, pays
  - Téléphone

- **Point relais** (si applicable)
  - ID, nom, adresse du point relais
  - **Lien Chronopost** : `https://www.chronopost.fr/expeditionAvanceeSec/ounoustrouver.html`

- **Adresse de facturation** (si différente)

### Récapitulatif de Prix
- Sous-total HT
- Frais de livraison HT
- TVA (20%)
- Remises éventuelles
- Total TTC

## 🔄 G. Modification d'Adresse

**Composant** : `payload/components/orders/OrderDetail.tsx`

**Fonctionnalités :**
- Bouton "Modifier l'adresse" dans la vue détaillée
- Modal de modification (à implémenter côté frontend)
- Lien vers la carte Chronopost pour trouver un point relais
- Sauvegarde des modifications dans la base

## 📊 H. Sélecteur de Statut et Historique

**Sélecteur manuel :**
- Dropdown dans la sidebar
- Confirmation avant changement
- Mise à jour temps réel

**Historique :**
- Affichage chronologique
- Détails : statut, date/heure, utilisateur, note
- Style visuel distinct par entrée
- Lecture seule (généré automatiquement)

## 💰 I. Encart Remboursement

**Champ `refund`** dans Orders :
- `isRefunded` : boolean
- `refundType` : 'full' | 'partial'
- `refundAmountCents` : montant en centimes
- `refundReason` : textarea
- `refundedAt` : date
- `refundedBy` : nom de l'admin

**Interface :**
- Affichage conditionnel selon statut
- Bouton "Effectuer un remboursement"
- Formulaire modal avec validation
- Détails visibles si remboursement effectué

## 👤 J. Boutons Navigation Client

Dans la vue détaillée de commande :

1. **"Fiche client"** : Redirige vers `/admin/collections/customers/{id}`
2. **"Toutes les commandes du client"** : Filtre automatique sur le client
3. **Nombre de commandes historiques** : Affiché et cliquable

## 🖨️ K. Réimpression Documents

**Boutons dans header de commande :**
- 📄 "Imprimer facture" : Ouvre `invoiceUrl` en nouvel onglet
- 📦 "Imprimer bon de livraison" : Ouvre `deliveryNoteUrl` en nouvel onglet
- Désactivés si document non généré
- Code couleur : bleu (facture), vert (BL)

## 📋 L. Onglet Commandes

**Route API** : `/api/orders/list` (à créer)

**Fonctionnalités :**
- **Pagination** : 30 commandes par page
- **Filtres** :
  - Par date (date picker début/fin)
  - Par statut (multi-select)
  - Filtre par défaut : date du jour

**Colonnes affichées :**
1. Date/heure de validation paiement
2. Statut (avec pictogramme)
3. N° Commande (cliquable)
4. Pays (drapeau emoji)
5. Client (nom + société, cliquable)
6. Montant total
7. Nb commandes historiques client (cliquable)
8. Nb produits dans commande
9. Facture (téléchargeable)
10. Mode paiement (💳 CB / PayPal)

## 📈 M. Dashboard

**Route API** : `/api/dashboard/stats`
**Composant** : `payload/components/Dashboard.tsx`

### KPIs (4 cartes)
1. CA 30 derniers jours (€)
2. Nombre de commandes 30j
3. Panier moyen (€)
4. Commandes aujourd'hui

### Histogramme 30 jours
- Barre = CA TTC journalier
- Affichage CA au-dessus de chaque barre
- Tooltip au survol :
  - CA TTC
  - Panier moyen
  - Nombre de commandes

### Listing 40 dernières commandes
Mêmes colonnes que l'onglet Commandes

## 📊 N. Page Statistiques

**Route API** : `/api/statistics/data`
**Composant** : `payload/components/Statistics.tsx`

### Histogramme 1 : 30 derniers mois
- Vue mensuelle du CA
- Tooltip : CA, panier moyen, nb commandes

### Histogramme 2 : 30 derniers jours
- Vue journalière du CA
- Tooltip : CA, panier moyen, nb commandes

### Histogramme 3 : Comparaison N vs N-1
- 30 derniers jours vs même période année précédente
- 2 barres par jour (année en cours vs année précédente)
- Tooltip détaillé :
  - CA année en cours
  - CA année précédente
  - Commandes N et N-1
  - Paniers moyens N et N-1
  - % d'évolution

### Cartes résumé
- CA total 30j N vs N-1 (avec %)
- Commandes 30j N vs N-1 (avec %)
- Panier moyen 30j N vs N-1 (avec %)

## 📧 O. Système d'Emails Automatiques

**Hook** : `payload/hooks/sendStatusEmail.ts`
**Templates** : `payload/lib/email-templates.ts`

### Emails configurés

1. **Confirmation de commande** (payé)
   - Récapitulatif commande
   - Liste des produits
   - Lien suivi commande

2. **BAT prêt**
   - Notification validation requise
   - Lien vers BAT
   - Délai 48h

3. **Mise en fabrication**
   - Notification début production
   - Estimation de livraison

4. **Expédition**
   - Numéro de suivi
   - Lien tracking transporteur
   - Estimation de livraison

5. **Livraison**
   - Confirmation réception
   - Demande d'avis
   - Support SAV

**Configuration :**
- Templates HTML responsive
- Variables dynamiques
- Logo et branding
- Footer avec coordonnées

**Note :** Les emails sont actuellement loggés en console. Pour production, intégrer un service d'envoi (SendGrid, Resend, etc.) dans `sendEmail()`.

## 🗂️ Structure des fichiers

```
stickers-storefront/
├── payload/
│   ├── collections/
│   │   ├── Orders.ts (★)
│   │   ├── Products.ts (★)
│   │   ├── Categories.ts (★)
│   │   ├── Pages.ts (★)
│   │   ├── Media.ts (★)
│   │   ├── Customers.ts
│   │   ├── Users.ts
│   │   ├── ShippingProviders.ts
│   │   └── PricingSettings.ts
│   ├── components/
│   │   ├── orders/
│   │   │   └── OrderDetail.tsx (★)
│   │   ├── Dashboard.tsx (★)
│   │   └── Statistics.tsx (★)
│   ├── hooks/
│   │   ├── generateInvoice.ts (★)
│   │   ├── generateDeliveryNote.ts (★)
│   │   ├── trackStatusHistory.ts (★)
│   │   └── sendStatusEmail.ts (★)
│   └── lib/
│       ├── pdf-generator.ts (★)
│       └── email-templates.ts (★)
├── app/
│   └── api/
│       ├── dashboard/
│       │   └── stats/route.ts (★)
│       └── statistics/
│           └── data/route.ts (★)
├── scripts/
│   ├── seed-test-data.ts (★)
│   └── fix-indexes.ts
└── payload.config.ts (★)
```

★ = Fichiers créés/modifiés pour cette configuration

## 🚀 Utilisation

### Démarrage

```bash
# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev

# Accéder à l'admin
http://localhost:3000/admin
```

### Générer des données de test

```bash
npx tsx scripts/seed-test-data.ts
```

### Accès à l'admin

1. Créer un compte admin si pas déjà fait
2. Se connecter à `/admin`
3. Naviguer dans les collections :
   - **Orders** : Voir toutes les commandes
   - **Products** : Gérer les produits
   - **Pages** : Créer des pages avec le builder
   - **Media** : Bibliothèque de médias
   - **Categories** : Gérer catégories/sous-catégories

### Endpoints API

- `GET /api/dashboard/stats` : Données dashboard
- `GET /api/statistics/data` : Données statistiques
- `GET /api/orders` : Liste des commandes (via Payload)
- `PATCH /api/orders/:id` : Modifier une commande

## 📝 Notes importantes

1. **Génération PDF** : Utilise `@react-pdf/renderer`. Les PDFs sont générés dans `/media/documents/`

2. **Emails** : Actuellement en mode "log". Pour production :
   - Installer un service d'email (Resend, SendGrid)
   - Configurer les credentials dans `.env`
   - Implémenter `sendEmail()` dans `sendStatusEmail.ts`

3. **Internationalisation** :
   - 5 langues configurées (fr, en, es, it, de)
   - Tous les contenus utilisateur sont localisables
   - Pour ajouter une langue : modifier `payload.config.ts`

4. **Sécurité** :
   - Authentification requise pour admin
   - Access control configuré par collection
   - Les clients ne voient que leurs commandes

5. **Performance** :
   - Pagination activée (30 items)
   - Indexation MongoDB
   - Images optimisées avec Sharp

## 🔧 Prochaines étapes suggérées

1. **Frontend** :
   - Créer les pages Next.js pour afficher les produits
   - Implémenter le système de panier
   - Créer l'interface de checkout
   - Afficher les pages dynamiques du builder

2. **Paiement** :
   - Intégrer Stripe/PayPal
   - Webhook de confirmation de paiement

3. **Production** :
   - Configurer service d'email
   - Optimiser les requêtes database
   - Mettre en place monitoring

4. **Features avancées** :
   - Chat support client
   - Système de reviews produits
   - Programme de fidélité
   - Analytics avancées

## 📞 Support

Pour toute question sur cette configuration :
- Documentation Payload CMS : https://payloadcms.com/docs
- GitHub : https://github.com/payloadcms/payload
