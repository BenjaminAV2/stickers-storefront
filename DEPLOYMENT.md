# Guide de déploiement - Exclusives Stickers

## Architecture du projet

```
┌─────────────────┐         ┌──────────────────┐         ┌──────────────────┐
│                 │         │                  │         │                  │
│  Medusa.js v2   │────────▶│   Next.js 16     │────────▶│   Payload CMS    │
│  (Railway)      │ webhook │   (Vercel)       │         │   (MongoDB)      │
│  PostgreSQL     │         │   Storefront     │         │                  │
│                 │         │   + Admin CMS    │         │                  │
└─────────────────┘         └──────────────────┘         └──────────────────┘
        │                           │                             │
        │                           │                             │
        ▼                           ▼                             ▼
   Port 9000                     Port 3001                  Port 27017
```

## Déploiement sur Vercel

### 1. Préparer le projet

```bash
# S'assurer que le projet build correctement
npm run build

# Vérifier qu'il n'y a pas d'erreurs TypeScript
npm run lint
```

### 2. Installer Vercel CLI (optionnel)

```bash
npm i -g vercel
```

### 3. Déployer via Vercel Dashboard

1. Allez sur [vercel.com](https://vercel.com) et connectez-vous
2. Cliquez sur **New Project**
3. Importez votre dépôt Git
4. Configurez le projet :
   - **Framework Preset** : Next.js
   - **Build Command** : `npm run build`
   - **Output Directory** : `.next`
   - **Install Command** : `npm install --legacy-peer-deps`

### 4. Configurer les variables d'environnement

Dans **Settings** → **Environment Variables**, ajoutez :

#### Variables Payload CMS
```bash
PAYLOAD_SECRET=votre_secret_payload_ici
DATABASE_URL=votre_mongodb_url_ici
```

**Pour générer PAYLOAD_SECRET** :
```bash
openssl rand -base64 32
```

**Pour MongoDB** :
- Option 1 : MongoDB Atlas (recommandé pour production)
  - Créez un cluster gratuit sur [mongodb.com/atlas](https://www.mongodb.com/atlas)
  - Obtenez l'URL de connexion
  - Format : `mongodb+srv://username:password@cluster.mongodb.net/exclusives_stickers`

- Option 2 : Railway MongoDB
  - Créez un nouveau service MongoDB sur Railway
  - Copiez l'URL de connexion depuis les variables d'environnement

#### Variables Medusa
```bash
MEDUSA_API_URL=https://medusa-production-58da.up.railway.app
NEXT_PUBLIC_MEDUSA_API_URL=https://medusa-production-58da.up.railway.app
MEDUSA_WEBHOOK_SECRET=votre_secret_webhook_ici
```

**Pour générer MEDUSA_WEBHOOK_SECRET** :
```bash
openssl rand -base64 32
```

**Note** : Copiez ce secret, vous en aurez besoin pour configurer le webhook dans Medusa

#### Variables publiques
```bash
NEXT_PUBLIC_API_URL=https://medusa-production-58da.up.railway.app
NEXT_PUBLIC_CMS_API_URL=https://votre-app.vercel.app/api
```

### 5. Déployer

```bash
# Via CLI
vercel --prod

# Ou via Git (recommandé)
git push origin main  # Le déploiement se fait automatiquement
```

### 6. Configurer les webhooks Medusa

Une fois déployé, obtenez votre URL Vercel (ex: `https://votre-app.vercel.app`)

#### Option 1 : Via l'admin Medusa

1. Connectez-vous à votre admin Medusa : `https://medusa-production-58da.up.railway.app/app`
2. Allez dans **Settings** → **Webhooks**
3. Créez un nouveau webhook :
   - **URL** : `https://votre-app.vercel.app/api/webhooks/medusa`
   - **Secret** : Le `MEDUSA_WEBHOOK_SECRET` que vous avez généré
   - **Events** : Sélectionnez :
     - order.placed
     - order.updated
     - order.completed
     - order.canceled
     - order.payment_captured
     - order.fulfillment_created
     - order.shipment_created

#### Option 2 : Via Railway logs (si vous n'avez pas accès à l'admin)

```bash
# Récupérez le token admin depuis les logs Railway
# Puis exécutez :
curl -X POST "https://medusa-production-58da.up.railway.app/admin/webhooks" \
  -H "Authorization: Bearer VOTRE_TOKEN_ADMIN" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://votre-app.vercel.app/api/webhooks/medusa",
    "events": [
      "order.placed",
      "order.updated",
      "order.completed",
      "order.canceled",
      "order.payment_captured",
      "order.fulfillment_created",
      "order.shipment_created"
    ]
  }'
```

### 7. Créer le premier utilisateur admin Payload

1. Visitez `https://votre-app.vercel.app/admin`
2. Créez votre premier utilisateur admin
3. Connectez-vous

### 8. Vérifier que tout fonctionne

```bash
# Test du webhook
curl https://votre-app.vercel.app/api/webhooks/medusa

# Devrait retourner :
# {"message":"Medusa webhook endpoint is active","events":[...]}

# Test de l'API Payload
curl https://votre-app.vercel.app/api/pages

# Test du health check Medusa
curl https://medusa-production-58da.up.railway.app/health
```

## Déploiement de Medusa sur Railway (déjà fait)

Votre backend Medusa est déjà déployé sur Railway :
- URL : https://medusa-production-58da.up.railway.app
- Base de données : PostgreSQL (Railway)
- Health check : https://medusa-production-58da.up.railway.app/health

### Obtenir le token admin Medusa

1. Allez sur Railway Dashboard
2. Ouvrez votre service Medusa
3. Allez dans **Logs**
4. Cherchez le token admin dans les logs de démarrage

Ou créez un nouvel admin :
```bash
curl -X POST "https://medusa-production-58da.up.railway.app/admin/users" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@exclusives-stickers.com",
    "password": "MotDePasseSecurise123!"
  }'
```

## Configuration MongoDB Atlas (recommandé pour production)

### 1. Créer un cluster

1. Allez sur [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Créez un compte gratuit
3. Créez un cluster M0 (gratuit)
4. Choisissez une région proche de votre Vercel (ex: Paris pour EU)

### 2. Configurer la sécurité

1. **Database Access** : Créez un utilisateur
   - Username : `exclusives_stickers`
   - Password : Générez un mot de passe sécurisé
   - Rôle : `readWrite` sur la base `exclusives_stickers`

2. **Network Access** : Autorisez les connexions
   - Cliquez sur **Add IP Address**
   - Sélectionnez **Allow Access from Anywhere** (0.0.0.0/0)
   - Ou ajoutez les IPs de Vercel

### 3. Obtenir l'URL de connexion

1. Cliquez sur **Connect**
2. Choisissez **Connect your application**
3. Copiez l'URL de connexion
4. Remplacez `<password>` par votre mot de passe
5. Remplacez `myFirstDatabase` par `exclusives_stickers`

Format final :
```
mongodb+srv://exclusives_stickers:PASSWORD@cluster0.xxxxx.mongodb.net/exclusives_stickers?retryWrites=true&w=majority
```

### 4. Ajouter à Vercel

Dans Vercel → Settings → Environment Variables :
```bash
DATABASE_URL=mongodb+srv://exclusives_stickers:PASSWORD@cluster0.xxxxx.mongodb.net/exclusives_stickers?retryWrites=true&w=majority
```

## Domaine personnalisé (optionnel)

### 1. Acheter un domaine

Exemples : exclusives-stickers.com, exclusives-stickers.fr

### 2. Configurer dans Vercel

1. Allez dans **Settings** → **Domains**
2. Ajoutez votre domaine
3. Suivez les instructions DNS

### 3. Mettre à jour les webhooks

Une fois le domaine configuré, mettez à jour l'URL du webhook dans Medusa :
- Ancienne URL : `https://votre-app.vercel.app/api/webhooks/medusa`
- Nouvelle URL : `https://exclusives-stickers.com/api/webhooks/medusa`

## Monitoring et logs

### Vercel

- **Logs** : Vercel Dashboard → Logs
- **Analytics** : Vercel Dashboard → Analytics
- **Speed Insights** : Activez dans Settings

### Railway (Medusa)

- **Logs** : Railway Dashboard → Logs
- **Metrics** : Railway Dashboard → Metrics

### MongoDB Atlas

- **Metrics** : Atlas Dashboard → Metrics
- **Performance Advisor** : Optimisations suggérées
- **Alerts** : Configurez des alertes

## Sécurité en production

### 1. Secrets et tokens

- ✅ Utilisez toujours `MEDUSA_WEBHOOK_SECRET` en production
- ✅ Changez `PAYLOAD_SECRET` régulièrement
- ✅ Utilisez des mots de passe forts pour MongoDB
- ✅ Ne committez JAMAIS les secrets dans Git

### 2. HTTPS

- ✅ Vercel fournit HTTPS automatiquement
- ✅ Railway fournit HTTPS automatiquement
- ✅ MongoDB Atlas utilise TLS

### 3. CORS

Vérifiez que Medusa autorise votre domaine Vercel :
```javascript
// Dans medusa-config.js
module.exports = {
  projectConfig: {
    store_cors: "https://votre-app.vercel.app,https://exclusives-stickers.com"
  }
}
```

### 4. Rate limiting

Ajoutez un rate limiting dans Next.js pour les webhooks :
```typescript
// app/api/webhooks/medusa/route.ts
import { Ratelimit } from "@upstash/ratelimit"
import { kv } from "@vercel/kv"

const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(10, "10 s"),
})
```

## Backup et restauration

### MongoDB Atlas

1. **Automated Backups** : Activez dans Settings
2. **Snapshots** : Créés automatiquement
3. **Restore** : Atlas Dashboard → Backup → Restore

### Vercel

- Les déploiements sont versionnés
- Rollback possible via Dashboard → Deployments

### Railway

- Snapshots automatiques de PostgreSQL
- Restore via Railway Dashboard

## Troubleshooting

### Webhook ne reçoit pas les événements

1. Vérifiez l'URL du webhook dans Medusa
2. Vérifiez les logs Vercel
3. Testez manuellement :
   ```bash
   curl -X POST https://votre-app.vercel.app/api/webhooks/medusa \
     -H "Content-Type: application/json" \
     -d '{"event":"order.placed","data":{"id":"test"}}'
   ```

### Erreur de connexion MongoDB

1. Vérifiez que l'IP est autorisée (0.0.0.0/0 ou IP Vercel)
2. Vérifiez le username/password
3. Vérifiez que le nom de la base est correct
4. Testez la connexion :
   ```bash
   mongosh "mongodb+srv://..."
   ```

### Build Vercel échoue

1. Vérifiez les logs de build
2. Vérifiez que `--legacy-peer-deps` est utilisé
3. Vérifiez les variables d'environnement

### Synchronisation ne fonctionne pas

1. Vérifiez les logs : Vercel Dashboard → Logs
2. Vérifiez que `MEDUSA_API_URL` est correct
3. Vérifiez que MongoDB est accessible
4. Testez manuellement : `npm run sync:orders -- --id=ORDER_ID`

## Coûts mensuels estimés

- **Vercel** : Gratuit (Hobby plan) ou 20$/mois (Pro)
- **Railway** : ~5-10$/mois (Medusa + PostgreSQL)
- **MongoDB Atlas** : Gratuit (M0) ou 9$/mois (M2)
- **Domaine** : ~10-15€/an

**Total estimé** : 5-40$/mois selon les options choisies

## Support

- Vercel Docs : https://vercel.com/docs
- Railway Docs : https://docs.railway.app
- MongoDB Atlas Docs : https://www.mongodb.com/docs/atlas
- Medusa Docs : https://docs.medusajs.com
- Payload Docs : https://payloadcms.com/docs
- Next.js Docs : https://nextjs.org/docs

## Checklist de déploiement

- [ ] Build local réussi (`npm run build`)
- [ ] Variables d'environnement configurées dans Vercel
- [ ] MongoDB Atlas configuré et accessible
- [ ] Application déployée sur Vercel
- [ ] Webhook configuré dans Medusa
- [ ] Premier utilisateur admin créé dans Payload
- [ ] Test du webhook réussi
- [ ] Test de synchronisation des commandes réussi
- [ ] Domaine personnalisé configuré (optionnel)
- [ ] Monitoring et alertes configurés
- [ ] Backup automatique activé
