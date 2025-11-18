import express from "express";
const router = express.Router();
import authMiddleware from "../middleware/all.middleware.js";
import {
  createOrderController,
  editStatusOrderController,
  getOrderByClientIdController,
  getOrderByIdController,
} from "../controllers/order.controller.js";
import { getOrderBySellerId } from "../services/order.service.js";

router.post("/add", authMiddleware, createOrderController);
router.get("/orderbyclient",authMiddleware, getOrderByClientIdController);
router.get("/orderbyseller", authMiddleware, getOrderBySellerId);
router.get("/orderbyid", authMiddleware, getOrderByIdController);
router.patch("/edit", authMiddleware, editStatusOrderController);
// router.delete('/profile/delete',authMiddleware,deleteuser)

export default router;
