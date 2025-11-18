import express from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/product.controller.js';
import authMiddleware from '../middleware/all.middleware.js';
const router = express.Router();

// Routes CRUD pour les produits
router.get('/', getAllProducts);           // GET /api/products
router.get('/:id', getProductById);        // GET /api/products/:id
router.post('/', authMiddleware, createProduct);          // POST /api/products
router.put('/:id', authMiddleware, updateProduct);        // PUT /api/products/:id
router.delete('/:id', authMiddleware, deleteProduct);     // DELETE /api/products/:id

export default router;
