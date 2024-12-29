const mongoose = require('mongoose');
const kotSchema = new mongoose.Schema({
    bill: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bill',
        required: true
    },
    items: [
        {
            menu_item: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'MenuItem',
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }
    ],
    created_at: {
        type: Date,
        default: Date.now
    }
});

const KOT = mongoose.model('KOT', kotSchema);
module.exports = KOT;
