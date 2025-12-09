import { fetchPanierByUserId,createNewPanier,updatePanier,deletedPanier,clearePanier } from "../controllers/panier.controller.js";

import express from "express";
import authMiddleware from "../middleware/all.middleware.js";
const router = express.Router();

router.get("/",authMiddleware,fetchPanierByUserId)
router.post("/add",authMiddleware,createNewPanier)
router.patch("/update",authMiddleware,updatePanier)
router.delete("/delete",authMiddleware,deletedPanier)
router.delete("/clear",authMiddleware,clearePanier)



export default router;