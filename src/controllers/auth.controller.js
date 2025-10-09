import { registerUser, loginUser } from "../services/auth.service.js";
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
    res.status(StatusCodes.CREATED).json({
      message: "User login successfully",
      data: userRespons,
    });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
  }
};
