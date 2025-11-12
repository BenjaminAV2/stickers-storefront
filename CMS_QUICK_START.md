# 🚀 CMS Quick Start - 5 Minutes

## Démarrage Ultra-Rapide du CMS Payload

### 1. Base de Données (Option Rapide - PostgreSQL Local)

```bash
# macOS
brew install postgresql@16
brew services start postgresql@16
createdb exclusives_stickers_cms
```

### 2. Configuration

```bash
cd ~/stickers-storefront/cms

# Éditer .env (déjà créé)
# Changer PAYLOAD_SECRET par une clé aléatoire:
# Générer: openssl rand -base64 32
```

### 3. Lancer le CMS

```bash
npm run dev
```

✅ Admin panel: http://localhost:3001/admin
✅ API: http://localhost:3001/api

### 4. Créer l'Admin

1. Ouvrir http://localhost:3001/admin
2. Email: admin@exclusives-stickers.com
3. Password: (votre choix)
4. Name: Admin

### 5. Créer une Page de Test

Admin → Pages → Create New:
- Title (FR): Test
- Slug: test
- Content (FR): Hello World
- Published: ✅

### 6. Tester l'API

```bash
curl "http://localhost:3001/api/pages?locale=fr"
```

---

## 📖 Documentation Complète

Voir **CMS_INTEGRATION_GUIDE.md** pour :
- Collections détaillées
- Localisation (5 langues)
- Intégration Next.js
- Déploiement Railway

---

## 🎯 Fichiers Créés

```
cms/
├── src/
│   ├── collections/        # 5 collections
│   ├── payload.config.ts   # Config principale
│   └── server.ts           # Serveur Express
├── package.json
├── .env                    # Variables
└── README.md               # Doc complète

lib/
└── cms.ts                  # Client API Next.js

.env.local                  # +CMS_API_URL
```

---

**Status**: ✅ CMS intégré avec succès !
