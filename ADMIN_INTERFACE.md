# Interface Admin Personnalisée

Cette documentation décrit l'interface admin personnalisée créée pour la gestion des commandes.

## 📍 URLs d'accès

L'interface admin est accessible via les URLs suivantes :

- **Dashboard:** http://localhost:3000/admin-custom/dashboard
- **Liste des commandes:** http://localhost:3000/admin-custom/orders
- **Statistiques:** http://localhost:3000/admin-custom/statistics
- **Détail d'une commande:** http://localhost:3000/admin-custom/orders/[id]

## 🎯 Fonctionnalités implémentées

### 1. Dashboard (`/admin-custom/dashboard`)

**Caractéristiques:**
- Histogramme des 30 derniers jours avec CA TTC journalier
- Affichage du montant au-dessus de chaque barre
- Tooltip au survol affichant:
  - CA TTC
  - Panier moyen
  - Nombre de commandes
- Liste des 40 dernières commandes avec colonnes:
  - Date/Heure de validation du paiement
  - Statut de la commande (avec pictogrammes)
  - Numéro de commande (cliquable vers le détail)
  - Pays (code pays)
  - Nom/Société du client (cliquable vers la fiche)
  - Montant total
  - Mode de paiement (CB/PayPal)

### 2. Liste des Commandes (`/admin-custom/orders`)

