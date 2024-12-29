const mongoose = require("mongoose");
const barMenuSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  image_url: {
    type: String,
    required: true,
  },
  accompaniments: {
    type: [String],
    default: [],
  },
  price: {
    type: Number,
    required: true,
  },
});
const BarMenu = mongoose.model('BarMenu', barMenuSchema);
module.exports = BarMenu