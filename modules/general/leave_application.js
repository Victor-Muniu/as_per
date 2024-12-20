const mongoose = require('mongoose');

const leaveApplicationSchema = new mongoose.Schema({
    staffID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Staff',
        required: true
    },
    leaveType: {
        type: String,
        enum: ['Annual Leave', 'Sick Leave', 'Holiday Off', 'Maternity Leave', 'Paternity Leave', 'Weekly Off'], // Add any other valid types here
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
    }
});

const LeaveApplication = mongoose.model('LeaveApplication', leaveApplicationSchema);

module.exports = LeaveApplication;
