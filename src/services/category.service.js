import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Récupérer toutes les catégories
export const getAllCategoriesService = async () => {
  return await prisma.category.findMany({
    include: {
      _count: {
        select: { products: true }
      }
    },
    orderBy: {
      name: 'asc'
    }
  });
};

// Récupérer une catégorie par ID
export const getCategoryByIdService = async (id) => {
  return await prisma.category.findUnique({
    where: { id },
    include: {
      products: {
        include: {
          seller: {
            include: {
              user: true
            }
          }
        }
      },
      _count: {
        select: { products: true }
      }
    }
  });
};

// Créer une nouvelle catégorie
export const createCategoryService = async (data) => {
  return await prisma.category.create({
    data
  });
};

// Mettre à jour une catégorie
export const updateCategoryService = async (id, data) => {
  return await prisma.category.update({
    where: { id },
    data
  });
};

// Supprimer une catégorie
export const deleteCategoryService = async (id) => {
  return await prisma.category.delete({
    where: { id }
  });
};

// Vérifier si une catégorie existe
export const categoryExistsService = async (id) => {
  return await prisma.category.findUnique({
    where: { id }
  });
};

// Ajouter un produit à une catégorie
export const addProductToCategoryService = async (categoryId, productData) => {
  return await prisma.$transaction(async (tx) => {
    // Vérifier que la catégorie existe
    const category = await tx.category.findUnique({
      where: { id: categoryId }
    });
    
    if (!category) {
      throw new Error('Catégorie non trouvée');
    }
    
    // Vérifier que le vendeur existe
    const seller = await tx.seller.findUnique({
      where: { id: productData.sellerId }
    });
    
    if (!seller) {
      throw new Error('Vendeur non trouvé');
    }
    
    // Créer le produit avec la catégorie spécifiée
    const product = await tx.product.create({
      data: {
        ...productData,
        categoryId: categoryId
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
    
    // Mettre à jour la catégorie
    await tx.category.update({
      where: { id: categoryId },
      data: {
        updatedAt: new Date()
      }
    });
    
    return product;
  });
};

// Vérifier si une catégorie a des produits
export const hasProductsService = async (id) => {
  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      _count: {
        select: { products: true }
      }
    }
  });
  
  return category._count.products > 0;
};
