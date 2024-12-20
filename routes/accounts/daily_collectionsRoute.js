const express = require('express');
const DailyCollection = require('../../modules/accounts/daily_collections');
const Staff = require('../../modules/general/staff'); 
const router = express.Router();


router.post('/daily-collections', async (req, res) => {
    const { emp_no, initialFloat, cash, mpesa, equity, pesaPal, cheque,  comments } = req.body;

    try {
       
        const staff = await Staff.findOne({ emp_no });
        if (!staff) {
            return res.status(404).json({ error: 'Staff member not found' });
        }

        
        const newCollection = new DailyCollection({
            staffID: staff._id,
            initialFloat,
            cash,
            mpesa,
            equity,
            pesaPal,
            cheque,
            comments,
        });

        await newCollection.save();
        res.status(201).json(newCollection);
    } catch (error) {
        console.error('Error creating daily collection:', error);
        res.status(500).json({ error: 'Failed to create daily collection' });
    }
});


router.get('/daily-collections', async (req, res) => {
    try {
        const collections = await DailyCollection.find().populate('staffID', 'fname lname emp_no');
        res.json(collections);
    } catch (error) {
        console.error('Error fetching daily collections:', error);
        res.status(500).json({ error: 'Failed to fetch daily collections' });
    }
});


router.get('/daily-collections/:id', async (req, res) => {
    try {
        const collection = await DailyCollection.findById(req.params.id).populate('staffID', 'fname lname emp_no');
        if (!collection) {
            return res.status(404).json({ error: 'Daily collection not found' });
        }
        res.json(collection);
    } catch (error) {
        console.error('Error fetching daily collection:', error);
        res.status(500).json({ error: 'Failed to fetch daily collection' });
    }
});


router.put('/daily-collections/:id', async (req, res) => {
    const { emp_no, initialFloat, cash, mpesa, equity, pesaPal, cheque, other, comments } = req.body;

    try {
        
        const staff = await Staff.findOne({ emp_no });
        if (!staff) {
            return res.status(404).json({ error: 'Staff member not found' });
        }

        const updatedCollection = await DailyCollection.findByIdAndUpdate(
            req.params.id,
            {
                staffID: staff._id,
                initialFloat,
                cash,
                mpesa,
                equity,
                pesaPal,
                cheque,
                other,
                comments,
            },
            { new: true }
        );

        if (!updatedCollection) {
            return res.status(404).json({ error: 'Daily collection not found' });
        }

        res.json(updatedCollection);
    } catch (error) {
        console.error('Error updating daily collection:', error);
        res.status(500).json({ error: 'Failed to update daily collection' });
    }
});


router.delete('/daily-collections/:id', async (req, res) => {
    try {
        const deletedCollection = await DailyCollection.findByIdAndDelete(req.params.id);
        if (!deletedCollection) {
            return res.status(404).json({ error: 'Daily collection not found' });
        }
        res.json({ message: 'Daily collection deleted successfully' });
    } catch (error) {
        console.error('Error deleting daily collection:', error);
        res.status(500).json({ error: 'Failed to delete daily collection' });
    }
});

module.exports = router;
