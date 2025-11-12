# Configuration de production - Exclusives Stickers

## ✅ Déploiement réussi sur Vercel

Votre application est déployée et accessible à :
**https://stickers-storefront-eowpwcsqq-benjaminav2s-projects.vercel.app**

## 🚀 Prochaines étapes obligatoires

### 1. Configurer MongoDB Atlas (URGENT)

Actuellement, l'application pointe vers MongoDB local qui n'est pas accessible depuis Vercel.

#### Créer un cluster MongoDB Atlas

1. Allez sur https://www.mongodb.com/atlas
2. Créez un compte gratuit
3. Créez un cluster M0 (gratuit)
4. Région recommandée : **Paris (EU-WEST-3)** ou proche de Vercel (US-EAST)

#### Configurer la sécurité

1. **Database Access** :
   - Créez un utilisateur
   - Username : `exclusives_stickers_prod`
   - Password : Générez un mot de passe fort
   - Role : `readWrite` sur `exclusives_stickers`

2. **Network Access** :
   - Ajoutez l'IP : `0.0.0.0/0` (Allow Access from Anywhere)
   - ⚠️ En production, limitez aux IPs de Vercel pour plus de sécurité

#### Obtenir l'URL de connexion

1. Cliquez sur **Connect** → **Connect your application**
2. Copiez l'URL (format : `mongodb+srv://...`)
3. Remplacez `<password>` par votre mot de passe
4. Remplacez la base par `exclusives_stickers`

URL finale :
```
mongodb+srv://exclusives_stickers_prod:PASSWORD@cluster0.xxxxx.mongodb.net/exclusives_stickers?retryWrites=true&w=majority
```

### 2. Configurer les variables d'environnement sur Vercel

Allez dans le dashboard Vercel : https://vercel.com/benjaminav2s-projects/stickers-storefront/settings/environment-variables

Ajoutez ces variables pour **Production** :

#### Variables Payload CMS
```bash
PAYLOAD_SECRET=sJ2MxsvlHoWzi/sh8yYmKmgmqciP1XRS7BCbFZXPK2M=
DATABASE_URL=<URL_MONGODB_ATLAS>
```

#### Variables Medusa
```bash
MEDUSA_API_URL=https://medusa-production-58da.up.railway.app
NEXT_PUBLIC_MEDUSA_API_URL=https://medusa-production-58da.up.railway.app
MEDUSA_WEBHOOK_SECRET=1afEbvyKaoBCpSm1MZJ2v2pfoVJeXkLQzAcKFzCVLIU=
```

#### Variables publiques
```bash
NEXT_PUBLIC_API_URL=https://medusa-production-58da.up.railway.app
NEXT_PUBLIC_CMS_API_URL=https://stickers-storefront-eowpwcsqq-benjaminav2s-projects.vercel.app/api
```

### 3. Redéployer après ajout des variables

Une fois les variables ajoutées :

```bash
cd ~/stickers-storefront
vercel --prod
```

Ou depuis le dashboard Vercel : **Deployments** → **Redeploy**

### 4. Créer le premier utilisateur admin

1. Visitez : https://stickers-storefront-7xb3jww67-benjaminav2s-projects.vercel.app/admin
2. Créez votre premier utilisateur admin
3. Email : `admin@exclusives-stickers.com`
4. Mot de passe : Choisissez un mot de passe fort
5. Nom : Votre nom
6. Role : `admin`

### 5. Configurer le webhook Medusa en production

Une fois le site déployé avec les variables d'environnement :

#### Option 1 : Via l'admin Medusa

1. Allez sur https://medusa-production-58da.up.railway.app/app
2. **Settings** → **Webhooks** → **Create Webhook**
3. Configurez :
   - **URL** : `https://stickers-storefront-eowpwcsqq-benjaminav2s-projects.vercel.app/api/webhooks/medusa`
   - **Secret** : `1afEbvyKaoBCpSm1MZJ2v2pfoVJeXkLQzAcKFzCVLIU=`
   - **Events** : order.placed, order.updated, order.completed, order.canceled, order.payment_captured, order.fulfillment_created, order.shipment_created

#### Option 2 : Via le script

```bash
cd ~/stickers-storefront
./scripts/setup-medusa-webhook.sh
# Choisissez l'option 3 (Production Vercel)
# Entrez l'URL : https://stickers-storefront-eowpwcsqq-benjaminav2s-projects.vercel.app
```

### 6. Tester que tout fonctionne

#### Test du webhook

```bash
curl https://stickers-storefront-eowpwcsqq-benjaminav2s-projects.vercel.app/api/webhooks/medusa
```