**Filtres disponibles:**
- Date de début et date de fin (par défaut: aujourd'hui)
- Statut de la commande (multi-sélection)
- Recherche par numéro de commande ou nom de client
- Bouton de réinitialisation des filtres

**Pagination:**
- 30 commandes par page
- Boutons Précédent/Suivant
- Affichage du total de commandes et du nombre de pages

**Colonnes affichées:**
- Date/Heure de validation du paiement
- Statut avec pictogrammes
- Numéro de commande (lien)
- Pays
- Client (lien vers fiche)
- Montant total
- Nombre de produits
- Mode de paiement

### 3. Statistiques (`/admin-custom/statistics`)

**3 Histogrammes:**
1. **Vue mensuelle:** 30 derniers mois
2. **Vue journalière:** 30 derniers jours de l'année en cours
3. **Vue journalière N-1:** 30 derniers jours de l'année précédente (même période)

**Comparaison année courante vs N-1:**
- CA total sur 30 jours (année courante)
- CA total sur 30 jours (année précédente)
- Évolution en pourcentage

### 4. Détail Commande (`/admin-custom/orders/[id]`)

**Sections affichées:**

#### Informations principales
- Numéro de commande
- Statut actuel
- Date de paiement
- Bouton "Modifier le statut"

#### Produits
- Liste complète des produits
- Référence, nom, taille, support, quantité
- Prix unitaire et total
- Indication BAT (fourni/approuvé)
- Totaux: HT, TVA, Frais de port, TTC

#### Adresses
- Adresse de livraison (ou point relais)
- Adresse de facturation
- Lien vers la carte des points relais Chronopost

#### Historique des statuts
- Timeline complète des changements de statut
- Date/heure, statut, notes, auteur du changement

#### Remboursement
- Affichage si remboursement effectué
- Type (complet/partiel)
- Montant remboursé
- Raison du remboursement
- Date du remboursement

#### Informations client (sidebar)
- Nom, société, email, téléphone
- Bouton "Voir fiche client"
- Bouton "Toutes les commandes" (affiche le nombre)

#### Documents (sidebar)
- Télécharger la facture
- Télécharger le bon de livraison

#### Livraison (sidebar)
- Méthode de livraison
- Numéro de suivi

#### Notes internes (sidebar)
- Zone de texte pour notes internes
- Bouton "Enregistrer les notes"

#### Modal de modification de statut
- Sélecteur de statut avec tous les statuts disponibles
- Bouton de confirmation
- Bouton d'annulation

## 📊 Statuts de commande disponibles

| Statut | Libellé | Pictogramme |
|--------|---------|-------------|
| `pending_payment` | En attente de paiement | ⏳ |
| `paid_awaiting_bat` | Payée - Attente BAT | ✅ |
| `in_production` | En fabrication | 🏭 |
| `production_complete` | Fabrication terminée | ✓ |
| `preparing_shipment` | Préparation expédition | 📦 |
| `in_delivery` | En livraison | 🚚 |
| `delivered` | Livrée | ✓ |
| `cancelled` | Annulée | ❌ |
| `refund_full` | Remboursement complet | 💰 |
| `refund_partial` | Remboursement partiel | 💸 |

## 🔌 API Routes créées

Toutes les API routes sont dans le dossier `app/api/admin/`:

### `/api/admin/dashboard-stats` (GET)
Retourne les statistiques du dashboard:
- `dailyStats`: Tableau des 30 derniers jours avec CA, nombre de commandes, panier moyen
- `recentOrders`: Les 40 dernières commandes

### `/api/admin/orders` (GET)
Liste des commandes avec filtres et pagination.

**Query parameters:**
- `page`: Numéro de page (défaut: 1)
- `limit`: Nombre de résultats (défaut: 30)
- `status`: Filtrer par statut
- `country`: Filtrer par pays
- `search`: Recherche par numéro ou client
- `dateFrom`: Date de début
- `dateTo`: Date de fin

### `/api/admin/orders/[id]` (GET)
Détails d'une commande spécifique.

**Retourne:**
- `order`: Objet commande complet
- `customerOrders`: Toutes les commandes du client

### `/api/admin/orders/[id]` (PATCH)
Mise à jour d'une commande.

**Body:**
- Tous les champs de commande peuvent être mis à jour
- Exemple: `{ "status": "in_production" }`

### `/api/admin/statistics` (GET)
Statistiques avancées.

**Query parameters:**
- `type`: Type de statistiques (`monthly`, `daily`, `daily-previous-year`)

## 🎨 Design mobile-first

Toutes les interfaces sont responsive et optimisées pour mobile:
- Grilles adaptatives (1 colonne sur mobile, 2-3 sur desktop)
- Tableaux avec scroll horizontal sur petit écran
- Navigation simplifiée sur mobile
- Boutons et formulaires tactiles

## 🧩 Architecture des composants

```
components/admin/
├── Dashboard.tsx         # Composant dashboard avec graphique + liste
├── OrdersList.tsx        # Liste des commandes avec filtres
├── OrderDetail.tsx       # Vue détaillée d'une commande
└── Statistics.tsx        # Page statistiques avec 3 graphiques

app/admin-custom/
├── layout.tsx            # Layout avec navigation
├── dashboard/
│   └── page.tsx         # Page dashboard
├── orders/
│   ├── page.tsx         # Page liste des commandes
│   └── [id]/
│       └── page.tsx     # Page détail commande
└── statistics/
    └── page.tsx         # Page statistiques

app/api/admin/
├── dashboard-stats/
│   └── route.ts         # API dashboard
├── orders/
│   ├── route.ts         # API liste commandes
│   └── [id]/
│       └── route.ts     # API détail/update commande
└── statistics/
    └── route.ts         # API statistiques
```

## 📦 Dépendances utilisées

- `recharts`: Bibliothèque de graphiques React
- `date-fns`: Manipulation des dates
- `react-hook-form`: Gestion des formulaires (préparé pour usage futur)
- `zod`: Validation des données (préparé pour usage futur)

## ⚠️ Points d'attention

1. **Authentification**: Les routes admin ne sont pas protégées pour l'instant. À implémenter avec NextAuth ou Payload auth.

2. **Génération PDF**: Les liens de téléchargement des factures et BL ne sont pas encore fonctionnels. Nécessite l'implémentation des hooks Payload pour génération automatique.

3. **Upload BAT**: La fonctionnalité d'upload de BAT client n'est pas encore implémentée dans l'interface de détail.

4. **Modification adresse**: Le formulaire modal de modification d'adresse de livraison n'est pas encore implémenté.

5. **Notes internes**: L'enregistrement des notes internes n'est pas encore connecté à l'API.

6. **Section remboursement**: Le formulaire de remboursement n'est pas encore implémenté.

## 🚀 Prochaines étapes

Voir le fichier `DEVELOPMENT_STATUS.md` pour la liste complète des tâches restantes:
- Génération automatique des PDF (hooks Payload)
- Système d'emails automatiques
- Authentification frontend clients
- Internationalisation complète
- Tests et optimisations
