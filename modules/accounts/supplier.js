const mongoose = require('mongoose')
const supplierSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    tel_no: {
        type: String,
        required: true,
        unique: true
    },
    credit_limit: {
        type: Number,
        required: false
    },
    contact_person: {
        type: String,
        required: false
    },
    KRA_pin: {
        type: String,
        required: false
    },
    VAT_No: {
        type: String,
        required: false
    }
})
const Supplier = mongoose.model('Supplier', supplierSchema)
module.exports = Supplier