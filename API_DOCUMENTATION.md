# 📚 Documentation API Nolyo Backend

## 🚀 Démarrage du serveur

```bash
npm start
# ou
npm run dev  # avec nodemon
```

Le serveur sera disponible sur `http://localhost:3000`

## 📊 Endpoints API

### 🏠 Route principale
- **GET** `/` - Informations sur l'API

### 🛍️ Produits (Products)

#### Récupérer tous les produits
- **GET** `/api/products`
- **Paramètres de requête :**
  - `page` (optionnel) : Numéro de page (défaut: 1)
  - `limit` (optionnel) : Nombre d'éléments par page (défaut: 10)
  - `category` (optionnel) : ID de la catégorie pour filtrer
  - `seller` (optionnel) : ID du vendeur pour filtrer
  - `search` (optionnel) : Recherche par nom de produit

**Exemple :**
```
GET /api/products?page=1&limit=5&category=1&search=laptop
```

#### Récupérer un produit par ID
- **GET** `/api/products/:id`

#### Créer un nouveau produit
- **POST** `/api/products`
- **Body (JSON) :**
```json
{
  "name": "Nom du produit",
  "description": "Description du produit",
  "price": 99.99,
  "stock": 10,
  "imageUrl": "https://example.com/image.jpg",
  "sellerId": 1,
  "categoryId": 1
}
```

#### Mettre à jour un produit
- **PUT** `/api/products/:id`
- **Body (JSON) :** Même structure que la création, tous les champs sont optionnels

#### Supprimer un produit
- **DELETE** `/api/products/:id`

### 📂 Catégories (Categories)

#### Récupérer toutes les catégories
- **GET** `/api/categories`

#### Récupérer une catégorie par ID
- **GET** `/api/categories/:id`

## 📝 Format des réponses

### Succès
```json
{
  "success": true,
  "data": { ... },
  "message": "Message optionnel"
}
```

### Erreur
```json
{
  "success": false,
  "error": "Description de l'erreur",
  "message": "Message détaillé (en développement)"
}
```

## 🔧 Configuration

### Variables d'environnement (.env)
```env
DATABASE_URL="mysql://username:password@localhost:3306/nolyo_db"
JWT_SECRET="your-secret-key-here"
JWT_EXPIRES_IN="7d"
PORT=3000
NODE_ENV=development
```

## 🧪 Exemples d'utilisation

### Créer un produit
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "MacBook Pro",
    "description": "Ordinateur portable Apple",
    "price": 1999.99,
    "stock": 5,
    "sellerId": 1,
    "categoryId": 1
  }'
```

### Récupérer les produits avec pagination
```bash
curl "http://localhost:3000/api/products?page=1&limit=5"
```

### Rechercher des produits
```bash
curl "http://localhost:3000/api/products?search=laptop"
```

## 🏗️ Structure du projet

```
src/
├── config/
│   └── database.js          # Configuration Prisma
├── controllers/
│   ├── productController.js # Logique métier des produits
│   └── categoryController.js # Logique métier des catégories
├── routes/
│   ├── productRoutes.js     # Routes des produits
│   └── categoryRoutes.js    # Routes des catégories
└── generated/
    └── prisma/              # Client Prisma généré
```

## 🚨 Gestion des erreurs

L'API gère automatiquement :
- Validation des données
- Vérification de l'existence des entités liées
- Gestion des erreurs de base de données
- Messages d'erreur explicites
