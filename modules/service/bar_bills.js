const mongoose = require('mongoose');

const barBillSchema = new mongoose.Schema({
    table: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Table',
        required: true
    },
    
    items: [
        {
            menu_item: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'BarMenu',
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
            total_price: {
                type: Number,
                required: true
            }
        }
    ],
    total_amount: {
        type: Number,
        required: true
    },
    served_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Staff',
        required: true
    },
    status: {
        type: String,
        enum: ['not cleared', 'cleared'],
        default: 'not cleared'
    }
}, { timestamps: true });

const BarBils = mongoose.model('BarBills', barBillSchema);
module.exports = BarBils;
