import {
  getAllCategoriesService,
  getCategoryByIdService,
  createCategoryService,
  updateCategoryService,
  deleteCategoryService,
  categoryExistsService,
  hasProductsService
} from '../services/category.service.js';

// GET /api/categories - Récupérer toutes les catégories
export const getAllCategories = async (req, res) => {
  try {
    const categories = await getAllCategoriesService();
    
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erreur lors de la récupération des catégories',
      message: error.message
    });
  }
};

// GET /api/categories/:id - Récupérer une catégorie par ID
export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validation de l'ID
    if (isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        error: 'ID de catégorie invalide'
      });
    }
    
    const category = await getCategoryByIdService(parseInt(id));
    
    if (!category) {
      return res.status(404).json({ 
        success: false,
        error: 'Catégorie non trouvée' 
      });
    }
    
    res.json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de la catégorie:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erreur lors de la récupération de la catégorie',
      message: error.message
    });
  }
};

// POST /api/categories - Créer une nouvelle catégorie
export const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    
    // Validation des données requises
    if (!name) {
      return res.status(400).json({ 
        success: false,
        error: 'Le champ name est requis' 
      });
    }
    
    const category = await createCategoryService({
      name,
      description
    });
    
    res.status(201).json({
      success: true,
      data: category,
      message: 'Catégorie créée avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la création de la catégorie:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erreur lors de la création de la catégorie',
      message: error.message
    });
  }
};

// PUT /api/categories/:id - Mettre à jour une catégorie
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    
    // Validation de l'ID
    if (isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        error: 'ID de catégorie invalide'
      });
    }
    
    // Vérifier que la catégorie existe
    const existingCategory = await categoryExistsService(parseInt(id));
    
    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        error: 'Catégorie non trouvée'
      });
    }
    
    // Préparer les données de mise à jour
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    
    const category = await updateCategoryService(parseInt(id), updateData);
    
    res.json({
      success: true,
      data: category,
      message: 'Catégorie mise à jour avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la catégorie:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erreur lors de la mise à jour de la catégorie',
      message: error.message
    });
  }
};

// DELETE /api/categories/:id - Supprimer une catégorie
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validation de l'ID
    if (isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        error: 'ID de catégorie invalide'
      });
    }
    
    // Vérifier que la catégorie existe
    const existingCategory = await categoryExistsService(parseInt(id));
    
    if (!existingCategory) {
      return res.status(404).json({ 
        success: false,
        error: 'Catégorie non trouvée' 
      });
    }
    
    // Vérifier si la catégorie a des produits associés
    const hasProducts = await hasProductsService(parseInt(id));
    
    if (hasProducts) {
      return res.status(400).json({
        success: false,
        error: 'Impossible de supprimer la catégorie',
        message: 'Cette catégorie contient des produits. Veuillez d\'abord supprimer ou déplacer ces produits.'
      });
    }
    
    await deleteCategoryService(parseInt(id));
    
    res.status(204).send('Catégorie supprimée avec succès');
  } catch (error) {
    console.error('Erreur lors de la suppression de la catégorie:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erreur lors de la suppression de la catégorie',
      message: error.message
    });
  }
};