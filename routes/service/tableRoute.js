const express = require('express');
const Table = require('../../modules/service/table'); 
const Staff = require('../../modules/general/staff'); 
const authMiddleware = require('../middleware/authMiddleware'); 

const router = express.Router();


router.post('/tables', authMiddleware, async (req, res) => {
    try {
        const { table_number, status, seats_available, served_by } = req.body;

        
        const existingTable = await Table.findOne({ table_number });
        if (existingTable) return res.status(400).json({ message: 'Table number already exists' });

       
        if (status === 'occupied') {
            const staff = await Staff.findById(served_by);
            if (!staff) return res.status(400).json({ message: 'Invalid staff ID provided for served_by' });
        }

        const table = new Table({ table_number, status, seats_available, served_by });
        await table.save();

        res.status(201).json({ message: 'Table created successfully', table });
    } catch (err) {
        console.error('Error creating table:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
});


router.get('/tables', authMiddleware, async (req, res) => {
    try {
        const tables = await Table.find().populate('served_by', 'fname lname emp_no');
        res.status(200).json(tables);
    } catch (err) {
        console.error('Error fetching tables:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
});


router.get('/tables/:id', authMiddleware, async (req, res) => {
    try {
        const table = await Table.findById(req.params.id).populate('served_by', 'fname lname emp_no');
        if (!table) return res.status(404).json({ message: 'Table not found' });

        res.status(200).json(table);
    } catch (err) {
        console.error('Error fetching table by ID:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
});


router.patch('/tables/:id', authMiddleware, async (req, res) => {
    try {
        const { status, seats_available, served_by } = req.body;

        const table = await Table.findById(req.params.id);
        if (!table) return res.status(404).json({ message: 'Table not found' });

        
        if (status === 'occupied' && served_by) {
            const staff = await Staff.findById(served_by);
            if (!staff) return res.status(400).json({ message: 'Invalid staff ID provided for served_by' });
            table.served_by = served_by;
        } else if (status !== 'occupied') {
            table.served_by = null;
        }

       
        if (status) table.status = status;
        if (seats_available !== undefined) table.seats_available = seats_available;

        await table.save();
        res.status(200).json({ message: 'Table updated successfully', table });
    } catch (err) {
        console.error('Error updating table:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
});


router.delete('/tables/:id', authMiddleware, async (req, res) => {
    try {
        const table = await Table.findByIdAndDelete(req.params.id);
        if (!table) return res.status(404).json({ message: 'Table not found' });

        res.status(200).json({ message: 'Table deleted successfully' });
    } catch (err) {
        console.error('Error deleting table:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
