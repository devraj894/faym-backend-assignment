import { 
    advancePayoutService, 
    finalPayoutService, 
    withdrawService,
    failedPayoutService  
} from "../services/payout.service.js";

export const advancePayout = async (req, res) => {
    try {
        const { saleId } = req.body;
        const result = await advancePayoutService(saleId);
        return res.status(200).json(result);
    } catch(err) {
        console.error(err);
        return res.status(500).json({ success: false, message: err.message });
    }
}

export const finalPayout = async (req, res) => {
    try {
        const { saleId } = req.body;
        const result = await finalPayoutService(saleId);
        return res.status(200).json(result);
    } catch(err) {
        console.error(err);
        return res.status(500).json({ success: false, message: err.message });
    }
}

export const withdrawPayout = async (req, res) => {
    try {
        const { userId } = req.body;
        const result = await withdrawService(userId);
        return res.status(200).json(result);
    }catch(err) {
        console.error(err);
        return res.status(500).json({ success: false, message: err.message });
    }
}

export const failedPayout = async (req, res) => {
    try {
        const { payoutId  } = req.body;
        const result = await failedPayoutService(payoutId);
        return res.status(200).json(result);
    } catch(err) {
        console.error(err);
        return res.status(500).json({ success: false, message: err.message });
    }
}