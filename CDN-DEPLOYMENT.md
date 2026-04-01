# Accès SDK via js.sangho.com — Guide complet

## 1. Architecture CDN recommandée

```
js.sangho.com/
├── v0.1.0/
│   └── sangho.min.js        ← version figée (immuable)
├── v0.2.0/
│   └── sangho.min.js
├── v1/
│   └── sangho.min.js        ← dernière v1.x.x (stable)
└── latest/
    └── sangho.min.js        ← dernière version absolue
```

### Options d'hébergement

| Hébergeur       | Usage                          | Config                        |
|-----------------|-------------------------------|-------------------------------|
| Cloudflare R2   | CDN mondial, gratuit jusqu'à 10GB | Workers + R2 bucket         |
| AWS S3 + CloudFront | Classique, fiable          | S3 + distribution CF         |
| Vercel          | Simple, déploiement Git       | `vercel.json` + output dir   |
| Cloudflare Pages| Le plus simple pour un SDK JS | Push sur git = déploiement   |

---

## 2. Configuration DNS (Cloudflare recommandé)

```
# Dans votre DNS Cloudflare
CNAME  js.sangho.com  →  votre-bucket.r2.cloudflarestorage.com
# ou
CNAME  js.sangho.com  →  votre-distribution.cloudfront.net
```

Headers à configurer sur le CDN :

```
Cache-Control: public, max-age=31536000, immutable   ← pour /v1.2.3/
Cache-Control: public, max-age=300, stale-while-revalidate=86400  ← pour /latest/
Access-Control-Allow-Origin: *
Content-Type: application/javascript; charset=utf-8
```

---

## 3. Comment les clients utilisent le SDK

### Via npm (recommandé pour les apps)

```bash
npm install sangho-sdk-js
# ou
pnpm add sangho-sdk-js
```

```typescript
import { Sangho } from 'sangho-sdk-js'
const client = new Sangho({ apiKey: 'sk_prod_xxx' })
```

### Via CDN (version figée — production)

```html
<!-- ✅ BONNE PRATIQUE : version figée, jamais de surprises -->
<script src="https://js.sangho.com/v0.1.0/sangho.min.js"></script>

<!-- ⚠️  DÉCONSEILLÉ en prod : peut changer à tout moment -->
<script src="https://js.sangho.com/latest/sangho.min.js"></script>
```

### Via CDN avec ESM (moderne)

```html
<script type="module">
  import { Sangho } from 'https://js.sangho.com/v0.1.0/sangho.esm.js'
  const sangho = new Sangho({ apiKey: 'pk_prod_xxx' })
</script>
```

---

## 4. Stratégie de Versioning (Semantic Versioning)

### Règles SemVer

```
MAJOR.MINOR.PATCH
  │      │     └─ Bugfix, aucun breaking change
  │      └─────── Nouvelle feature, rétrocompatible
  └────────────── Breaking change (migration requise)
```

### Workflow de release

```bash
# 1. Bugfix (0.1.0 → 0.1.1)
make release-patch

# 2. Nouvelle feature (0.1.0 → 0.2.0)
make release-minor

# 3. Breaking change (0.1.0 → 1.0.0)
make release-major
```

### Ce qui se passe lors d'un `make release-patch`

1. `make check` → lint + typecheck
2. `make test`  → tous les tests passent
3. `pnpm version patch` → package.json mis à jour
4. `git commit + tag v0.1.1`
5. `git push --tags`
6. GitHub Actions détecte le tag → build → publish npm → deploy CDN

---

## 5. Fichier .npmrc à avoir dans le projet

```ini
# .npmrc
registry=https://registry.npmjs.org
//registry.npmjs.org/:_authToken=${NPM_TOKEN}

# Optionnel : miroir pour install plus rapide en Afrique
# registry=https://registry.npmmirror.com
```

---

## 6. Variables secrètes GitHub à configurer

Dans Settings → Secrets → Actions :

| Secret              | Description                          |
|---------------------|--------------------------------------|
| `NPM_TOKEN`         | Token npm (Automation type)          |
| `CDN_AWS_KEY`       | AWS Access Key pour S3               |
| `CDN_AWS_SECRET`    | AWS Secret Key                       |
| `CDN_S3_BUCKET`     | Nom du bucket S3                     |
| `CDN_CLOUDFRONT_ID` | ID distribution CloudFront           |
| `CODECOV_TOKEN`     | Token Codecov (couverture optionnel) |
