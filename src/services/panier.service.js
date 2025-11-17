import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();



export const getPanierByUserId = async (userId) => {
  try {
    // 1. Vérifier que le client existe
    const client = await prisma.client.findUnique({
      where: { userId },
     include: {
        carts: {
          include: {
            items: true,
          },
        },
      },
    });

    if (!client) {
      return {
        success: false,
        message: "Client introuvable pour cet utilisateur.",
        panier: [],
      };
    }

    // 2. Retourner le panier directement depuis la relation
    return {
      success: true,
      panier: client.carts ?? [],
    };

  } catch (error) {
    return {
      success: false,
      message: "Erreur lors de la récupération du panier.",
      error: error.message,
    };
  }
};

export const createPanier = async (userId, items = []) => {
  const clientuser = await prisma.client.findUnique({
    where: { userId: userId },
  });
  console.log("itemsitems", items, "userIduserId", clientuser);

  if (!clientuser) {
    throw new Error("Client not found");
  }
  const productExist = await prisma.product.findUnique({
    where: { id: items[0].productId },
  });
  console.log("productExist", productExist, "user", clientuser);

  const newPanier = await prisma.cart.create({
    data: {
      clientId: clientuser.id,
      items: {
        create: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity || 1,
        })),
      },
    },
    include: {
      items: true,
    },
  });
  return newPanier;
};

export const updatePanierItems = async (cartItemId, newQuantity) => {
  if (!cartItemId || !newQuantity) {
    throw new Error("Panier ID and items are required");
  }
  const updatedItem = await prisma.cartItem.update({
    where: {
      id: cartItemId, // l'ID du CartItem à modifier
    },
    data: {
      quantity: newQuantity, // nouvelle quantité pour ce produit
    },
  });
  return updatedItem;
};
export const deletePanier = async (panierId) => {
  if (!panierId) {
    throw new Error("Panier ID is required");
  }
  const cartitme = await prisma.cart.findFirst({
    where: { id: panierId },
  });
  if (!cartitme) {
    throw new Error("Panier not found");
  }
  const deletedPanier = await prisma.cart.delete({
    where: { id: panierId },
  });
  return deletedPanier;
};
export const clearPanier = async (panierId) => {
  if (!panierId) {
    throw new Error("Panier ID is required");
  }

  // Supprimer tous les items liés à ce panier
  const clearedItems = await prisma.cartItem.deleteMany({
    where: { cartId: panierId },
  });

  return {
    success: true,
    message: `Panier ${panierId} vidé avec succès`,
    deletedCount: clearedItems.count,
  };
};

