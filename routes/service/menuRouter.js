const express = require('express');
const MenuItem = require('../../modules/service/menu');
const authMiddleware = require('../middleware/authMiddleware'); 
const router = express.Router();


router.post('/menu',authMiddleware, async (req, res) => {
  const { name, image_url, accompaniments, price } = req.body;

  try {
    const newMenuItem = new MenuItem({
      name,
      image_url,
      accompaniments,
      price,
    });

    await newMenuItem.save();
    res.status(201).json({ message: 'Menu item created!', item: newMenuItem });
  } catch (err) {
    res.status(400).json({ error: 'Error creating menu item', details: err });
  }
});


router.get('/menu', authMiddleware, async (req, res) => {
  try {
    const items = await MenuItem.find();
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching menu items', details: err });
  }
});


router.get('/menu/:id', authMiddleware, async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    res.status(200).json(item);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching menu item', details: err });
  }
});

router.patch('/menu/:id', authMiddleware, async (req, res) => {
  const updates = req.body;

  try {
    const updatedItem = await MenuItem.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });
    if (!updatedItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    res.status(200).json({ message: 'Menu item updated', item: updatedItem });
  } catch (err) {
    res.status(400).json({ error: 'Error updating menu item', details: err });
  }
});


router.delete('/menu/:id', authMiddleware, async (req, res) => {
  try {
    const deletedItem = await MenuItem.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    res.status(200).json({ message: 'Menu item deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting menu item', details: err });
  }
});

module.exports = router;
