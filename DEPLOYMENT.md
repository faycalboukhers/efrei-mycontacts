# Guide de Déploiement - MyContacts

## Tests Unitaires

### Installation des dépendances de test
```bash
npm install --save-dev @testing-library/jest-dom @testing-library/react @testing-library/user-event
```

### Lancer les tests
```bash
# Tests en mode watch
npm test

# Tests avec couverture
npm run test:coverage

# Tests pour CI/CD
npm run test:ci
```

### Structure des tests
```
src/
├── __tests__/
│   ├── AuthContext.test.js
│   ├── LoginPage.test.js
│   ├── ContactsPage.test.js
│   └── NotificationContext.test.js
└── setupTests.js
```

---

## Déploiement Backend (Render)

### 1. Préparation du backend

Ajoutez ces scripts dans le `package.json` du backend :
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

### 2. Mise à jour du serveur pour la production

Modifiez `server.js` :
```javascript
// Ajoutez après les imports
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Mise à jour CORS pour la production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://votre-frontend.netlify.app'] 
    : ['http://localhost:3000'],
  credentials: true
};

app.use(cors(corsOptions));
```

### 3. Déploiement sur Render

1. **Créer un compte sur [Render](https://render.com)**
2. **Connecter votre repository GitHub**
3. **Créer un nouveau Web Service** :
   - Runtime: Node
   - Build Command: `npm install`
   - Start Command: `node server.js`
4. **Variables d'environnement** :
   ```
   NODE_ENV=production
   MONGO_URI=votre_uri_mongodb_atlas
   JWT_SECRET=votre_secret_jwt_securise
   PORT=5000
   ```

---

## Déploiement Frontend (Netlify)

### 1. Préparation du frontend

Créez le fichier `.env` :
```bash
REACT_APP_API_URL=https://votre-backend.onrender.com
```

### 2. Build de production
```bash
# Installer les dépendances
npm install

# Créer le build de production
npm run build
```

### 3. Déploiement sur Netlify

#### Option 1: Drag & Drop (Simple)
1. **Allez sur [Netlify](https://www.netlify.com)**
2. **Drag & Drop le dossier `build/`** sur la zone de déploiement
3. **Votre site sera en ligne immédiatement**

#### Option 2: Git Integration (Recommandé)
1. **Connectez votre repository GitHub**
2. **Configurez les paramètres de build** :
   - Build command: `npm run build`
   - Publish directory: `build`
3. **Variables d'environnement** :
   ```
   REACT_APP_API_URL=https://votre-backend.onrender.com
   ```
4. **Deploy automatique à chaque push**

### 4. Configuration des redirections

Le fichier `netlify.toml` gère automatiquement les redirections pour React Router.

---

## Tests de Déploiement

### 1. Vérifications Backend
```bash
# Test de l'API déployée
curl https://votre-backend.onrender.com/
curl -X POST https://votre-backend.onrender.com/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@test.com","password":"123456"}'
```

### 2. Vérifications Frontend
- [ ] Pages accessibles (/, /login, /register, /contacts)
- [ ] Inscription fonctionne
- [ ] Connexion fonctionne
- [ ] CRUD contacts fonctionne
- [ ] Notifications affichées
- [ ] Design responsive

---

## Troubleshooting

### Problèmes courants Backend

**1. Erreur CORS**
```javascript
// Dans server.js
const corsOptions = {
  origin: ['https://votre-frontend.netlify.app', 'http://localhost:3000'],
  credentials: true
};
app.use(cors(corsOptions));
```

**2. Variables d'environnement manquantes**
```bash
# Vérifiez dans Render Dashboard > Environment
NODE_ENV=production
MONGO_URI=mongodb+srv://...
JWT_SECRET=votre_secret
```

**3. Port incorrect**
```javascript
// Dans server.js
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
```

### Problèmes courants Frontend

**1. API URL incorrecte**
```bash
# Vérifiez .env
REACT_APP_API_URL=https://votre-backend.onrender.com
```

**2. Routes 404 sur Netlify**
Le fichier `netlify.toml` doit contenir :
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**3. Build qui échoue**
```bash
# Nettoyez et rebuilder
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## Monitoring et Maintenance

### 1. Logs Backend (Render)
- Allez dans Render Dashboard > Votre Service > Logs
- Surveillez les erreurs et performances

### 2. Analytics Frontend (Netlify)
- Netlify Analytics pour le trafic
- Console Browser pour les erreurs JS

### 3. Mise à jour continue
```bash
# Développement local
git add .
git commit -m "feat: nouvelle fonctionnalité"
git push origin main

# Déploiement automatique sur Netlify & Render
```

---

## Sécurité en Production

### 1. Variables sensibles
- Utilisez des secrets forts pour JWT_SECRET
- Ne committez jamais les vraies variables d'env
- Utilisez HTTPS uniquement

### 2. Headers de sécurité
Le `netlify.toml` inclut des headers de sécurité :
```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
```

### 3. Rate limiting (Backend)
Ajoutez express-rate-limit si nécessaire :
```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // max 100 requests par IP
});

app.use('/auth', limiter);
```

---

## Checklist Final

### Backend ✅
- [ ] Déployé sur Render
- [ ] Variables d'environnement configurées
- [ ] CORS configuré pour le frontend
- [ ] API accessible et testée
- [ ] Logs sans erreurs

### Frontend ✅
- [ ] Déployé sur Netlify
- [ ] Build réussi
- [ ] Variables d'environnement configurées
- [ ] Routes fonctionnelles
- [ ] Connexion API fonctionnelle
- [ ] Design responsive

### Tests ✅
- [ ] Tests unitaires passent
- [ ] Couverture > 70%
- [ ] Pas de console.error en production

**🎉 Votre application MyContacts est maintenant déployée !**