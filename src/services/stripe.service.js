import Stripe from "stripe";
import dotenv from "dotenv";
import { StatusCodes } from "http-status-codes";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
dotenv.config();

// Initialiser Stripe avec la clé secrète
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-12-18.acacia",
});

/**
 * Créer un produit dans Stripe
 * @param {Object} productData - Données du produit
 * @param {string} productData.name - Nom du produit
 * @param {string} productData.description - Description du produit
 * @param {number} productData.price - Prix du produit (en centimes)
 * @param {string} productData.imageUrl - URL de l'image du produit
 * @param {number} productData.dbProductId - ID du produit dans notre base de données
 * @returns {Promise<Object>} Produit Stripe créé
 */
export const createStripeProduct = async (productData) => {
  try {
    // Créer le produit dans Stripe
    const stripeProduct = await stripe.products.create({
      name: productData.name,
      description: productData.description || undefined,
      images: productData.imageUrl ? [productData.imageUrl] : undefined,
      metadata: {
        dbProductId: productData.dbProductId.toString(),
        categoryId: productData.categoryId?.toString(),
        sellerId: productData.sellerId?.toString(),
      },
    });

    // Créer le prix associé au produit
    // Stripe utilise des centimes, donc on multiplie par 100
    const priceInCents = Math.round(productData.price * 100);

    const stripePrice = await stripe.prices.create({
      product: stripeProduct.id,
      unit_amount: priceInCents,
      currency: "eur", // Vous pouvez le rendre configurable
    });

    return {
      productId: stripeProduct.id,
      priceId: stripePrice.id,
      product: stripeProduct,
      price: stripePrice,
    };
  } catch (error) {
    console.error("Erreur lors de la création du produit Stripe:", error);
    throw new Error(`Erreur Stripe: ${error.message}`);
  }
};

/**
 * Mettre à jour un produit dans Stripe
 * @param {string} stripeProductId - ID du produit Stripe
 * @param {Object} updateData - Données à mettre à jour
 * @returns {Promise<Object>} Produit Stripe mis à jour
 */
export const updateStripeProduct = async (stripeProductId, updateData) => {
  try {
    const updateFields = {};
    if (updateData.name) updateFields.name = updateData.name;
    if (updateData.description !== undefined) {
      updateFields.description = updateData.description || null;
    }
    if (updateData.imageUrl) {
      updateFields.images = [updateData.imageUrl];
    }

    const updatedProduct = await stripe.products.update(
      stripeProductId,
      updateFields
    );

    // Si le prix a changé, créer un nouveau prix
    if (updateData.price) {
      const priceInCents = Math.round(updateData.price * 100);
      await stripe.prices.create({
        product: stripeProductId,
        unit_amount: priceInCents,
        currency: "eur",
      });
    }

    return updatedProduct;
  } catch (error) {
    console.error("Erreur lors de la mise à jour du produit Stripe:", error);
    throw new Error(`Erreur Stripe: ${error.message}`);
  }
};

/**
 * Supprimer un produit dans Stripe
 * @param {string} stripeProductId - ID du produit Stripe
 * @returns {Promise<Object>} Produit Stripe supprimé
 */
export const deleteStripeProduct = async (stripeProductId) => {
  try {
    // Stripe archive les produits au lieu de les supprimer
    const deletedProduct = await stripe.products.update(stripeProductId, {
      active: false,
    });
    return deletedProduct;
  } catch (error) {
    console.error("Erreur lors de la suppression du produit Stripe:", error);
    throw new Error(`Erreur Stripe: ${error.message}`);
  }
};

/**
 * Récupérer un produit Stripe par son ID
 * @param {string} stripeProductId - ID du produit Stripe
 * @returns {Promise<Object>} Produit Stripe
 */
export const getStripeProduct = async (stripeProductId) => {
  try {
    const product = await stripe.products.retrieve(stripeProductId);
    return product;
  } catch (error) {
    console.error("Erreur lors de la récupération du produit Stripe:", error);
    throw new Error(`Erreur Stripe: ${error.message}`);
  }
};

