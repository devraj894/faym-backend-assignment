import { updateSaleStatus, createSale, getSales } from "../controllers/sale.controller.js";
import { Router } from "express";

const router = Router();

router.route("/").post(createSale).get(getSales);
router.route("/update-status").patch(updateSaleStatus);

export default router;
