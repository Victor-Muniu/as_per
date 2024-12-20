const mongoose = require('mongoose');

const LPOSchema = new mongoose.Schema({
    lpo_number: {
        type: String,
        required: true,
        unique: true
    },
    date: {
        type: Date,
        default: Date.now,
        required: true
    },
    supplier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Supplier',
        required: true
    },
    inventory_items: [
        {
            inventory: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Inventory',
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
            unit_price: {
                type: Number,
                required: true
            },
            total_price: {
                type: Number,
                required: true
            }
        }
    ],
    total_order_price: {
        type: Number,
        required: true
    },
    prepared_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Staff',
        required: true
    }
});
const LPO = mongoose.model('LPO',LPOSchema);
module.exports = LPO
