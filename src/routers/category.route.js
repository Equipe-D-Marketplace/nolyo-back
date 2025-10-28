import express from 'express';
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/category.controller.js';

const router = express.Router();

// Routes CRUD pour les catégories
router.get('/', getAllCategories);           // GET /api/categories
router.get('/:id', getCategoryById);        // GET /api/categories/:id
router.post('/', createCategory);          // POST /api/categories
router.put('/:id', updateCategory);        // PUT /api/categories/:id
router.delete('/:id', deleteCategory);     // DELETE /api/categories/:id

export default router;