/**
 * Récupérer tous les prix d'un produit Stripe
 * @param {string} stripeProductId - ID du produit Stripe
 * @returns {Promise<Array>} Liste des prix
 */
export const getStripeProductPrices = async (stripeProductId) => {
  try {
    const prices = await stripe.prices.list({
      product: stripeProductId,
    });
    return prices.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des prix Stripe:", error);
    throw new Error(`Erreur Stripe: ${error.message}`);
  }
};
// export const createPaymentSession = async ({ products }) => {
//   try {
//     if (!products || products.length === 0) {
//       throw new Error("Veuillez fournir au moins un produit");
//     }
// let products = await prisma.product.findUnique({
//     where: { id.products },
//     include: {
//       category: true,
//       seller: {
//         include: {
//           user: true
//         }
//       }
//     }
//   });
//     const lineItems = products.map((p) => ({
//       price_data: {
//         currency: "eur",
//         product_data: {
//           name: p.name, // nom du produit
//         },
//         unit_amount: Math.round(p.unitPrice * 100), // montant en centimes
//       },
//       quantity: p.quantity,
//     }));

//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       mode: "payment",
//       line_items: lineItems,
//       metadata: {
//         products: JSON.stringify(
//           products.map((p) => ({
//             productId: p.productId,
//             quantity: p.quantity,
//             unitPrice: p.unitPrice,
//           }))
//         ),
//       },
//       success_url: `${process.env.FRONTEND_URL}/paiement?status=success&session_id={CHECKOUT_SESSION_ID}`,
//       cancel_url: `${process.env.FRONTEND_URL}/paiement?status=cancel`,
//     });

//     return session.url;
//   } catch (error) {
//     throw new Error(
//       `Erreur lors de la création de la session de paiement: ${error.message}`
//     );
//   }
// };

export const createPaymentSession = async ({ products }) => {
  try {
    if (!products || products.length === 0) {
      const error = new Error("Veuillez fournir au moins un produit");
      error.statusCode = StatusCodes.BAD_REQUEST;
      throw error;
    }

    // products envoyé par le front = [{ productId, quantity }]
    const productIds = products.map((p) => p.productId);

    // ✅ Récupération des infos en base
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds } },
      include: {
        category: true,
        seller: { include: { user: true } },
      },
    });

    // ✅ Vérification que tous les produits existent
    if (dbProducts.length !== productIds.length) {
      const missingIds = productIds.filter(
        (id) => !dbProducts.some((p) => p.id === id)
      );
      throw new Error(
        `Certains produits n'existent pas en base: ${missingIds.join(", ")}`
      );
    }

    // ✅ Construction des line_items et metadata
    const lineItems = [];
    const metadataProducts = [];

    for (const dbProduct of dbProducts) {
      const frontProduct = products.find((p) => p.productId === dbProduct.id);

      lineItems.push({
        price_data: {
          currency: "eur",
          product_data: {
            name: dbProduct.name,
          },
          unit_amount: Math.round(dbProduct.price * 100), // prix en centimes
        },
        quantity: frontProduct.quantity,
      });

      metadataProducts.push({
        productId: dbProduct.id,
        quantity: frontProduct.quantity,
        unitPrice: dbProduct.price,
      });
    }

    // ✅ Création de la session Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems,
      metadata: {
        products: JSON.stringify(metadataProducts),
      },
      success_url: `${process.env.FRONTEND_URL}/paiement?status=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/paiement?status=cancel`,
    });

    return session.url;
  } catch (error) {
    throw new Error(
      `Erreur lors de la création de la session de paiement: ${error.message}`
    );
  }
};

export const checkoutSuccess = async (session_id) => {
  const sessionId = session_id;
  console.log("sessionIdsessionId", session_id);

  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["line_items", "payment_intent"],
  });
  return session;
};

export default stripe;
