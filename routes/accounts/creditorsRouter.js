const express = require('express');
const Creditors = require('../../modules/accounts/creditors');
const Supplier = require('../../modules/accounts/supplier');
const Invoice = require('../../modules/procurement/invoice');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/creditors', authMiddleware, async (req, res) => {
    try {
        const creditors = await Creditors.find()
            .populate('supplier', 'name email')
            .populate('invoice', 'invoice_number total_amount date_received')
            .exec();

        res.status(200).json(creditors);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});


router.get('/creditors/:id', authMiddleware, async (req, res) => {
    try {
        const creditor = await Creditors.findById(req.params.id)
            .populate('supplier', 'name email')
            .populate('invoice', 'invoice_number total_amount date_received')
            .exec();

        if (!creditor) return res.status(404).json({ message: 'Creditor not found' });

        res.status(200).json(creditor);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

router.delete('/creditors/:id', authMiddleware, async (req, res) => {
    try {
        const creditor = await Creditors.findByIdAndDelete(req.params.id);
        if (!creditor) return res.status(404).json({ message: 'Creditor not found' });

        res.status(200).json({ message: 'Creditor deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router