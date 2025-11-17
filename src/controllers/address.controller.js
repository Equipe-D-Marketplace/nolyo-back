import {
  createAddressService,
  deleteAddressService,
  getAddressByUserIdService,
  updateAddressService,
} from "../services/address.service";
import { StatusCodes } from "http-status-codes";

// Create address
export const createAddressController = async (req, res) => {
  try {
    const user = req.user;
    const address = await createAddressService(user, req.body);

    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Adresse créée avec succès",
      data: address,
    });
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "Erreur lors de la création de l'adresse",
      error: error.message,
    });
  }
};

// Update address
export const updateAddressController = async (req, res) => {
  try {
    const user = req.user;
    const address = await updateAddressService(user, req.body);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Adresse mise à jour avec succès",
      data: address,
    });
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "Erreur lors de la mise à jour de l'adresse",
      error: error.message,
    });
  }
};

// Get all addresses for a user
export const getAddressByUserIdController = async (req, res) => {
  try {
    const user = req.user;
    const addresses = await getAddressByUserIdService(user);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Adresses récupérées avec succès",
      data: addresses,
    });
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "Erreur lors de la récupération des adresses",
      error: error.message,
    });
  }
};

// Delete address
export const deleteAddressController = async (req, res) => {
  try {
    const { id } = req.query;
    const deletedAddress = await deleteAddressService(Number(id));

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Adresse supprimée avec succès",
      data: deletedAddress,
    });
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "Erreur lors de la suppression de l'adresse",
      error: error.message,
    });
  }
};

// Export module
module.exports = {
  createAddressController,
  updateAddressController,
  getAddressByUserIdController,
  deleteAddressController,
};
