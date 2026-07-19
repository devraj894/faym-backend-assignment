import Payout from "../models/Payout.js";
import Sale from "../models/Sale.js";
import User from "../models/User.js";
import { finalPayoutService } from "./payout.service.js";

export const getSalesService = async () => {
    // Find all Sale
    const sales = await Sale.find().populate("user", "name email");

    // Return Sales
    return {
        success: true,
        message: "Sales retrieved successfully",
        sales,
    }

    // Return Sale
    return {
        success: true,
        message: "Sale retrieved successfully",
        sale,
    }
}

export const createSaleService = async (saleData) => {
    // data
    const { userId, brand, product, earning } = saleData;

    // Validate Input
    if (!userId || !brand || !product || earning == null) {
        throw new Error("All fields are required");
    }

    // Find User
    const user = await User.findById(userId);

    // Validate User
    if (!user) {
        throw new Error("User not found");
    }

    // Create Sale
    const sale = await Sale.create({
        user: userId,  
        brand: brand,
        product: product, 
        earning: earning,
    });

    // Return Response
    return {
        success: true,
        message: "Sale created successfully",
        sale,
    }
}

export const updateSaleStatusService = async (saleId, status) => {
    // Find Sale
    const sale = await Sale.findById(saleId);

    // Validate Sale Existence
    if (!sale) {
        throw new Error("Sale not found");
    }

    // Validate Sale Reconciled Status
    if (sale.reconciled) {
        throw new Error("Sale already reconciled");
    }

    // Validate Status
    if (!["approved", "rejected"].includes(status)) {
        throw new Error("Invalid sale status");
    }

    // Update Sale Status
    sale.status = status;
    await sale.save();

    // Approved Flow
    if (status === "approved") {
        return await finalPayoutService(saleId);
    }

    // Validate Advance Payout
    if (!sale.advancePaid) {
        throw new Error("Advance payout not processed.");
    }

    // Find User
    const user = await User.findById(sale.user);

    // Validate User
    if (!user) {
        throw new Error("User not found");
    }

    // Recover Advance Amount
    user.withdrawableBalance -= sale.advanceAmount;
    await user.save();

    // Create Recovery Payout
    const payout = await Payout.create({
        user: sale.user,
        sale: sale._id,
        amount: sale.advanceAmount,
        type: "RECOVERY",
        status: "SUCCESS",
    });

    // Update Sale
    sale.reconciled = true;
    sale.reconciledAt = new Date();
    await sale.save();

    // Return Response
    return {
        success: true,
        message: "Sale status updated and reconciliation completed successfully.",
        payout,
    };
};