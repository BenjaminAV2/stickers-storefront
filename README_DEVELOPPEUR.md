# Guide pour le Développeur - Problème d'Authentification

## 📍 Emplacement des Fichiers

### Documentation Complète
**Fichier principal**: `/Users/auriolbenjamin/stickers-storefront/AUTHENTICATION_ISSUE_REPORT.md`

Ce fichier contient:
- Architecture complète du projet
- Code source des fichiers importants
- Historique de toutes les tentatives de correction
- Résultats des tests de diagnostic
- Pistes de solution suggérées

### Scripts de Diagnostic

Tous les scripts sont dans `/Users/auriolbenjamin/stickers-storefront/scripts/`:

1. **direct-password-fix.mjs** - Fixe le password directement en MongoDB
2. **check-all-users.mjs** - Liste tous les utilisateurs en base
3. **test-auth-flow.mjs** - Teste le flux d'authentification complet
4. **diagnose-auth.mjs** - Diagnostic complet de l'authentification
5. **fix-admin-password.mjs** - Reset via Payload API
6. **reset-password.mjs** - Reset avec bcrypt manuel
7. **remove-duplicate-users.mjs** - Supprime les doublons

### Fichiers de Configuration

- `auth.ts` - Configuration NextAuth v5
- `payload.config.ts` - Configuration Payload CMS
- `app/auth/signin/page.tsx` - Page de connexion
- `payload/collections/Users.ts` - Schema utilisateurs Payload
- `.env` - Variables d'environnement

## 🚀 Quick Start pour Diagnostic

### 1. Vérifier la Base de Données

```bash
cd /Users/auriolbenjamin/stickers-storefront
npx tsx scripts/check-all-users.mjs
```

**Résultat attendu**: Hash présent pour benjamin@avdigital.fr

### 2. Tester le Flux d'Authentification

```bash
npx tsx scripts/test-auth-flow.mjs
```

**Problème connu**: Payload find() ne retourne pas le password

### 3. Tester en Local

```bash
npm run dev
```

Puis accéder à http://localhost:3001/auth/signin

**Identifiants**:
- Email: `benjamin@avdigital.fr`
- Password: `vDDzM2Gf3n!*NQ`
- Cocher "Connexion administrateur"

## 🔍 Points de Vérification Prioritaires

### A. Vérifier l'Accès MongoDB dans auth.ts

**Ligne 40-41 de auth.ts**:
```typescript
const db = payload.db
const User = (db as any).collections['users']
```

**Problème potentiel**: L'utilisation de `as any` masque les erreurs de typage. La méthode `payload.db.collections` pourrait ne pas fonctionner comme attendu.

**Solution suggérée**: Utiliser mongoose directement:
```typescript
import mongoose from 'mongoose'
const User = mongoose.connection.db.collection('users')
```

### B. Vérifier NextAuth v5 Beta

NextAuth v5 est en **beta**. Problèmes connus:
- API différente de v4
- Callbacks modifiés
- Compatibilité avec Next.js 16

**Solution suggérée**:
- Tester avec NextAuth v4 (stable)
- Ou upgrader vers la dernière beta

### C. Vérifier le Middleware

Le fichier `middleware.ts` doit exporter auth correctement:
```typescript
export { auth as middleware } from './auth'

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
```

### D. Vérifier les Logs de Production

```bash
vercel logs https://stickers-storefront-n8u91bbr9-benjaminav2s-projects.vercel.app --follow
```

Chercher:
- Erreurs de connexion MongoDB
- Erreurs NextAuth
- Erreurs de middleware

## 🎯 Solutions à Tester dans l'Ordre

### Solution 1: Utiliser Mongoose Direct (PRIORITAIRE)

Dans `auth.ts`, remplacer:
```typescript
const db = payload.db
const User = (db as any).collections['users']
```

