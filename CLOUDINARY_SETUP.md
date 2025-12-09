# Configuration Cloudinary

Ce projet utilise Cloudinary pour stocker les images des produits.

## Installation

Installez les packages nécessaires :

```bash
npm install cloudinary multer-storage-cloudinary
```

## Configuration

1. Créez un compte sur [Cloudinary](https://cloudinary.com/) si vous n'en avez pas déjà un.

2. Récupérez vos identifiants depuis le [Dashboard Cloudinary](https://cloudinary.com/console) :
   - Cloud Name
   - API Key
   - API Secret

3. Ajoutez ces variables à votre fichier `.env` :

```env
CLOUDINARY_CLOUD_NAME="votre-cloud-name"
CLOUDINARY_API_KEY="votre-api-key"
CLOUDINARY_API_SECRET="votre-api-secret"
```

## Fonctionnalités

- **Upload automatique** : Les images sont automatiquement uploadées sur Cloudinary lors de la création ou mise à jour d'un produit
- **Optimisation** : Les images sont automatiquement optimisées (redimensionnées à 800x800px max, qualité auto)
- **Suppression automatique** : Les anciennes images sont supprimées de Cloudinary lors de la mise à jour ou suppression d'un produit
- **Formats supportés** : jpg, jpeg, png, gif, webp
- **Taille maximale** : 5MB par fichier

## Structure des dossiers Cloudinary

Les images sont stockées dans le dossier `nolyo/products/` sur Cloudinary.

## Utilisation

Lors de la création ou mise à jour d'un produit, envoyez une requête `multipart/form-data` avec :
- Le champ `imageUrl` contenant le fichier image
- Les autres champs du produit (name, price, description, etc.)

L'URL Cloudinary complète sera automatiquement stockée dans le champ `imageUrl` du produit.

