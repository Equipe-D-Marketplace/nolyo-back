import express from 'express';
import authMiddleware from '../middleware/all.middleware.js';
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  addProductToCategory
} from '../controllers/category.controller.js';

const router = express.Router();

// Routes CRUD pour les catégories
router.get('/', authMiddleware, getAllCategories);           // GET /api/categories
router.get('/:id', authMiddleware, getCategoryById);        // GET /api/categories/:id
router.post('/', authMiddleware, createCategory);          // POST /api/categories
router.put('/:id', authMiddleware, updateCategory);        // PUT /api/categories/:id
router.delete('/:id', authMiddleware, deleteCategory);     // DELETE /api/categories/:id

// Route pour ajouter un produit à une catégorie
router.post('/:id/products', authMiddleware, addProductToCategory); // POST /api/categories/:id/products

export default router;
