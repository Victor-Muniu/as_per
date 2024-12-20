const express = require('express');
const LPO = require('../../modules/procurement/lpo');
const Inventory = require('../../modules/procurement/inventory');
const Supplier = require('../../modules/accounts/supplier');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();
router.post('/lpo', authMiddleware, async (req, res) => {
    try {
        const { lpo_number, supplier_name, inventory_items } = req.body;
        const supplier = await Supplier.findOne({ name: supplier_name });
        if (!supplier) return res.status(404).json({ message: 'Supplier not found' });

        let total_order_price = 0;
        const items = [];

        for (const item of inventory_items) {
            const inventory = await Inventory.findOne({ name: item.inventory_name });
            if (!inventory) return res.status(404).json({ message: `Inventory item ${item.inventory_name} not found` });

            const total_price = item.quantity * inventory.unit_price;
            total_order_price += total_price;

            items.push({
                inventory: inventory._id,
                quantity: item.quantity,
                unit_price: inventory.unit_price,
                total_price
            });
        }

        const newLPO = new LPO({
            lpo_number,
            supplier: supplier._id,
            inventory_items: items,
            total_order_price,
            prepared_by: req.user._id 
        });

        await newLPO.save();
        res.status(201).json({ message: 'LPO created successfully', lpo: newLPO });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/lpo', authMiddleware, async (req, res) => {
    try {
        const lpos = await LPO.find()
            .populate('supplier', 'name email tel_no KRA_pin VAT_No')
            .populate('inventory_items.inventory', 'name')
            .populate('prepared_by', 'fname lname emp_no role');
        res.status(200).json(lpos);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/lpo/:id', authMiddleware, async (req, res) => {
    try {
        const lpo = await LPO.findById(req.params.id)
            .populate('supplier', 'name email')
            .populate('inventory_items.inventory', 'item_name description')
            .populate('prepared_by', 'fname lname emp_no');

        if (!lpo) return res.status(404).json({ message: 'LPO not found' });
        res.status(200).json(lpo);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

router.patch('/lpo/:id', authMiddleware, async (req, res) => {
    try {
        const { inventory_items } = req.body;

        const lpo = await LPO.findById(req.params.id);
        if (!lpo) return res.status(404).json({ message: 'LPO not found' });

        let total_order_price = 0;
        const updatedItems = [];

        for (const item of inventory_items) {
            const inventory = await Inventory.findOne({ item_name: item.inventory_name });
            if (!inventory) return res.status(404).json({ message: `Inventory item ${item.inventory_name} not found` });

            const total_price = item.quantity * inventory.unit_price;
            total_order_price += total_price;

            updatedItems.push({
                inventory: inventory._id,
                quantity: item.quantity,
                unit_price: inventory.unit_price,
                total_price
            });
        }

        lpo.inventory_items = updatedItems;
        lpo.total_order_price = total_order_price;

        await lpo.save();
        res.status(200).json({ message: 'LPO updated successfully', lpo });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

router.delete('/lpo/:id', authMiddleware, async (req, res) => {
    try {
        const lpo = await LPO.findByIdAndDelete(req.params.id);
        if (!lpo) return res.status(404).json({ message: 'LPO not found' });

        res.status(200).json({ message: 'LPO deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
