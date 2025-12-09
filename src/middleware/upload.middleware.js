import 'dotenv/config';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import path from 'path';

// Vérifier que les variables d'environnement Cloudinary sont définies
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloudName || !apiKey || !apiSecret) {
  console.error('⚠️  ERREUR: Variables d\'environnement Cloudinary manquantes !');
  console.error('Assurez-vous d\'avoir défini dans votre fichier .env :');
  console.error('  - CLOUDINARY_CLOUD_NAME');
  console.error('  - CLOUDINARY_API_KEY');
  console.error('  - CLOUDINARY_API_SECRET');
  console.error('\nValeurs actuelles:');
  console.error(`  CLOUDINARY_CLOUD_NAME: ${cloudName ? '✓' : '✗ (manquant)'}`);
  console.error(`  CLOUDINARY_API_KEY: ${apiKey ? '✓' : '✗ (manquant)'}`);
  console.error(`  CLOUDINARY_API_SECRET: ${apiSecret ? '✓' : '✗ (manquant)'}`);
}

// Configuration de Cloudinary
try {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret
  });
  
  // Test de la configuration en vérifiant que les valeurs ne sont pas vides
  if (cloudName && apiKey && apiSecret) {
    console.log('✓ Configuration Cloudinary chargée');
  }
} catch (error) {
  console.error('❌ Erreur lors de la configuration Cloudinary:', error.message);
}

// Configuration du stockage Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: 'nolyo/products', // Dossier dans Cloudinary
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
      transformation: [
        {
          width: 800,
          height: 800,
          crop: 'limit',
          quality: 'auto'
        }
      ],
      public_id: `product-${Date.now()}-${Math.round(Math.random() * 1E9)}`
    };
  }
});

// Filtrer les types de fichiers (seulement les images)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Seules les images (jpeg, jpg, png, gif, webp) sont autorisées'));
  }
};

// Configuration de multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max
  },
  fileFilter: fileFilter
});

// Middleware pour uploader une seule image
export const uploadProductImage = upload.single('imageUrl');

// Middleware pour uploader plusieurs images (si besoin plus tard)
export const uploadProductImages = upload.array('images', 5);

