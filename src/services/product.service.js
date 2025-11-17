import { PrismaClient } from '@prisma/client';

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
    // Créer le produit
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
    
    // Mettre à jour la catégorie avec la date du dernier produit ajouté
    // await tx.category.update({
    //   where: { id: data.categoryId },
    //   data: {
    //     updatedAt: new Date()
    //   }
    // });
    
    return product;
  });
};

// Mettre à jour un produit
export const updateProductService = async (id, data) => {
  return await prisma.product.update({
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
};

// Supprimer un produit
export const deleteProductService = async (id) => {
  return await prisma.product.delete({
    where: { id }
  });
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