Par:
```typescript
import mongoose from 'mongoose'

// S'assurer que mongoose est connecté
if (!mongoose.connection.readyState) {
  await mongoose.connect(process.env.DATABASE_URL!)
}

const User = mongoose.connection.db.collection('users')
```

### Solution 2: Utiliser Payload Local API

```typescript
// Utiliser Payload local API au lieu de find()
const payload = await getPayload({ config })
const result = await payload.db.collections.users.findOne({
  email: credentials.email
})
```

### Solution 3: Downgrade NextAuth

```bash
npm install next-auth@4.24.7
```

Puis adapter auth.ts pour NextAuth v4.

### Solution 4: Vérifier NEXTAUTH_URL

Dans `.env`:
```bash
NEXTAUTH_URL="http://localhost:3001"
NEXTAUTH_URL_INTERNAL="http://localhost:3001"
```

En production (Vercel):
```bash
NEXTAUTH_URL="https://stickers-storefront-n8u91bbr9-benjaminav2s-projects.vercel.app"
```

### Solution 5: Ajouter des Logs de Debug

Dans `auth.ts`, ajouter:
```typescript
async authorize(credentials) {
  console.log('🔍 Authorize called with:', {
    email: credentials.email,
    isAdmin: credentials.isAdmin
  })

  // ... code existant ...

  console.log('👤 User found:', {
    id: user._id,
    email: user.email,
    hasPassword: !!user.password
  })

  const isValidPassword = await bcrypt.compare(
    credentials.password,
    user.password
  )

  console.log('🔐 Password valid:', isValidPassword)

  // ... reste du code ...
}
```

## 📊 Résultats des Tests Précédents

### Test MongoDB Direct: ✅ SUCCÈS
- Hash présent en base
- Bcrypt compare fonctionne
- User._id: `6915f72382e7455ba893599b`

### Test Payload find(): ❌ ÉCHEC
- Password field non retourné (filtré par Payload)
- User.id: `6914a9bfc7b1d1a1063eb24f` (différent!)
- Probablement un cache

### Test Auth Flow: ❌ ÉCHEC
- Authentification échoue
- Message: "Email ou mot de passe incorrect"

## 🔗 Ressources

### Documentation
- NextAuth v5: https://authjs.dev/
- Payload CMS: https://payloadcms.com/docs
- MongoDB Driver: https://mongodb.github.io/node-mongodb-native/

### Repository
- GitHub: https://github.com/BenjaminAV2/stickers-storefront
- Production: https://stickers-storefront-n8u91bbr9-benjaminav2s-projects.vercel.app

### Contact
- Email: benjamin@avdigital.fr

## 📝 Checklist de Diagnostic

- [ ] Vérifier les logs serveur en local
- [ ] Vérifier les logs Vercel en production
- [ ] Tester la connexion MongoDB directe
- [ ] Tester avec Payload Admin login direct (/admin/login)
- [ ] Vérifier le middleware Next.js
- [ ] Tester avec des logs debug détaillés
- [ ] Vérifier la configuration NEXTAUTH_URL
- [ ] Tester avec NextAuth v4
- [ ] Vérifier les cookies (SameSite, Secure, etc.)
- [ ] Vérifier la compatibilité Next.js 16 + NextAuth v5

## 💡 Notes Importantes

1. **Le hash en base est valide** - Vérifié avec bcrypt.compare()
2. **Payload filtre le password** - C'est un comportement de sécurité normal
3. **NextAuth v5 est en beta** - Instabilité potentielle
4. **Le problème affecte local ET production** - Pas un problème d'environnement

## 🆘 En Cas de Blocage

Si aucune solution ne fonctionne, considérer:

1. **Repartir de zéro** avec NextAuth v4 + Payload v3
2. **Utiliser Payload Auth uniquement** (sans NextAuth)
3. **Implémenter une authentification custom** avec JWT manuel

---

**Date du rapport**: 27 novembre 2025
**Dernière mise à jour**: 27 novembre 2025 15:30
