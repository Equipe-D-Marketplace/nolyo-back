import {
  getPanierByUserId,
  createPanier,
  updatePanierItems,
  deletePanier,
  clearPanier,  
} from "../services/panier.service.js";
import { StatusCodes } from "http-status-codes";

export const fetchPanierByUserId = async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log("userId", userId);

    const panier = await getPanierByUserId(userId);
    if (!panier) {
      res.status(StatusCodes.NOT_FOUND).json({
        message: "Panier not found for the user",
        data: panier,
      });
    }
    res.status(StatusCodes.OK).json({
      message: "Panier retrieved successfully",
      data: panier,
    });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
  }
};

export const createNewPanier = async (req, res) => {
  try {
    const userId = req.user.userId;
    const items = req.body.items || [];
    const newPanier = await createPanier(userId, items);
    res.status(StatusCodes.CREATED).json({
      message: "Panier created successfully",
      data: newPanier,
    });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
  }
};

export const updatePanier = async (req, res) => {
  const cartItemId = req.body.cartItemId;
  const newQuantity = req.body.newQuantity;

  try {
    const updatedPanierres = await updatePanierItems(cartItemId, newQuantity);
    if (!updatedPanierres) {
      res.status(StatusCodes.NOT_FOUND).json({
        message: "Panier not found",
      });
    }
    res.status(StatusCodes.OK).json({
      message: "Panier updated successfully",
      data: updatedPanierres,
    });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
  }
};

export const deletedPanier = async (req, res) => {
  const panierId = req.body.panierId;
  try {
    const deletedPanierres = await deletePanier(panierId);
    if (!deletedPanierres) {
      res.status(StatusCodes.NOT_FOUND).json({
        message: "Panier not found",
      });
    }
    res.status(StatusCodes.OK).json({
      message: "Panier deleted successfully",
      data: deletedPanierres,
    });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
  }
};

export const clearePanier = async (req, res) => {
  const panierId = req.body.panierId;
  try {
    const clearedPanierres = await clearPanier(panierId);
    if (!clearedPanierres) {
      res.status(StatusCodes.NOT_FOUND).json({
        message: "Panier not found",
      });
    }
    res.status(StatusCodes.OK).json({
      message: "Panier cleared successfully",
      data: clearedPanierres,
    });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
  }
};
