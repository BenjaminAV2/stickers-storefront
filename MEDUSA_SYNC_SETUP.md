# Configuration de la synchronisation Medusa ↔️ Payload CMS

Ce guide explique comment configurer la synchronisation des commandes entre Medusa.js et Payload CMS.

## Architecture

```
Medusa.js (Backend E-commerce)
    ↓ webhook events
Next.js API Route (/api/webhooks/medusa)
    ↓ sync function
Payload CMS (Orders collection)
```

## Prérequis

1. Backend Medusa.js v2 opérationnel
2. Payload CMS configuré avec la collection Orders
3. MongoDB opérationnel
4. Variables d'environnement configurées

## Configuration des variables d'environnement

Ajoutez ces variables dans votre fichier `.env.local` :

```bash
# Medusa API Configuration
MEDUSA_API_URL=https://your-medusa-backend.railway.app
MEDUSA_PUBLISHABLE_KEY=pk_your_publishable_key_here

# Medusa Webhook Secret (optionnel mais recommandé en production)
MEDUSA_WEBHOOK_SECRET=your_webhook_secret_here

# MongoDB pour Payload
DATABASE_URL=mongodb://localhost:27017/exclusives_stickers

# Payload Secret
PAYLOAD_SECRET=your_payload_secret_here
```

## Configuration des webhooks Medusa

### Option 1: Via l'admin Medusa

1. Connectez-vous à votre admin Medusa
2. Allez dans **Settings** → **Webhooks**
3. Cliquez sur **Create Webhook**
4. Configurez :
   - **URL** : `https://your-nextjs-app.vercel.app/api/webhooks/medusa`
   - **Events** : Sélectionnez les événements suivants :
     - `order.placed`
     - `order.updated`
     - `order.completed`
     - `order.canceled`
     - `order.payment_captured`
     - `order.fulfillment_created`
     - `order.shipment_created`
   - **Secret** : Générez un secret sécurisé (utilisez `openssl rand -base64 32`)

### Option 2: Via l'API Medusa

```bash
curl -X POST "https://your-medusa-backend.railway.app/admin/webhooks" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://your-nextjs-app.vercel.app/api/webhooks/medusa",
    "events": [
      "order.placed",
      "order.updated",
      "order.completed",
      "order.canceled",
      "order.payment_captured",
      "order.fulfillment_created",
      "order.shipment_created"
    ],
    "secret": "your_webhook_secret_here"
  }'
```

## Synchronisation manuelle

### Synchroniser toutes les commandes

```bash
npm run sync:orders
```

### Synchroniser une commande spécifique

```bash
npm run sync:orders -- --id=order_01234567890
```

### Synchroniser par statut

```bash
npm run sync:orders -- --status=pending
```

### Options disponibles

- `--id=<order_id>` : Synchroniser une commande spécifique
- `--status=<status>` : Filtrer par statut (pending, completed, canceled, etc.)
- `--limit=<number>` : Nombre de commandes par page (défaut: 50)

## Test du webhook

### 1. Vérifier que l'endpoint est actif

```bash
curl http://localhost:3001/api/webhooks/medusa
```

Réponse attendue :
```json
{
  "message": "Medusa webhook endpoint is active",
  "events": [
    "order.placed",
    "order.updated",
    "order.completed",
    "order.canceled",
    "order.payment_captured",
    "order.fulfillment_created",
    "order.shipment_created"
  ]
}
```

### 2. Tester avec un payload simulé

```bash
curl -X POST http://localhost:3001/api/webhooks/medusa \
  -H "Content-Type: application/json" \
  -H "x-medusa-signature: your_webhook_secret_here" \
  -d '{
    "event": "order.placed",
    "data": {
      "id": "order_test_123"
    }
  }'
```

## Déploiement

### Développement local avec ngrok

Pour tester les webhooks en développement local :

```bash
# Installer ngrok
brew install ngrok

# Exposer votre serveur local
ngrok http 3001

# Utiliser l'URL ngrok dans la configuration du webhook Medusa
# Exemple: https://abc123.ngrok.io/api/webhooks/medusa
```

### Production (Vercel)

1. Déployez votre application Next.js sur Vercel
2. Configurez les variables d'environnement dans Vercel :
   - `MEDUSA_API_URL`
   - `MEDUSA_PUBLISHABLE_KEY`
   - `MEDUSA_WEBHOOK_SECRET`
   - `DATABASE_URL`
   - `PAYLOAD_SECRET`

3. Mettez à jour l'URL du webhook dans Medusa :
   - URL : `https://your-app.vercel.app/api/webhooks/medusa`

## Monitoring et logs

Les logs de synchronisation sont visibles dans :

- **Développement** : Console Node.js
- **Production Vercel** : Vercel Dashboard → Logs
- **Production Railway** : Railway Dashboard → Logs

Format des logs :
```
[Medusa Sync] Synchronisation de la commande order_123...
[Medusa Sync] Commande order_123 créée avec succès
[Medusa Webhook] Événement reçu: order.placed
```

## Sécurité

### En production

1. **Toujours** configurer `MEDUSA_WEBHOOK_SECRET`
2. Vérifier les signatures des webhooks
3. Utiliser HTTPS uniquement
4. Limiter les taux de requêtes (rate limiting)
5. Implémenter une queue Redis/Bull pour les synchronisations

### Vérification HMAC (à implémenter)

Pour une sécurité renforcée, implémentez la vérification HMAC dans `app/api/webhooks/medusa/route.ts` :

```typescript
import crypto from 'crypto'

function verifyWebhookSignature(
  request: NextRequest,
  body: string
): boolean {
  const signature = request.headers.get('x-medusa-signature')
  const webhookSecret = process.env.MEDUSA_WEBHOOK_SECRET

  if (!webhookSecret || !signature) return false

  const hmac = crypto.createHmac('sha256', webhookSecret)
  hmac.update(body)
  const expectedSignature = hmac.digest('hex')

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  )
}
```

## Dépannage

### Webhook non déclenché

1. Vérifier que l'URL du webhook est correcte
2. Vérifier que les événements sont bien sélectionnés
3. Vérifier les logs Medusa pour les erreurs
4. Tester manuellement avec curl

### Erreur de synchronisation

1. Vérifier que MongoDB est accessible
2. Vérifier les credentials Medusa API
3. Vérifier les logs : `npm run sync:orders -- --id=<order_id>`
4. Vérifier que la collection Orders existe dans Payload

### Commandes dupliquées

La synchronisation utilise `medusaOrderId` comme clé unique. Les doublons sont automatiquement mis à jour au lieu d'être créés.

## Performance

### Recommandations pour la production

1. **Utiliser une queue** (Bull, BullMQ, Redis Queue)
   ```typescript
   // Au lieu de :
   syncOrder(orderId).catch(...)

   // Utiliser :
   await orderSyncQueue.add('sync-order', { orderId })
   ```

2. **Implémenter un retry mechanism**
   - Nombre de tentatives : 3-5
   - Backoff exponentiel

3. **Batching pour sync:orders**
   - Limiter à 50-100 commandes par batch
   - Implémenter des pauses entre les batches

4. **Monitoring**
   - Sentry pour les erreurs
   - DataDog/New Relic pour les métriques
   - Alertes sur les échecs de synchronisation

## Support

Pour toute question ou problème :
1. Vérifier les logs de synchronisation
2. Consulter la documentation Medusa : https://docs.medusajs.com
3. Consulter la documentation Payload : https://payloadcms.com/docs

## Changelog

- **2025-11-12** : Configuration initiale de la synchronisation Medusa → Payload
