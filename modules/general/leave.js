const mongoose = require('mongoose');

const staffOffSchema = new mongoose.Schema({
    staffID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Staff', 
        required: true
    },
    weeklyOff: {
        type: Number, 
        default: 0, 
        required: true
    },
    annualLeave: {
        type: Number,
        default: 0, 
        required: true
    },
    holidayOff: [{
        type: Number, 
        default:0,
        required: true
    }],
    maternityLeave: {
        type: Number, 
        default: 0, 
        required: true
    },
    paternityLeave: {
        type: Number, 
        default: 0, 
        required: true
    },
    sickLeave: {
        type: Number,
        default: 0,
        required: true
    },
    pending_request: {
        type: String,
        required: true
    }
});
const StaffOff = mongoose.model('StaffOff', staffOffSchema);

module.exports = StaffOff;
