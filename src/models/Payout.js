import mongoose from 'mongoose';

const payoutSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },

        sale: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Sale',
            default: null
        },

        amount: {
            type: Number,
            min: 0,
            required: true
        },

        type: {
            type: String,
            enum: [
                "ADVANCE",
                "FINAL",
                "RECOVERY",
                "WITHDRAWAL"
            ],
            required: true
        },

        status: {
            type: String,
            enum: [
                "SUCCESS",
                "FAILED",
                "CANCELLED",
                "REJECTED"
            ],
            default: "SUCCESS"
        }
    },
    {
        timestamps: true
    }
)

export default mongoose.model('Payout', payoutSchema);