import express from 'express';
import multer from 'multer';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/product.controller.js';
import authMiddleware from '../middleware/all.middleware.js';
import { uploadProductImage } from '../middleware/upload.middleware.js';

const router = express.Router();

// Middleware pour gérer les erreurs de multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'Le fichier est trop volumineux (max 5MB)'
      });
    }
    return res.status(400).json({
      success: false,
      error: err.message
    });
  }
  if (err) {
    return res.status(400).json({
      success: false,
      error: err.message
    });
  }
  next();
};

// Routes CRUD pour les produits
router.get('/', getAllProducts);           // GET /api/products
router.get('/:id', getProductById);        // GET /api/products/:id
router.post('/', authMiddleware, uploadProductImage, handleMulterError, createProduct);          // POST /api/products
router.put('/:id', authMiddleware, uploadProductImage, handleMulterError, updateProduct);        // PUT /api/products/:id
router.delete('/:id', authMiddleware, deleteProduct);     // DELETE /api/products/:id

export default router;
