import { 
    advancePayout, 
    finalPayout, 
    withdrawPayout,
    failedPayout 
} from "../controllers/payout.controller.js";
import { Router } from "express";

const router = Router();

router.route("/advance").post(advancePayout);
router.route("/final").post(finalPayout);
router.route("/withdraw").post(withdrawPayout);
router.route("/failed").post(failedPayout);

export default router;