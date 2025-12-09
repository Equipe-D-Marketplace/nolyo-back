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
import { v2 as cloudinary } from 'cloudinary';

// Fonction utilitaire pour extraire le public_id d'une URL Cloudinary
const extractPublicIdFromUrl = (url) => {
  if (!url) return null;
  
  try {
    // Les URLs Cloudinary ont le format: 
    // https://res.cloudinary.com/{cloud_name}/image/upload/v{version}/{public_id}.{format}
    // ou: https://res.cloudinary.com/{cloud_name}/image/upload/{public_id}.{format}
    const urlParts = url.split('/');
    const uploadIndex = urlParts.findIndex(part => part === 'upload');
    
    if (uploadIndex === -1) return null;
    
    // Prendre la partie après 'upload'
    const afterUpload = urlParts.slice(uploadIndex + 1);
    
    // Filtrer les versions (format: v1234567890)
    const partsWithoutVersion = afterUpload.filter(part => !part.match(/^v\d+$/));
    
    // Le dernier élément contient le nom de fichier avec extension
    const filename = partsWithoutVersion[partsWithoutVersion.length - 1];
    // Enlever l'extension
    const publicIdWithoutExt = filename.split('.')[0];
    
    // Reconstruire le public_id complet avec le dossier (tous les éléments sauf le dernier)
    const folderParts = partsWithoutVersion.slice(0, -1);
    if (folderParts.length > 0) {
      return `${folderParts.join('/')}/${publicIdWithoutExt}`;
    }
    return publicIdWithoutExt;
  } catch (error) {
    console.error('Erreur lors de l\'extraction du public_id:', error);
    return null;
  }
};

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
    const { name, description, price, stock, sellerId, categoryId } = req.body;
    
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
    
    // Gérer l'image uploadée
    let imageUrl = null;
    if (req.file) {
      // req.file.path contient l'URL complète de l'image sur Cloudinary
      // req.file.public_id peut aussi être disponible selon la version de multer-storage-cloudinary
      imageUrl = req.file.path || req.file.url;
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
    const { name, description, price, stock, categoryId } = req.body;
    
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
    if (categoryId !== undefined) updateData.categoryId = parseInt(categoryId);
    
    // Gérer l'image uploadée
    if (req.file) {
      // Supprimer l'ancienne image de Cloudinary si elle existe
      if (existingProduct.imageUrl) {
        try {
          const publicId = extractPublicIdFromUrl(existingProduct.imageUrl);
          if (publicId) {
            await cloudinary.uploader.destroy(publicId);
          }
        } catch (error) {
          console.error('Erreur lors de la suppression de l\'ancienne image:', error);
          // Continuer même si la suppression échoue
        }
      }
      // req.file.path contient l'URL complète de la nouvelle image sur Cloudinary
      updateData.imageUrl = req.file.path || req.file.url;
    }
    
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
    
    // Supprimer l'image de Cloudinary si elle existe
    if (existingProduct.imageUrl) {
      try {
        const publicId = extractPublicIdFromUrl(existingProduct.imageUrl);
        if (publicId) {
          await cloudinary.uploader.destroy(publicId);
        }
      } catch (error) {
        console.error('Erreur lors de la suppression de l\'image:', error);
        // Continuer même si la suppression échoue
      }
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
