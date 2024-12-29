const mongoose = require('mongoose');


const menuItemSchema = new mongoose.Schema({
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


const MenuItem = mongoose.model('MenuItem', menuItemSchema);

module.exports = MenuItem;
