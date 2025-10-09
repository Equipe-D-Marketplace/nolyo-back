import {
  registerUser,
  loginUser,
  getAllUser,
  getUserId,
  editUser,
  deleteUser,
} from "../services/auth.service.js";
import { StatusCodes } from "http-status-codes";

export const registeruser = async (req, res) => {
  try {
    console.log("req.body", req.body);
    const registerRespons = await registerUser(req.body);
    console.log("registerRespons", registerRespons);

    res.status(StatusCodes.CREATED).json({
      message: "User registered successfully",
      data: registerRespons,
    });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
  }
};

export const loginuser = async (req, res) => {
  try {
    const userRespons = await loginUser(req.body);
    res.status(StatusCodes.OK).json({
      message: "User login successfully",
      data: userRespons,
    });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
  }
};

export const getalluser = async (req, res) => {
  try {
    const allUser = await getAllUser();

    res.status(StatusCodes.OK).json({
      message: "Users retrieved successfully",
      data: allUser,
    });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ 
      message: "Failed to retrieve users",
      error: error.message 
    });
  }
};


export const getuserbyid = async (req, res) => {
  try {
    const userById = await getUserId(req.query);
    res.status(StatusCodes.OK).json({
      message: "User retrieved successfully",
      data: userById,
    });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
  }
};

export const edituser = async (req, res) => {
  try {
    const userEdit = await editUser(req.body);
    res.status(StatusCodes.OK).json({
      message: "User updated successfully",
      data: userEdit,
    });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
  }
};

export const deleteuser = async (req, res) => {
  try {
    const userDeleted = await deleteUser(req.query);

    res.status(StatusCodes.OK).json({
      message: "User deleted successfully",
      data: userDeleted,
    });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({
      message: "Failed to delete user",
      error: error.message,
    });
  }
};

