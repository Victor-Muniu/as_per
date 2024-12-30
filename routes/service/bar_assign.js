const express = require('express');
const Table = require('../../modules/service/table');
const Bill = require('../../modules/service/bar_bills');
const Staff = require('../../modules/general/staff');
const KOT = require('../../modules/service/KOT')
const MenuItem = require('../../modules/service/bar_menu')
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/assign_bar', authMiddleware, async (req, res) => {
    try {
        const { table_number, menu_items } = req.body;
        const served_by = req.user.id;

        const table = await Table.findOne({ table_number });
        if (!table) return res.status(404).json({ message: 'Table not found' });
        if (table.status !== 'vacant') return res.status(400).json({ message: 'Table is not vacant' });

        const unclearedBillsCount = await Bill.countDocuments({ served_by, status: 'not cleared' });
        const staff = await Staff.findById(served_by);
        if (unclearedBillsCount >= staff.max_uncleared_bills) {
            return res.status(400).json({ message: 'Staff has reached the maximum number of uncleared bills' });
        }

        let total_amount = 0;
        const resolvedItems = await Promise.all(
            menu_items.map(async (item) => {
                const menuItem = await MenuItem.findOne({ name: item.name });
                if (!menuItem) throw new Error(`Menu item "${item.name}" not found`);

                return {
                    menu_item: menuItem._id,
                    quantity: item.quantity,
                    total_price: menuItem.price * item.quantity
                };
            })
        );

        total_amount = resolvedItems.reduce((sum, item) => sum + item.total_price, 0);

        const bill = new Bill({
            table: table._id,
            served_by,
            items: resolvedItems,
            total_amount
        });
        await bill.save();

        const kot = new KOT({
            bill: bill._id,
            items: resolvedItems.map(item => ({
                menu_item: item.menu_item,
                quantity: item.quantity
            }))
        });
        await kot.save();

        table.status = 'occupied';
        table.served_by = served_by;
        await table.save();

        res.status(201).json({ message: 'Table assigned, bill and KOT created successfully', bill, kot });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

router.post('/barbill/table/:table_number/add-items', authMiddleware, async (req, res) => {
    try {
        const { table_number } = req.params;
        const { menu_items } = req.body;
        const table = await Table.findOne({ table_number });
        if (!table) return res.status(404).json({ message: 'Table not found' });

        const bill = await Bill.findOne({ table: table._id });
        if (!bill) return res.status(404).json({ message: 'Bill not found for this table' });

        let additionalAmount = 0;
        const kotItems = [];


        for (const item of menu_items) {
            const menuItem = await MenuItem.findOne({ name: item.name });
            if (!menuItem) {
                return res.status(404).json({ message: `Menu item "${item.name}" not found` });
            }

            additionalAmount += menuItem.price * item.quantity;
            kotItems.push({
                menu_item: menuItem._id,
                quantity: item.quantity
            });

            const existingItem = bill.items.find(billItem => String(billItem.menu_item) === String(menuItem._id));
            if (existingItem) {
                existingItem.quantity += item.quantity;
                existingItem.total_price += menuItem.price * item.quantity;
            } else {
                bill.items.push({
                    menu_item: menuItem._id,
                    quantity: item.quantity,
                    total_price: menuItem.price * item.quantity
                });
            }
        }

       
        const kot = new KOT({ bill: bill._id, items: kotItems });
        await kot.save();

    
        bill.total_amount += additionalAmount;
        await bill.save();

        res.status(201).json({ message: 'KOT created and bill updated successfully', kot });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

router.get('/bar-bills', authMiddleware, async (req, res) => {
    try {
        const bills = await Bill.find()
            .populate('table', 'table_number')
            .populate('items.menu_item', 'name price')
            .populate('served_by', 'fname lname emp_no');

        res.status(200).json(bills);
    } catch (err) {
        console.error('Error fetching bills:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
});


router.get('/bar_bills/table/:table_number', authMiddleware, async (req, res) => {
    try {
        const { table_number } = req.params;
        const table = await Table.findOne({ table_number });
        if (!table) {
            return res.status(404).json({ message: 'Table not found' });
        }
        const bill = await Bill.findOne({ table: table._id })
            .populate('table', 'table_number')
            .populate('items.menu_item', 'name price')
            .populate('served_by', 'fname lname emp_no');

        if (!bill) {
            return res.status(404).json({ message: 'No bill found for this table' });
        }

        res.status(200).json(bill);
    } catch (err) {
        console.error('Error fetching bill by table number:', err.message);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});


router.delete('/bills/:id', authMiddleware, async (req, res) => {
    try {
        const bill = await Bill.findByIdAndDelete(req.params.id);
        if (!bill) return res.status(404).json({ message: 'Bill not found' });

       
        const table = await Table.findById(bill.table);
        if (table) {
            table.status = 'vacant';
            table.served_by = null;
            await table.save();
        }

        res.status(200).json({ message: 'Bill deleted successfully' });
    } catch (err) {
        console.error('Error deleting bill:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;