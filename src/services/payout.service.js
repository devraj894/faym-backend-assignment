import Sale from "../models/Sale.js";
import User from "../models/User.js";
import Payout from "../models/Payout.js";

export const advancePayoutService = async (saleId) => {
    // Find Sale
    const sale = await Sale.findById(saleId);

    // Validate Sale Existence
    if (!sale) {
        throw new Error('Sale not found');
    }

    // Validate Sale Status
    if (sale.status !== "pending") {
        throw new Error("Advance can only be processed for pending sales.");
    }

    // Validate if advance is already paid
    if (sale.advancePaid) {
        throw new Error("Advance already paid");
    }

    // Calculate Advance
    const advanceAmount = sale.earning * 0.1;

    // Update Sale
    sale.advancePaid = true;
    sale.advanceAmount = advanceAmount;
    await sale.save();

    // find user
    const user = await User.findById(sale.user);

    // validate user
    if(!user) {
        throw new Error('User not found');
    }

    // Update User
    user.withdrawableBalance += advanceAmount;
    await user.save();

    // Create Payout
    const payout = await Payout.create({
        user: sale.user,
        sale: sale._id,
        amount: advanceAmount,
        type: 'ADVANCE',
        status: 'SUCCESS'
    });

    // Return Response
    return {
        success: true,
        message: 'Advance payout processed successfully',
        payout
    }
}

export const finalPayoutService = async (saleId) => {
    // Find Sale
    const sale = await Sale.findById(saleId);

    // Validate Sale Existence
    if (!sale) {
        throw new Error('Sale not found');
    }

    // Validate Sale Status
    if (sale.status !== "approved") {
        throw new Error("Final payout can only be processed for approved sales.");
    }

    // Validate if final payout is already processed
    if (sale.reconciled) {
        throw new Error("Final payout already processed.");
    }

    // check if advance payout is processed
    if (!sale.advancePaid) {
        throw new Error("Advance payout not processed yet.");
    }

    // Calculate Remaining Amount
    const remainingAmount = sale.earning - sale.advanceAmount;

    // Validate Remaining Amount
    if (remainingAmount < 0) {
        throw new Error("Invalid payout amount");
    }

    // Update Sale
    sale.reconciled = true;
    sale.reconciledAt = Date.now();
    await sale.save();

    // Find User
    const user = await User.findById(sale.user);

    // Validate User
    if(!user) {
        throw new Error('User not found');
    }

    // Update User
    user.withdrawableBalance += remainingAmount;
    await user.save();

    // Create FINAL Payout
    const payout = await Payout.create({
        user: sale.user,
        sale: sale._id,
        amount: remainingAmount,
        type: 'FINAL',
        status: 'SUCCESS'
    });


    // Return Response
    return {
        success: true,
        message: 'Final payout processed successfully',
        payout
    };

}

export const withdrawService = async (userId) => {
    // Find User
    const user = await User.findById(userId);

    // Validate User Existence
    if (!user) {
        throw new Error("User not found");
    }

    // Validate Withdrawable Balance
    if (user.withdrawableBalance <= 0) {
        throw new Error("No withdrawable balance available");
    }

    // 24 Hours Cooldown Check
    if (user.lastWithdrawalAt) {
        const lastWithdrawalTime = new Date(user.lastWithdrawalAt).getTime();
        const currentTime = Date.now();

        const hoursPassed = (currentTime - lastWithdrawalTime) / (1000 * 60 * 60);

        if (hoursPassed < 24) {
            throw new Error("Withdrawal is allowed only once every 24 hours.");
        }
    }

    // Create Withdrawal Payout
    const payout = await Payout.create({
        user: user._id,
        sale: null,
        amount: user.withdrawableBalance,
        type: "WITHDRAWAL",
        status: "SUCCESS",
    });

    // Update User
    user.withdrawableBalance = 0;
    user.lastWithdrawalAt = new Date();
    await user.save();

    // Return Response
    return {
        success: true,
        message: "Withdrawal processed successfully",
        payout,
    };
};

export const failedPayoutService = async (payoutId) => {
    // Find Payout
    const payout = await Payout.findById(payoutId);

    // Validate Payout Existence
    if (!payout) {
        throw new Error("Payout not found");
    }

    // Validate Payout Status
    if (payout.status !== "SUCCESS") {
        throw new Error("Only successful payouts can be marked as failed");
    }

    // Find User
    const user = await User.findById(payout.user);

    // Validate User
    if (!user) {
        throw new Error("User not found");
    }

    // Credit Balance Back
    user.withdrawableBalance += payout.amount;
    await user.save();

    // Update Payout Status
    payout.status = "FAILED";
    await payout.save();

    // Return Response
    return {
        success: true,
        message: "Payout marked as failed and amount credited back successfully",
        payout,
    };
};