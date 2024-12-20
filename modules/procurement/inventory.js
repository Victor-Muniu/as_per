const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    category: {
        type: String,
        required: false
    },
    image:{
        type: String,
        required: false
    },
    unit_price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 0
    },
    
    value:{
        type: Number,
        default: 0
    },
    
});

const Inventory = mongoose.model('Inventory', inventorySchema);

module.exports = Inventory;
