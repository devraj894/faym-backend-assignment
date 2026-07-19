import { createSaleService, getSalesService, updateSaleStatusService } from "../services/sale.service.js";

export const createSale = async (req, res) => {
    try {
        const saleData = req.body;
        const result = await createSaleService(saleData);
        return res.status(201).json(result);
    } catch(err) {
        console.error(err);
        return res.status(500).json({ success: false, message: err.message });
    }
}

export const getSales = async (req, res) => {
    try {
        const result = await getSalesService(); 
        return res.status(200).json(result);
    } catch(err) {
        console.error(err);
        return res.status(500).json({ success: false, message: err.message });
    }
}

export const updateSaleStatus = async (req, res) => {
    try {
        const { saleId, status } = req.body;
        const result = await updateSaleStatusService(saleId, status);
        return res.status(200).json(result);
    } catch(err) {
        console.error(err);
        return res.status(500).json({ success: false, message: err.message });
    }
}