import { StatusCodes } from "http-status-codes";
import {
  createOrderService,
  editStatusOrder,
  getOrderByClientId,
  getOrderById,
  getOrderBySellerId,
} from "../services/order.service.js";

export const createOrderController = async (req, res) => {
  try {
    const body = req.body;
    const user = req.user;

    const order = await createOrderService(user, body);

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

    const order = await getOrderById(id);

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
    const { id } = req.query;

    const orders = await getOrderByClientId(id);

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
    const { id } = req.query;

    const orders = await getOrderBySellerId(id);

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
