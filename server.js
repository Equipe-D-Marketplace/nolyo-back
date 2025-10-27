import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import { testConnection, disconnect } from './src/config/database.js';
import productRoutes from './src/routes/productRoutes.js';
// Charger les variables d'environnement
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Middleware de gestion d'erreurs global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false,
    error: 'Erreur interne du serveur',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Une erreur est survenue'
  });
});

// Route de test
app.get('/', (req, res) => {
  res.json({ 
    message: 'API Nolyo Backend',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      products: '/api/products',
      categories: '/api/categories'
    }
  });
});

// Routes API
app.use('/api/products', productRoutes);

// Route 404 - doit être placée APRÈS toutes les autres routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route non trouvée',
    message: `La route ${req.originalUrl} n'existe pas`
  });
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('🔄 Arrêt du serveur...');
  await disconnect();
  process.exit(0);
});

// Start server
app.listen(PORT, async () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
  console.log(`📊 API Products disponible sur http://localhost:${PORT}/api/products`);
  console.log(`📂 API Categories disponible sur http://localhost:${PORT}/api/categories`);
  
  // Tester la connexion à la base de données
  await testConnection();
});