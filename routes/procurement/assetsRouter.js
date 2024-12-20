const express = require('express');
const router = express.Router();
const Asset = require('../../modules/procurement/assets'); 

router.post('/assets', async (req, res) => {
    try {
        const { name, category, quantity, spoilt, purchasePrice} = req.body;
        
        
        const newAsset = new Asset({
            name,
            category,
            quantity,
            spoilt,
            purchasePrice,
            assetValue: purchasePrice * quantity, 
            available: quantity - spoilt, 
            status: 'In Service',
        });

        await newAsset.save();
        res.status(201).json({ message: 'Asset created successfully', asset: newAsset });
    } catch (error) {
        console.error('Error creating asset:', error);
        res.status(400).json({ error: 'Failed to create asset' });
    }
});

router.get('/assets', async (req, res) => {
    try {
        const assets = await Asset.find();
        res.status(200).json(assets);
    } catch (error) {
        console.error('Error fetching assets:', error);
        res.status(500).json({ error: 'Failed to fetch assets' });
    }
});

router.get('/assets/:id', async (req, res) => {
    try {
        const asset = await Asset.findById(req.params.id);
        if (!asset) {
            return res.status(404).json({ error: 'Asset not found' });
        }
        res.status(200).json(asset);
    } catch (error) {
        console.error('Error fetching asset:', error);
        res.status(500).json({ error: 'Failed to fetch asset' });
    }
});


router.patch('/assets/:id', async (req, res) => {
    try {
        const updatedData = req.body;
        const asset = await Asset.findByIdAndUpdate(req.params.id, updatedData, { new: true });
        if (!asset) {
            return res.status(404).json({ error: 'Asset not found' });
        }
        res.status(200).json({ message: 'Asset updated successfully', asset });
    } catch (error) {
        console.error('Error updating asset:', error);
        res.status(400).json({ error: 'Failed to update asset' });
    }
});


router.delete('/assets/:id', async (req, res) => {
    try {
        const asset = await Asset.findByIdAndDelete(req.params.id);
        if (!asset) {
            return res.status(404).json({ error: 'Asset not found' });
        }
        res.status(200).json({ message: 'Asset deleted successfully' });
    } catch (error) {
        console.error('Error deleting asset:', error);
        res.status(400).json({ error: 'Failed to delete asset' });
    }
});

module.exports = router;
