const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
    purchase_number: {
        type: String,
        required: true,
        unique: true
    },
    supplier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Supplier',
        required: true
    },
    items: [
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
    total_amount: {
        type: Number,
        required: true
    },
    date_of_purchase: {
        type: Date,
        default: Date.now,
        required: true
    },
    purchased_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Staff',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'canceled'],
        default: 'completed'
    },
    invoice_no: {
        type: String,
        required: true,
        unique: true
    },
    payment_terms: {
        type: String,
        required: true
    }
});

const Purchases = mongoose.model('Purchases',purchaseSchema)
module.exports = Purchases