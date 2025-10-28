# 🛒 Nolyo Backend API

API REST pour la plateforme de marketplace Nolyo, développée avec Node.js, Express.js et Prisma ORM.

## 📋 Table des matières

- [Présentation](#présentation)
- [Technologies utilisées](#technologies-utilisées)
- [Architecture](#architecture)
- [Installation](#installation)
- [Configuration](#configuration)
- [Utilisation](#utilisation)
- [API Endpoints](#api-endpoints)
- [Base de données](#base-de-données)
- [Authentification](#authentification)
- [Structure du projet](#structure-du-projet)
- [Développement](#développement)
- [Contributions](#contributions)

## 🎯 Présentation

Nolyo est une plateforme de marketplace qui permet aux vendeurs de proposer leurs produits et aux clients de les acheter. Cette API backend gère l'authentification, la gestion des produits, des catégories, des paniers et des commandes.

### Fonctionnalités principales

- ✅ **Authentification JWT** avec rôles (Client, Vendeur, Admin)
- ✅ **Gestion des produits** avec CRUD complet
- ✅ **Gestion des catégories** avec CRUD complet
- ✅ **Système de panier** pour les clients
- ✅ **Gestion des commandes** avec statuts
- ✅ **Gestion des adresses** de livraison
- ✅ **Architecture en couches** (Controller → Service → Database)

## 🛠 Technologies utilisées

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **Prisma** - ORM moderne pour TypeScript/JavaScript
- **PostgreSQL** - Base de données relationnelle
- **JWT** - Authentification par tokens
- **bcrypt** - Hachage des mots de passe
- **CORS** - Gestion des requêtes cross-origin

## 🏗 Architecture

Le projet suit une architecture en couches (layered architecture) :

```
┌─────────────────────────────────────┐
│           Routes Layer             │
│     (Express Router)               │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│         Controller Layer             │
│   (HTTP Request/Response Handling)   │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│          Service Layer              │
│      (Business Logic)               │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│         Database Layer              │
│        (Prisma ORM)                 │
└─────────────────────────────────────┘
```

## 🚀 Installation

### Prérequis

- Node.js (v18 ou supérieur)
- PostgreSQL (v13 ou supérieur)
- npm ou yarn

### Étapes d'installation

1. **Cloner le repository**
```bash
git clone https://github.com/Equipe-D-Marketplace/nolyo-back.git
cd nolyo-back
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer les variables d'environnement**
```bash
cp .env.example .env
# Éditer le fichier .env avec vos paramètres
```

4. **Générer le client Prisma**
```bash
npx prisma generate
```

5. **Appliquer les migrations**
```bash
npx prisma migrate dev
```

6. **Démarrer le serveur**
```bash
npm start
```

## ⚙️ Configuration

### Variables d'environnement

Créer un fichier `.env` à la racine du projet :

```env
# Base de données
DATABASE_URL="postgresql://postgres.lmjnfpqiphnadtepacun:Marco123456789%4069@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.lmjnfpqiphnadtepacun:Marco123456789%4069@aws-1-eu-west-1.pooler.supabase.com:5432/postgres"
jwtSecret="nolyogroupeprojet"


# JWT
JWT_SECRET="votre-secret-jwt-super-securise"

# Serveur
PORT=3000
NODE_ENV=development
```

### Configuration de la base de données

1. **Créer la base de données PostgreSQL**
```sql
CREATE DATABASE nolyodb;
```

2. **Appliquer les migrations**
```bash
npx prisma migrate dev --name init
```

## 🎮 Utilisation

### Démarrage du serveur

```bash
# Mode développement (avec nodemon)
npm start

# Mode production
node server.js
```

Le serveur sera accessible sur `http://localhost:3000`

### Scripts disponibles

```bash
npm start          # Démarre le serveur avec nodemon
npm run build      # Régénère le client Prisma
npm test           # Lance les tests (à implémenter)
```

## 📡 API Endpoints

### 🔐 Authentification

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/auth/register` | Inscription d'un utilisateur |
| POST | `/api/auth/login` | Connexion |
| POST | `/api/auth/logout` | Déconnexion |

### 📂 Catégories

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/categories` | Liste toutes les catégories |
| GET | `/api/categories/:id` | Récupère une catégorie par ID |
| POST | `/api/categories` | Crée une nouvelle catégorie |
| PUT | `/api/categories/:id` | Met à jour une catégorie |
| DELETE | `/api/categories/:id` | Supprime une catégorie |
| POST | `/api/categories/:id/products` | Ajoute un produit à une catégorie |

### 🛍 Produits

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/products` | Liste tous les produits |
| GET | `/api/products/:id` | Récupère un produit par ID |
| POST | `/api/products` | Crée un nouveau produit |
| PUT | `/api/products/:id` | Met à jour un produit |
| DELETE | `/api/products/:id` | Supprime un produit |

### Exemples de requêtes

#### Créer un produit
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "MacBook Pro",
    "description": "Ordinateur portable Apple",
    "price": 1999.99,
    "stock": 10,
    "sellerId": 1,
    "categoryId": 1
  }'
```

#### Ajouter un produit à une catégorie
```bash
curl -X POST http://localhost:3000/api/categories/1/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "iPhone 15",
    "price": 999.99,
    "sellerId": 1
  }'
```

## 🗄 Base de données

### Modèles principaux

- **User** - Utilisateurs du système
- **Client** - Clients avec panier et commandes
- **Seller** - Vendeurs avec produits
- **Category** - Catégories de produits
- **Product** - Produits en vente
- **Cart** - Paniers des clients
- **Order** - Commandes
- **Address** - Adresses de livraison

### Relations

```
User (1:1) Client
User (1:1) Seller
Category (1:N) Product
Seller (1:N) Product
Client (1:N) Cart
Cart (1:N) CartItem
Product (1:N) CartItem
Client (1:N) Order
Order (1:N) OrderItem
Product (1:N) OrderItem
```

## 🔒 Authentification

Le système utilise JWT (JSON Web Tokens) pour l'authentification :

1. **Inscription/Connexion** → Génération d'un token JWT
2. **Requêtes authentifiées** → Header `Authorization: Bearer <token>`
3. **Middleware d'authentification** → Vérification du token sur les routes protégées

### Rôles utilisateur

- **CLIENT** - Peut acheter des produits
- **SELLER** - Peut vendre des produits
- **ADMIN** - Accès complet au système

## 📁 Structure du projet

```
nolyo-back/
├── prisma/
│   ├── migrations/          # Migrations de la base de données
│   └── schema.prisma        # Schéma Prisma
├── src/
│   ├── controllers/         # Contrôleurs HTTP
│   │   ├── auth.controller.js
│   │   ├── category.controller.js
│   │   └── product.controller.js
│   ├── services/           # Logique métier
│   │   ├── auth.service.js
│   │   ├── category.service.js
│   │   └── product.service.js
│   ├── routers/            # Routes Express
│   │   ├── auth.route.js
│   │   ├── category.route.js
│   │   └── product.route.js
│   ├── middleware/         # Middlewares
│   │   └── all.middleware.js
│   └── utils/              # Utilitaires
│       └── auth.utils.js
├── server.js              # Point d'entrée
├── package.json           # Dépendances et scripts
└── README.md             # Documentation
```

## 🛠 Développement

### Ajout de nouvelles fonctionnalités

1. **Créer le modèle** dans `prisma/schema.prisma`
2. **Générer la migration** : `npx prisma migrate dev`
3. **Créer le service** dans `src/services/`
4. **Créer le contrôleur** dans `src/controllers/`
5. **Créer les routes** dans `src/routers/`
6. **Ajouter les routes** dans `server.js`

### Bonnes pratiques

- ✅ Utiliser l'architecture en couches
- ✅ Valider les données d'entrée
- ✅ Gérer les erreurs proprement
- ✅ Utiliser des transactions pour les opérations complexes
- ✅ Documenter les endpoints
- ✅ Tester les fonctionnalités

### Commandes utiles

```bash
# Régénérer le client Prisma
npx prisma generate

# Appliquer les migrations
npx prisma migrate dev

# Ouvrir Prisma Studio
npx prisma studio

# Réinitialiser la base de données
npx prisma migrate reset
```

## 🤝 Contributions

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

### Standards de code

- Utiliser des noms de variables explicites
- Commenter le code complexe
- Suivre les conventions ESLint
- Écrire des tests pour les nouvelles fonctionnalités

## 📄 Licence

Ce projet est sous licence ISC. Voir le fichier `LICENSE` pour plus de détails.

## 👥 Équipe

Développé par l'équipe D-Marketplace pour le projet Nolyo.

---

**Version** : 1.0.0  
