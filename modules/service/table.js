const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema({
    table_number: {
        type: Number,
        required: true,
        unique: true
    },
    status: {
        type: String,
        enum: ['vacant', 'occupied', 'reserved'],
        default: 'vacant'
    },
    seats_available: {
        type: Number,
        required: true
    },
    served_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Staff',
        required: function() {
            return this.status === 'occupied'; // Only required when the table is occupied
        }
    }
}, { timestamps: true });

const Table = mongoose.model('Table', tableSchema);
module.exports = Table;
