import {
  getAllProductsService,
  getProductByIdService,
  createProductService,
  updateProductService,
  deleteProductService,
  productExistsService,
  sellerExistsService,
  categoryExistsService
} from '../services/product.service.js';

// GET /api/products - Récupérer tous les produits
export const getAllProducts = async (req, res) => {
  try {
    const products = await getAllProductsService();
    
    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erreur lors de la récupération des produits',
      message: error.message
    });
  }
};

// GET /api/products/:id - Récupérer un produit par ID
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validation de l'ID
    if (isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        error: 'ID de produit invalide'
      });
    }
    
    const product = await getProductByIdService(parseInt(id));
    
    if (!product) {
      return res.status(404).json({ 
        success: false,
        error: 'Produit non trouvé' 
      });
    }
    
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du produit:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erreur lors de la récupération du produit',
      message: error.message
    });
  }
};

// POST /api/products - Créer un nouveau produit
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, imageUrl, sellerId, categoryId } = req.body;
    
    // Validation des données requises
    if (!name || !price || !sellerId || !categoryId) {
      return res.status(400).json({ 
        success: false,
        error: 'Les champs name, price, sellerId et categoryId sont requis' 
      });
    }
    
    // Validation du prix
    if (parseFloat(price) <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Le prix doit être supérieur à 0'
      });
    }
    
    // Vérifier que le vendeur existe
    const seller = await sellerExistsService(parseInt(sellerId));
    if (!seller) {
      return res.status(400).json({ 
        success: false,
        error: 'Vendeur non trouvé' 
      });
    }
    
    // Vérifier que la catégorie existe
    const category = await categoryExistsService(parseInt(categoryId));
    if (!category) {
      return res.status(400).json({ 
        success: false,
        error: 'Catégorie non trouvée' 
      });
    }
    
    const product = await createProductService({
      name,
      description,
      price: parseFloat(price),
      stock: parseInt(stock) || 0,
      imageUrl,
      sellerId: parseInt(sellerId),
      categoryId: parseInt(categoryId)
    });
    
    res.status(201).json({
      success: true,
      data: product,
      message: 'Produit créé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la création du produit:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erreur lors de la création du produit',
      message: error.message
    });
  }
};

// PUT /api/products/:id - Mettre à jour un produit
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock, imageUrl, categoryId } = req.body;
    
    // Validation de l'ID
    if (isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        error: 'ID de produit invalide'
      });
    }
    
    // Vérifier que le produit existe
    const existingProduct = await productExistsService(parseInt(id));
    if (!existingProduct) {
      return res.status(404).json({ 
        success: false,
        error: 'Produit non trouvé' 
      });
    }
    
    // Vérifier la catégorie si elle est fournie
    if (categoryId) {
      const category = await categoryExistsService(parseInt(categoryId));
      if (!category) {
        return res.status(400).json({ 
          success: false,
          error: 'Catégorie non trouvée' 
        });
      }
    }
    
    // Validation du prix si fourni
    if (price !== undefined && parseFloat(price) <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Le prix doit être supérieur à 0'
      });
    }
    
    // Préparer les données de mise à jour
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (stock !== undefined) updateData.stock = parseInt(stock);
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (categoryId !== undefined) updateData.categoryId = parseInt(categoryId);
    
    const product = await updateProductService(parseInt(id), updateData);
    
    res.json({
      success: true,
      data: product,
      message: 'Produit mis à jour avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du produit:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erreur lors de la mise à jour du produit',
      message: error.message
    });
  }
};

// DELETE /api/products/:id - Supprimer un produit
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validation de l'ID
    if (isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        error: 'ID de produit invalide'
      });
    }
    
    // Vérifier que le produit existe
    const existingProduct = await productExistsService(parseInt(id));
    if (!existingProduct) {
      return res.status(404).json({ 
        success: false,
        error: 'Produit non trouvé' 
      });
    }
    
    await deleteProductService(parseInt(id));
    
    res.status(204).send();
  } catch (error) {
    console.error('Erreur lors de la suppression du produit:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erreur lors de la suppression du produit',
      message: error.message
    });
  }
};
