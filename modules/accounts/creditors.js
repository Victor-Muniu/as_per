const mongoose = require('mongoose');

const CreditorsSchema = new mongoose.Schema({
    invoice: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Invoice',
        required: true
    },
    supplier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Supplier',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    total_amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        default: 'unpaid',
        enum: ['unpaid', 'paid']
    }
});

const Creditors = mongoose.model('Creditors', CreditorsSchema)
module.exports = Creditors