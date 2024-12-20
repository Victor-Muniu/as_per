const express = require('express');
const Supplier = require('../../modules/accounts/supplier'); 
const router = express.Router();
router.post('/supplier', async (req, res) => {
    try {
        const { name, email, tel_no, credit_limit, contact_person, KRA_pin, VAT_No } = req.body;

        const supplier = new Supplier({
            name,
            email,
            tel_no,
            credit_limit,
            contact_person,
            KRA_pin,
            VAT_No
        });

        await supplier.save();
        res.status(201).json({ message: 'Supplier created successfully', supplier });
    } catch (error) {
        console.error(error.message);
        res.status(400).json({ error: error.message });
    }
});


router.get('/supplier', async (req, res) => {
    try {
        const suppliers = await Supplier.find();
        res.status(200).json(suppliers);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
});


router.get('/supplier/:id', async (req, res) => {
    try {
        const supplier = await Supplier.findById(req.params.id);

        if (!supplier) {
            return res.status(404).json({ message: 'Supplier not found' });
        }

        res.status(200).json(supplier);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

router.patch('/supplier/:id', async (req, res) => {
    try {
        const updatedSupplier = await Supplier.findByIdAndUpdate(
            req.params.id,
            { $set: req.body }, 
            { new: true, runValidators: true } 
        );

        if (!updatedSupplier) {
            return res.status(404).json({ message: 'Supplier not found' });
        }

        res.status(200).json({ message: 'Supplier updated successfully', updatedSupplier });
    } catch (error) {
        console.error(error.message);
        res.status(400).json({ error: error.message });
    }
});


router.delete('/supplier/:id', async (req, res) => {
    try {
        const supplier = await Supplier.findByIdAndDelete(req.params.id);

        if (!supplier) {
            return res.status(404).json({ message: 'Supplier not found' });
        }

        res.status(200).json({ message: 'Supplier deleted successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
