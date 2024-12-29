const express = require("express");
const KOT = require("../../modules/service/KOT");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.get('/kots', authMiddleware, async (req, res) => {
    try {
        // Fetch all KOTs from the database
        const kots = await KOT.find()
            .populate('bill', 'table total_amount status') // Populate bill details
            .populate('items.menu_item', 'name price'); // Populate menu item details

        if (kots.length === 0) {
            return res.status(404).json({ message: 'No KOTs found' });
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

        // Fetch KOTs associated with the given bill ID
        const kots = await KOT.find({ bill: bill_id })
            .populate('bill', 'table total_amount status')
            .populate('items.menu_item', 'name price');

        if (kots.length === 0) {
            return res.status(404).json({ message: 'No KOTs found for the provided bill ID' });
        }

        res.status(200).json(kots);
    } catch (err) {
        console.error('Error fetching KOTs:', err.message);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});


// DELETE a KOT by ID
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
