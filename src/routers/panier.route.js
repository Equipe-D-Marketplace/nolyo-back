import { fetchPanierByUserId,createNewPanier,updatePanier,deletedPanier,clearePanier } from "../controllers/panier.controller.js";

import express from "express";
import authMiddleware from "../middleware/all.middleware.js";
const router = express.Router();

router.get("/cart",authMiddleware,fetchPanierByUserId)
router.post("/cart/add",authMiddleware,createNewPanier)
router.patch("/cart/update",authMiddleware,updatePanier)
router.delete("/cart/delete",authMiddleware,deletedPanier)
router.delete("/cart/clear",authMiddleware,clearePanier)



export default router;