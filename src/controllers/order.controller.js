import { StatusCodes } from "http-status-codes";
import {
  createOrderService,
  editStatusOrder,
  getOrderByClientId,
  getOrderById,
  getOrderBySellerId,
} from "../services/order.service.js";
import { createPaymentSession } from "../services/stripe.service.js";

export const createOrderController = async (req, res) => {
  try {
    const body = req.body;
    const user = req.user;
    console.log("bodybody", body);

    const order = await createOrderService(body,user);

    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Commande créée avec succès",
      data: order,
    });
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: error.message,
    });
  }
};

export const getOrderByIdController = async (req, res) => {
  try {
    const { id } = req.query;

    const order = await getOrderById(parseInt(id));

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Commande récupérée avec succès",
      data: order,
    });
  } catch (error) {
    return res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      message: error.message,
    });
  }
};

export const getOrderByClientIdController = async (req, res) => {
  try {
    const client = req.user.userId;
    
    const orders = await getOrderByClientId(client);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Commandes du client récupérées avec succès",
      data: orders,
    });
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: error.message,
    });
  }
};

export const getOrderBySellerIdController = async (req, res) => {
  try {
    const client = req.user.userId;

    const orders = await getOrderBySellerId(client);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Commandes du vendeur récupérées avec succès",
      data: orders,
    });
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: error.message,
    });
  }
};

export const editStatusOrderController = async (req, res) => {
  try {
    const body = req.body;
    const user = req.user;

    const updatedOrder = await editStatusOrder(user, body);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Statut de la commande mis à jour avec succès",
      data: updatedOrder,
    });
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: error.message,
    });
  }
};
export const createPaymentSessionContrller = async(req, res) => {
  const { products,panierId } = req.body;
  const checkout = await createPaymentSession({products,panierId});
  console.log("checkout",checkout);
  
  return res.status(StatusCodes.OK).json({
    success: true,
    message: "session",
    data: checkout,
  });
};

export const webhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET; // Mettez votre secret ici

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error("Erreur webhook :", err.message);
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send(`Webhook Error: ${err.message}`);
  }

  // 📌 Gérer les événements reçus
  switch (event.type) {
    case "payment_intent.succeeded":
      console.log("💰 Paiement réussi :", event.data.object.id);
      break;

    case "invoice.payment_succeeded":
      console.log("🔄 Abonnement renouvelé :", event.data.object.subscription);
      break;

    case "checkout.session.completed":
      console.log("✅ Paiement via Checkout complété :", event.data.object.id);
      break;

    default:
      console.log(`⚠️ Événement non traité : ${event.type}`);
  }

  res.json({ received: true });
};