const mongoose = require("mongoose");
const requisitionSchema = new mongoose.Schema({
  requisition_number: {
    type: String,
    required: true,
    unique: true,
  },
  date: {
    type: Date,
    default: Date.now,
    required: true,
  },
  inventory_items: [
    {
      inventory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Inventory",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      }
    },
  ],
  department: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: `pending`
  }, 
  requested_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff',
    required: true
  },
  approved_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff',
    required: false
  }
});

const Requisition = mongoose.model('Requisition', requisitionSchema)
module.exports = Requisition
