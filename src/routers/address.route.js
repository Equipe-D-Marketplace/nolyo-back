import express from "express";
import {
  createAddressController,
  deleteAddressController,
  getAddressByUserIdController,
  updateAddressController,
} from "../controllers/address.controller.js";
import authMiddleware from "../middleware/all.middleware.js";

const router = express.Router();

router.post("/add", authMiddleware, createAddressController);
router.patch("/edit", authMiddleware, updateAddressController);
router.get("/", authMiddleware, getAddressByUserIdController);
router.delete("/delete", authMiddleware, deleteAddressController);

export default router;
