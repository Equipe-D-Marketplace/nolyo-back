import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createOrderService = async (body) => {
  try {
    const { clientId, addressId, totalAmount, status, isGuest } = body;

    if (!clientId || !addressId) {
      throw new Error("ClientId et AddressId sont requis");
    }

    const client = await prisma.client.findUnique({
      where: { id: clientId },
      include: { user: true },
    });

    const address = await prisma.address.findUnique({
      where: { id: addressId },
    });

    if (!client || !address) {
      throw new Error("Client ou adresse introuvable");
    }

    const order = await prisma.order.create({
      data: {
        clientId,
        addressId,
        totalAmount,
        status,
        isGuest,
        email: client.user?.email ?? null,
        phone: client.user?.phone ?? null,
      },
    });

    return order;
  } catch (error) {
    throw new Error(`Erreur lors de la création de la commande: ${error.message}`);
  }
};

export const getOrderById = async (id) => {
  try {
    if (!id) throw new Error("Id requis");

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        client: true,
        items: { include: { product: true } },
        address: true,
      },
    });

    if (!order) throw new Error("Commande introuvable");

    return order;
  } catch (error) {
    throw new Error(`Erreur lors de la récupération de la commande: ${error.message}`);
  }
};

export const getOrderBySellerId = async (sellerId) => {
  try {
    if (!sellerId) throw new Error("SellerId requis");

    const sellerOrders = await prisma.orderItem.findMany({
      where: { product: { sellerId } },
      include: {
        order: { include: { client: true, address: true } },
        product: true,
      },
    });

    if (!sellerOrders || sellerOrders.length === 0) {
      throw new Error("Ce vendeur n'a aucune vente pour le moment.");
    }

    return sellerOrders;
  } catch (error) {
    throw new Error(`Erreur lors de la récupération des ventes: ${error.message}`);
  }
};

export const getOrderByClientId = async (clientId) => {
  try {
    if (!clientId) throw new Error("ClientId requis");

    const clientOrders = await prisma.order.findMany({
      where: { clientId },
      include: {
        client: true,
        items: { include: { product: true } },
        address: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return clientOrders; // tableau vide si aucune commande
  } catch (error) {
    throw new Error(`Erreur lors de la récupération des commandes client: ${error.message}`);
  }
};

export const editStatusOrder = async (user, body) => {
  try {
    const { id, ...fieldsToUpdate } = body;

    if (!id) throw new Error("Id de commande requis");

    const seller = await prisma.seller.findUnique({
      where: { userId: user.userId },
    });

    if (!seller) throw new Error("Vendeur introuvable");

    const orderStatus = await prisma.order.update({
      where: { id },
      data: { ...fieldsToUpdate },
    });

    return orderStatus;
  } catch (error) {
    throw new Error(`Erreur lors de la mise à jour du statut: ${error.message}`);
  }
};
