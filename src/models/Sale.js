import mongoose from 'mongoose';

const saleSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        
        brand: {
            type: String,
            required: true
        },

        product: {
            type: String,
            required: true
        },

        earning: {
            type: Number,
            min: 0,
            required: true
        },

        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending',
            required: true
        },

        advancePaid: {
            type: Boolean,
            default: false
        },

        advanceAmount: {
            type: Number,
            min: 0,
            default: 0
        },

        reconciled: {
            type: Boolean,
            default: false
        },

        reconciledAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model('Sale', saleSchema);