import express from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory
} from '../controllers/productController.js';

const router = express.Router();

// Routes CRUD pour les produits
router.get('/', getAllProducts);           // GET /api/products
router.get('/:id', getProductById);        // GET /api/products/:id
router.post('/add', createProduct);         // POST /api/products
router.put('/edit/:id', updateProduct);        // PUT /api/products/:id
router.delete('/delete/:id', deleteProduct);   // DELETE /api/products/:id
router.get('/category/:id', getProductsByCategory);


export default router;
