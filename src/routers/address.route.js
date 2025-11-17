import express from "express"
import { createAddressController, deleteAddressController, getAddressByUserIdController, updateAddressController } from "../controllers/address.controller"

const router = express.Router()

router.post("/add",createAddressController)
router.patch("/edit/id",updateAddressController);
router.get("/",getAddressByUserIdController)
router.delete("/delete/id",deleteAddressController)

export default router