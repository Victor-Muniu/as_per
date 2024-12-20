const mongoose = require('mongoose');

const InvoiceSchema = new mongoose.Schema({
    invoice_number: {
        type: String,
        required: true,
        unique: true
    },
    date_received: {
        type: Date,
        default: Date.now,
        required: true
    },
    supplier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Supplier',
        required: true
    },
    lpo_number: {
        type: String,
        required: true
    },
    items_received: [
        {
            inventory: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Inventory',
                required: true
            },
            quantity_received: {
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
    received_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Staff',
        required: true
    }
});

const Invoice = mongoose.model('Invoice', InvoiceSchema)
module.exports = Invoice
