import { PrismaClient } from "@prisma/client";
import { checkoutSuccess } from "./stripe.service.js";
const prisma = new PrismaClient();

export const createOrderService = async (body, user) => {
  try {
    const { addressId, status, isGuest, sessionId } = body;
    const clientId = user.userId;
    console.log("lokoklok", clientId, addressId);
    const sessionCheck = await checkoutSuccess(sessionId);

    const items = JSON.parse(sessionCheck.metadata.products);

    for (const item of items) {
      const prod = await prisma.product.findUnique({
        where: { id: item.productId },
      });
      if (!prod) {
        throw new Error(`Produit introuvable : ID ${item.productId}`);
      }
    }

    const totalAmount = items.reduce((sum, item) => {
      return sum + item.quantity * item.unitPrice;
    }, 0);
    if (!clientId || !addressId) {
      throw new Error("ClientId et AddressId sont requis");
    }

    const client = await prisma.client.findUnique({
      where: { userId: clientId },
      include: { user: true, addresses: true },
    });

    console.log();

    const address = await prisma.address.findUnique({
      where: { id: addressId },
    });

    if (!client || !address) {
      throw new Error("Client ou adresse introuvable");
    }
    console.log({
      clientId,
      addressId,
      items,
    });

    const order = await prisma.order.create({
      data: {
        clientId: client.id,
        addressId,
        totalAmount,
        status,
        isGuest,
        email: client.user?.email ?? null,
        phone: client.user?.phone ?? null,
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          })),
        },
      },
      include: {
        client: {
          include: {
            user: true, // ✅ syntaxe correcte
          },
        },
        address: true, // tu peux aussi inclure l’adresse si besoin
        items: {
          include: {
            product: true, // utile pour voir les produits de la commande
          },
        },
      },
    });

    return order;
  } catch (error) {
    throw new Error(
      `Erreur lors de la création de la commande: ${error.message}`
    );
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
    throw new Error(
      `Erreur lors de la récupération de la commande: ${error.message}`
    );
  }
};

export const getOrderBySellerId = async (sellerId) => {
  try {
    if (!sellerId) throw new Error("SellerId requis");
    const seller = await prisma.seller.findUnique({
      where: {
        userId: sellerId,
      },
    });
    if (!seller) {
      throw new Error("Seller n'esiste pas");
    }

    const sellerOrders = await prisma.orderItem.findMany({
      where: { product: { sellerId: seller.id } },
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
    throw new Error(
      `Erreur lors de la récupération des ventes: ${error.message}`
    );
  }
};

export const getOrderByClientId = async (clientId) => {
  try {
    if (!clientId) throw new Error("ClientId requis");
    const client = await prisma.client.findUnique({
      where: {
        userId: clientId,
      },
    });

    const clientOrders = await prisma.order.findMany({
      where: { clientId: client.id },
      include: {
        client: true,
        items: { include: { product: true } },
        address: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return clientOrders; // tableau vide si aucune commande
  } catch (error) {
    throw new Error(
      `Erreur lors de la récupération des commandes client: ${error.message}`
    );
  }
};

export const editStatusOrder = async (user, body) => {
  try {
    const { id, status } = body;
    if (!id) throw new Error("Id de commande requis");

    const seller = await prisma.seller.findUnique({
      where: { userId: user.userId },
    });
    const client = await prisma.client.findUnique({
      where: {
        userId: user.userId,
      },
    });

    if (!seller)
      throw new Error("Vous n'êtes pas autorisé à modifier cette commande");

    // Vérifier que le vendeur a un produit dans la commande
    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: { include: { product: true } } },
    });
    console.log("isSellerAuthorized", order);

    // Vérifier le rôle : vendeur ou client
    const isSellerAuthorized =
      seller &&
      order.items.some(
        (item) => item.product && item.product.sellerId === seller.id
      );

    const isClientAuthorized = client && order.clientId === client.id;
    console.log("isSellerAuthorized", isSellerAuthorized);

    if (!isSellerAuthorized) {
      throw new Error("Vous n'êtes pas autorisé à modifier cette commande");
    }

    // Mettre à jour uniquement le statut
    const orderStatus = await prisma.order.update({
      where: { id },
      data: { status },
    });

    return orderStatus;
  } catch (error) {
    throw new Error(
      `Erreur lors de la mise à jour du statut: ${error.message}`
    );
  }
};
