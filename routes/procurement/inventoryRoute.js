const express = require('express');
const router = express.Router();
const Inventory = require('../../modules/procurement/inventory'); 


router.post('/inventory', async (req, res) => {
    const { name, category, image, unit_price, quantity, value } = req.body;
    try {
        const newInventoryItem = new Inventory({
            name,
            category,
            image,
            unit_price,
            quantity,
            value: value || unit_price * quantity 
        });

        await newInventoryItem.save();
        res.status(201).json({ message: 'Inventory item created successfully', newInventoryItem });
    } catch (error) {
        console.error('Error creating inventory item:', error);
        res.status(500).json({ error: 'Failed to create inventory item' });
    }
});

router.get('/inventory', async (req, res) => {
    try {
        const inventoryItems = await Inventory.find();
        res.status(200).json(inventoryItems);
    } catch (error) {
        console.error('Error fetching inventory items:', error);
        res.status(500).json({ error: 'Failed to fetch inventory items' });
    }
});


router.get('/inventory/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const inventoryItem = await Inventory.findById(id);
        if (!inventoryItem) {
            return res.status(404).json({ error: 'Inventory item not found' });
        }
        res.status(200).json(inventoryItem);
    } catch (error) {
        console.error('Error fetching inventory item:', error);
        res.status(500).json({ error: 'Failed to fetch inventory item' });
    }
});


router.patch('/inventory/:id', async (req, res) => {
    const { id } = req.params;
    const { name, category, image, unit_price, quantity, value } = req.body;

    try {
        const updatedItem = await Inventory.findByIdAndUpdate(
            id,
            { name, category, image, unit_price, quantity, value: value || unit_price * quantity },
            { new: true }
        );

        if (!updatedItem) {
            return res.status(404).json({ error: 'Inventory item not found' });
        }
        res.status(200).json({ message: 'Inventory item updated successfully', updatedItem });
    } catch (error) {
        console.error('Error updating inventory item:', error);
        res.status(500).json({ error: 'Failed to update inventory item' });
    }
});


router.delete('/inventory/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedItem = await Inventory.findByIdAndDelete(id);
        if (!deletedItem) {
            return res.status(404).json({ error: 'Inventory item not found' });
        }
        res.status(200).json({ message: 'Inventory item deleted successfully' });
    } catch (error) {
        console.error('Error deleting inventory item:', error);
        res.status(500).json({ error: 'Failed to delete inventory item' });
    }
});

module.exports = router;
