import express from "express";
const router = express.Router();
import authMiddleware from "../middleware/all.middleware.js";
import {
  createOrderController,
  createPaymentSessionContrller,
  editStatusOrderController,
  getOrderByClientIdController,
  getOrderByIdController,
  getOrderBySellerIdController,
  webhook
  
} from "../controllers/order.controller.js";

router.post("/add", authMiddleware, createOrderController);
router.get("/orderbyclient",authMiddleware, getOrderByClientIdController);
router.get("/orderbyseller", authMiddleware, getOrderBySellerIdController);
router.get("/orderbyid", authMiddleware, getOrderByIdController);
router.patch("/edit", authMiddleware, editStatusOrderController);
router.post('/session',authMiddleware,createPaymentSessionContrller)
router.post('/payment/webhooks',webhook)

export default router;
