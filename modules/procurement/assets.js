const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    category: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    quantity: {
        type: Number,
        required: true,
        default: 0
    },
    spoilt: {
        type: Number,
        required: true,
        default: 0
    },
    available: {
        type: Number,
        required: true,
        default: function() {
            return this.quantity - this.spoilt;
        }
    },
    purchasePrice: {
        type: Number,
        required: true
    },
    assetValue: {
        type: Number,
        default: function() {
            return this.purchasePrice * this.quantity;
        }
    },
    
    status: {
        type: String,
        enum: ['In Service', 'Out Of Service', 'Spoilt'],
        default: 'In Service'
    }
    
});

const Asset = mongoose.model('Asset', assetSchema);

module.exports = Asset;
