const express = require('express');
const Purchase = require('../../modules/accounts/purchase');
const Inventory = require('../../modules/procurement/inventory');
const Supplier = require('../../modules/accounts/supplier');
const Invoice = require('../../modules/procurement/invoice');
const authMiddleware = require('../middleware/authMiddleware');


const router = express.Router();


router.get('/purchases', authMiddleware, async (req, res) => {
    try {
        const purchases = await Purchase.find()
            .populate('supplier', 'name email')
            .populate('items.inventory', 'name unit_price')
            .populate('purchased_by', 'fname lname emp_no');
        res.status(200).json(purchases);
    } catch (err) {
        console.error('Error fetching purchases:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
});


router.get('/purchases/:id', authMiddleware, async (req, res) => {
    try {
        const purchase = await Purchase.findById(req.params.id)
            .populate('supplier', 'name email')
            .populate('items.inventory', 'name unit_price')
            .populate('purchased_by', 'fname lname emp_no');
        if (!purchase) return res.status(404).json({ message: 'Purchase not found' });

        res.status(200).json(purchase);
    } catch (err) {
        console.error('Error fetching purchase by ID:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;