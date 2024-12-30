const express = require("express");
const KOT = require("../../modules/service/KOT");
const Staff = require("../../modules/general/staff")
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.get('/kots', authMiddleware, async (req, res) => {
    try {
        const kots = await KOT.find()
            .populate({
                path: 'bill',
                select: 'table total_amount status served_by',
                populate: {
                    path: 'table',
                    select: 'table_number'
                }
            })
            .populate('items.menu_item', 'name price');

        if (kots.length === 0) {
            return res.status(404).json({ message: 'No KOTs found' });
        }

        // Manually populate 'served_by' by querying the Staff model
        for (const kot of kots) {
            if (kot.bill && kot.bill.served_by) {
                // Get the staff details manually
                const staff = await Staff.findById(kot.bill.served_by).select('fname lname emp_no');
                
                // Attach staff details to the result
                kot.bill.served_by = staff ? staff : null;
            }
        }

        res.status(200).json(kots);
    } catch (err) {
        console.error('Error fetching KOTs:', err.message);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});



router.get('/kot/:bill_id', authMiddleware, async (req, res) => {
    try {
        const { bill_id } = req.params;

        // Find KOTs for the provided bill_id
        const kots = await KOT.find({ bill: bill_id })
            .populate({
                path: 'bill',
                select: 'table total_amount status served_by',
                populate: {
                    path: 'table',
                    select: 'table_number'
                }
            })
            .populate('items.menu_item', 'name price');

        if (kots.length === 0) {
            return res.status(404).json({ message: 'No KOTs found for the provided bill ID' });
        }

        // Manually populate 'served_by' for each KOT
        for (const kot of kots) {
            if (kot.bill && kot.bill.served_by) {
                // Get the staff details manually
                const staff = await Staff.findById(kot.bill.served_by).select('fname lname emp_no');
                
                // Attach staff details to the 'served_by' field
                kot.bill.served_by = staff ? staff : null;
            }
        }

        // Return the populated KOTs
        res.status(200).json(kots);
    } catch (err) {
        console.error('Error fetching KOTs:', err.message);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});


router.delete("/kot/:id", async (req, res) => {
    try {
        const deletedKOT = await KOT.findByIdAndDelete(req.params.id);
        if (!deletedKOT) {
            return res.status(404).json({ message: "KOT not found" });
        }
        res.status(200).json({ message: "KOT deleted" });
    } catch (err) {
        res.status(500).json({ error: "Error deleting KOT", details: err });
    }
});

module.exports = router;
