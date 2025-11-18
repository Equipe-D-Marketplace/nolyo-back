import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

// Initialiser Stripe avec la clé secrète
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia',
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
      currency: 'eur', // Vous pouvez le rendre configurable
    });

    return {
      productId: stripeProduct.id,
      priceId: stripePrice.id,
      product: stripeProduct,
      price: stripePrice,
    };
  } catch (error) {
    console.error('Erreur lors de la création du produit Stripe:', error);
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

    const updatedProduct = await stripe.products.update(stripeProductId, updateFields);

    // Si le prix a changé, créer un nouveau prix
    if (updateData.price) {
      const priceInCents = Math.round(updateData.price * 100);
      await stripe.prices.create({
        product: stripeProductId,
        unit_amount: priceInCents,
        currency: 'eur',
      });
    }

    return updatedProduct;
  } catch (error) {
    console.error('Erreur lors de la mise à jour du produit Stripe:', error);
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
    console.error('Erreur lors de la suppression du produit Stripe:', error);
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
    console.error('Erreur lors de la récupération du produit Stripe:', error);
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
    console.error('Erreur lors de la récupération des prix Stripe:', error);
    throw new Error(`Erreur Stripe: ${error.message}`);
  }
};

export default stripe;
