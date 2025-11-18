import { PrismaClient } from '@prisma/client';
import { createStripeProduct, updateStripeProduct, deleteStripeProduct } from './stripe.service.js';

const prisma = new PrismaClient();

// Récupérer tous les produits
export const getAllProductsService = async () => {
  return await prisma.product.findMany({
    include: {
      category: true,
      seller: {
        include: {
          user: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
};

// Récupérer un produit par ID
export const getProductByIdService = async (id) => {
  return await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      seller: {
        include: {
          user: true
        }
      }
    }
  });
};

// Créer un nouveau produit
export const createProductService = async (data) => {
  return await prisma.$transaction(async (tx) => {
    // Créer le produit dans la base de données
    const product = await tx.product.create({
      data,
      include: {
        category: true,
        seller: {
          include: {
            user: true
          }
        }
      }
    });
    
    // Créer le produit dans Stripe
    try {
      const stripeResult = await createStripeProduct({
        name: product.name,
        description: product.description,
        price: product.price,
        imageUrl: product.imageUrl,
        dbProductId: product.id,
        categoryId: product.categoryId,
        sellerId: product.sellerId,
      });

      // Mettre à jour le produit avec l'ID Stripe
      const updatedProduct = await tx.product.update({
        where: { id: product.id },
        data: {
          stripeProductId: stripeResult.productId,
          stripePriceId: stripeResult.priceId,
        },
        include: {
          category: true,
          seller: {
            include: {
              user: true
            }         
          }
        }
      });

      // Mettre à jour la catégorie avec la date du dernier produit ajouté
      await tx.category.update({
        where: { id: data.categoryId },
        data: {
          updatedAt: new Date()
        }
      });

      return updatedProduct;
    } catch (stripeError) {
      // Si la création Stripe échoue, on supprime le produit de la DB
      // pour maintenir la cohérence
      await tx.product.delete({
        where: { id: product.id }
      });
      
      console.error('Erreur lors de la création du produit Stripe:', stripeError);
      throw new Error(`Erreur lors de la création du produit dans Stripe: ${stripeError.message}`);
    }
  });
};

// Mettre à jour un produit
export const updateProductService = async (id, data) => {
  // Récupérer le produit existant pour vérifier s'il a un stripeProductId
  const existingProduct = await prisma.product.findUnique({
    where: { id }
  });

  // Mettre à jour le produit dans la base de données
  const updatedProduct = await prisma.product.update({
    where: { id },
    data,
    include: {
      category: true,
      seller: {
        include: {
          user: true
        }
      }
    }
  });

  // Si le produit existe dans Stripe, le mettre à jour aussi
  if (existingProduct?.stripeProductId) {
    try {
      await updateStripeProduct(existingProduct.stripeProductId, {
        name: data.name,
        description: data.description,
        price: data.price,
        imageUrl: data.imageUrl,
      });
    } catch (stripeError) {
      console.error('Erreur lors de la mise à jour du produit Stripe:', stripeError);
      // On continue même si Stripe échoue, pour ne pas bloquer la mise à jour en DB
    }
  }

  return updatedProduct;
};

// Supprimer un produit
export const deleteProductService = async (id) => {
  // Récupérer le produit pour vérifier s'il a un stripeProductId
  const product = await prisma.product.findUnique({
    where: { id }
  });

  // Supprimer le produit de la base de données
  const deletedProduct = await prisma.product.delete({
    where: { id }
  });

  // Si le produit existe dans Stripe, le désactiver aussi
  if (product?.stripeProductId) {
    try {
      await deleteStripeProduct(product.stripeProductId);
    } catch (stripeError) {
      console.error('Erreur lors de la suppression du produit Stripe:', stripeError);
      // On continue même si Stripe échoue, le produit est déjà supprimé de la DB
    }
  }

  return deletedProduct;
};

// Vérifier si un produit existe
export const productExistsService = async (id) => {
  return await prisma.product.findUnique({
    where: { id }
  });
};

// Vérifier si un vendeur existe
export const sellerExistsService = async (id) => {
  return await prisma.seller.findUnique({
    where: { id }
  });
};

// Vérifier si une catégorie existe
export const categoryExistsService = async (id) => {
  return await prisma.category.findUnique({
    where: { id }
  });
};