Devrait retourner :
```json
{
  "message":"Medusa webhook endpoint is active",
  "events":[...]
}
```

#### Test de l'admin Payload

1. Visitez : https://stickers-storefront-eowpwcsqq-benjaminav2s-projects.vercel.app/admin
2. Connectez-vous
3. Créez une page de test
4. Vérifiez qu'elle apparaît dans la liste

#### Test de la synchronisation Medusa

Créez une commande test dans Medusa et vérifiez qu'elle apparaît dans Payload CMS sous **Orders**.

## 📊 URLs importantes

- **Site web** : https://stickers-storefront-eowpwcsqq-benjaminav2s-projects.vercel.app
- **Admin Payload** : https://stickers-storefront-eowpwcsqq-benjaminav2s-projects.vercel.app/admin
- **API Payload** : https://stickers-storefront-eowpwcsqq-benjaminav2s-projects.vercel.app/api
- **Webhook** : https://stickers-storefront-eowpwcsqq-benjaminav2s-projects.vercel.app/api/webhooks/medusa
- **Vercel Dashboard** : https://vercel.com/benjaminav2s-projects/stickers-storefront
- **Medusa Backend** : https://medusa-production-58da.up.railway.app
- **Medusa Admin** : https://medusa-production-58da.up.railway.app/app

## 🔒 Sécurité

### Checklist de sécurité

- [ ] MongoDB Atlas configuré avec authentification
- [ ] IPs autorisées configurées dans MongoDB
- [ ] PAYLOAD_SECRET changé (ne pas utiliser celui du .env.local)
- [ ] Webhook secret configuré dans Medusa
- [ ] Variables d'environnement configurées dans Vercel
- [ ] Premier utilisateur admin créé avec mot de passe fort
- [ ] HTTPS activé (automatique sur Vercel)

### Générer de nouveaux secrets pour la production

```bash
# Nouveau PAYLOAD_SECRET
openssl rand -base64 32

# Nouveau MEDUSA_WEBHOOK_SECRET
openssl rand -base64 32
```

⚠️ **Important** : Changez les secrets par défaut avant d'utiliser en production !

## 🎯 Domaine personnalisé (optionnel)

Si vous souhaitez utiliser un domaine personnalisé (ex: exclusives-stickers.com) :

1. Achetez le domaine (Namecheap, Google Domains, etc.)
2. Dans Vercel Dashboard → Settings → Domains
3. Ajoutez votre domaine et suivez les instructions DNS
4. Mettez à jour l'URL du webhook dans Medusa

## 📈 Monitoring

### Vercel

- **Logs** : https://vercel.com/benjaminav2s-projects/stickers-storefront/logs
- **Analytics** : https://vercel.com/benjaminav2s-projects/stickers-storefront/analytics
- **Deployments** : https://vercel.com/benjaminav2s-projects/stickers-storefront/deployments

### MongoDB Atlas

- **Metrics** : Atlas Dashboard → votre cluster → Metrics
- **Logs** : Atlas Dashboard → votre cluster → Logs
- **Alerts** : Configurez des alertes pour les connexions, l'espace disque, etc.

## 🐛 Troubleshooting

### Le site ne charge pas

1. Vérifiez que les variables d'environnement sont configurées
2. Vérifiez les logs Vercel
3. Vérifiez que MongoDB Atlas est accessible

### Erreur "Cannot connect to database"

1. Vérifiez l'URL MongoDB (format correct, password correct)
2. Vérifiez que 0.0.0.0/0 est autorisé dans Network Access
3. Vérifiez que l'utilisateur a les permissions readWrite

### Le webhook ne fonctionne pas

1. Testez manuellement : `curl https://votre-url.vercel.app/api/webhooks/medusa`
2. Vérifiez que l'URL dans Medusa est correcte
3. Vérifiez les logs Vercel pour voir si les événements arrivent
4. Vérifiez que le secret est correct

### Les commandes ne se synchronisent pas

1. Vérifiez que le webhook est configuré dans Medusa
2. Vérifiez que MEDUSA_API_URL est correct
3. Vérifiez que MongoDB est accessible
4. Testez manuellement : `npm run sync:orders -- --id=ORDER_ID`

## 📞 Support

Si vous rencontrez des problèmes :

1. Consultez les logs Vercel
2. Consultez les logs MongoDB Atlas
3. Testez les endpoints manuellement avec curl
4. Vérifiez que toutes les variables d'environnement sont configurées

## 🎉 Félicitations !

Une fois toutes ces étapes complétées, votre application sera en production et prête à recevoir des commandes !

---

**Dernière mise à jour** : 2025-11-12
**Version** : 1.0.0
**Déployé sur** : Vercel
