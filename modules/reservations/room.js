const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    roomNumber: {
        type: String,
        required: true,
        unique: true,
    },
    type: {
        type: String,
        required: true,
        enum: ['Single', 'Double', 'Suite', 'Deluxe', 'Family'], 
    },
    status: {
        type: String,
        required: true,
        enum: ['Vacant', 'Occupied', 'Reserved', 'Damaged'], 
        default: 'Vacant',
    },
    pricePerNight: {
        type: Number,
        required: true, 
    },
    floor: {
        type: Number,
        required: false, 
    },
    lastCleaned: {
        type: Date,
        default: Date.now 
    },
    days_Occupied: {
        type: Number, 
        required: true
    }
});

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
