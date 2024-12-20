const mongoose = require('mongoose');

const dailyCollectionSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    staffID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Staff',  
        required: true
    },
    initialFloat: {
        type: Number,
        required: true,
        default: 0
    },
    cash: {
        type: Number,
        required: true,
        default: 0
    },
    mpesa: {
        type: Number,
        required: true,
        default: 0
    },
    equity: {
        type: Number,
        required: true,
        default: 0
    },
    pesaPal: {
        type: Number,
        required: true,
        default: 0
    },
    cheque: {
        type: Number,
        required: true,
        default: 0
    },
    totalCollection: {
        type: Number,
        required: true,
        default: 0
    },
    comments: {
        type: String,
        required: false
    }
});


dailyCollectionSchema.pre('save', function (next) {
    this.totalCollection = this.initialFloat + this.cash + this.mpesa + this.equity + this.pesaPal + this.cheque;
    next();
});

const DailyCollection = mongoose.model('DailyCollection', dailyCollectionSchema);

module.exports = DailyCollection;
