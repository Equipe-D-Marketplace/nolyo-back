import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getPanierByUserId = async (userId) => {
  const panier = await prisma.cart.findMany({
    where: { clientId: userId },
    include: {
      items: true,
    },
  });
  return panier;
};
export const createPanier = async (userId, items = []) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!user) {
    throw new Error("User not found");
  }
  const newPanier = await prisma.cart.create({
    data: {
      clientId: userId,
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
  const clearedPanier = await prisma.cartItem.deleteMany({
    where: { cartId: panierId },
  });
  return clearedPanier;
};
