# efrei-mycontacts

# MyContacts - Application de Gestion de Contacts

Application fullstack JavaScript permettant de gérer ses contacts personnels avec authentification utilisateur.

## Architecture

- **Backend** : Node.js + Express + MongoDB
- **Frontend** : React + React Router + Axios
- **Authentification** : JWT
- **Base de données** : MongoDB Atlas
- **Tests** : Jest + React Testing Library
- **Déploiement** : Backend sur Render, Frontend sur Netlify

## Démo Live

- **Frontend** : https://prismatic-dieffenbachia-a78b54.netlify.app
- **Backend API** : https://efrei-mycontacts.onrender.com
- **Documentation API** : https://efrei-mycontacts.onrender.com/api-docs

## Installation Locale

### Prérequis

- Node.js 16+
- npm ou yarn
- MongoDB Atlas (ou MongoDB local)

### Backend

```bash
cd server
npm install
```

Créez un fichier `.env` :
```env
MONGO_URI=mongodb+srv://votre_uri_mongodb
JWT_SECRET=votre_secret_jwt_securise
PORT=5000
NODE_ENV=development
```

Lancer le serveur :
```bash
npm start
```

### Frontend

```bash
cd client/mycontacts-client
npm install
```

Créez un fichier `.env` :
```env
REACT_APP_API_URL=http://localhost:5000
```

Lancer l'application :
```bash
npm start
```

## Scripts Disponibles

### Backend (`server/`)

```bash
npm start          # Lancer le serveur en production
npm run dev        # Lancer avec nodemon (développement)
```

### Frontend (`client/mycontacts-client/`)

```bash
npm start          # Serveur de développement
npm run build      # Build pour la production
npm test           # Lancer les tests
npm run test:coverage  # Tests avec couverture
```

## API Endpoints

### Authentification

| Méthode | Endpoint | Description | Body |
|---------|----------|-------------|------|
| POST | `/auth/register` | Inscription | `{username, email, password}` |
| POST | `/auth/login` | Connexion | `{email, password}` |

### Contacts (Authentification requise)

| Méthode | Endpoint | Description | Body |
|---------|----------|-------------|------|
| GET | `/contacts` | Récupérer ses contacts | - |
| POST | `/contacts` | Créer un contact | `{firstName, lastName, phone}` |
| PATCH | `/contacts/:id` | Modifier un contact | `{firstName?, lastName?, phone?}` |
| DELETE | `/contacts/:id` | Supprimer un contact | - |

### Authentification API

Ajoutez le header suivant aux requêtes protégées :
```
Authorization: Bearer <votre_jwt_token>
```

## Identifiants de Test

### Compte de démonstration

**Email** : `demo@example.com`  
**Mot de passe** : `demo123`

Ou créez votre propre compte via l'inscription.

## Structure du Projet

```
mycontacts/
├── server/                     # Backend API
│   ├── controllers/           # Logique métier
│   ├── models/               # Modèles MongoDB
│   ├── routes/               # Routes Express
│   ├── middlewares/          # Middlewares (auth, errors)
│   ├── services/             # Services business
│   ├── utils/                # Utilitaires
│   ├── swagger.js            # Documentation API
│   └── server.js             # Point d'entrée
│
├── client/mycontacts-client/   # Frontend React
│   ├── public/               # Assets statiques
│   ├── src/
│   │   ├── components/       # Composants réutilisables
│   │   ├── pages/           # Pages principales
│   │   ├── context/         # Contexts React
│   │   ├── api/             # Configuration Axios
│   │   ├── __tests__/       # Tests unitaires
│   │   └── styles.css       # Design Apple moderne
│   │
│   └── package.json
│
├── DEPLOYMENT.md             # Guide de déploiement
└── README.md                # Ce fichier
```

## Fonctionnalités

### Authentification
- Inscription avec validation
- Connexion sécurisée
- Gestion des tokens JWT
- Déconnexion automatique

### Gestion des Contacts
- Ajout de nouveaux contacts
- Modification des informations
- Suppression avec confirmation
- Affichage en liste moderne

### Interface Utilisateur
- Design Apple moderne avec effet de verre
- Interface responsive
- Notifications en temps réel
- Navigation fluide entre pages

### Sécurité
- Mots de passe hachés (bcrypt)
- Tokens JWT avec expiration
- Validation des données
- Protection CORS
- Headers de sécurité

## Tests

Le projet inclut des tests unitaires complets :

```bash
cd client/mycontacts-client
npm test
```

**Couverture de tests** : 70%+ sur tous les composants critiques

### Tests inclus
- Tests d'authentification (AuthContext)
- Tests des pages (Login, Register, Contacts)  
- Tests du système de notifications
- Tests des interactions utilisateur

## Déploiement

### Backend (Render)

1. Push sur GitHub
2. Connecter le repository sur Render
3. Configurer les variables d'environnement :
   - `NODE_ENV=production`
   - `MONGO_URI=votre_uri_mongodb`
   - `JWT_SECRET=votre_secret`
   - `PORT=10000`

### Frontend (Netlify)

1. Build local : `npm run build`
2. Drag & drop du dossier `build/` sur Netlify
3. Configurer la variable : `REACT_APP_API_URL=https://votre-backend.onrender.com`

## Technologies Utilisées

### Backend
- **Express** : Framework web
- **MongoDB** : Base de données NoSQL
- **Mongoose** : ODM MongoDB
- **JWT** : Authentification
- **bcrypt** : Hachage des mots de passe
- **CORS** : Gestion des requêtes cross-origin
- **Swagger** : Documentation API

### Frontend
- **React** : Bibliothèque UI
- **React Router** : Navigation
- **Axios** : Client HTTP
- **Context API** : Gestion d'état
- **CSS3** : Design moderne avec glassmorphism

### Tests & Outils
- **Jest** : Framework de tests
- **React Testing Library** : Tests de composants
- **ESLint** : Qualité du code
- **Git** : Contrôle de version

## Développement

### Règles de développement
- Commits conventionnels : `feat:`, `fix:`, `docs:`
- Tests obligatoires pour les nouvelles fonctionnalités
- Code review avant merge
- Respect des standards ESLint

### Contribution
1. Fork du projet
2. Créer une branche feature : `git checkout -b feature/nouvelle-fonctionnalite`
3. Commit des changements : `git commit -m 'feat: nouvelle fonctionnalité'`
4. Push vers la branche : `git push origin feature/nouvelle-fonctionnalite`
5. Créer une Pull Request

## Troubleshooting

### Erreurs courantes

**CORS Error** : Vérifiez que l'URL frontend est autorisée dans `server/server.js`

**JWT Invalid** : Le token a expiré, reconnectez-vous

**Database Connection** : Vérifiez votre URI MongoDB dans les variables d'environnement

**Build Failed** : Supprimez `node_modules` et relancez `npm install`

### Support

Pour signaler un bug ou demander une fonctionnalité, créez une issue sur GitHub.

## License

Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails.

---

**Développé avec** Node.js, React et beaucoup de café ☕