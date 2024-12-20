const express = require('express');
const Invoice = require('../../modules/procurement/invoice');
const Supplier = require('../../modules/accounts/supplier');
const Inventory = require('../../modules/procurement/inventory');
const Creditors = require('../../modules/accounts/creditors');
const Purchase = require('../../modules/accounts/purchase')
const authMiddleware = require('../../routes/middleware/authMiddleware');

const router = express.Router();

router.post('/invoices', authMiddleware, async (req, res) => {
    try {
        const { invoice_number, supplier_name, lpo_number, items_received } = req.body;

        // Find supplier
        const supplier = await Supplier.findOne({ name: supplier_name });
        if (!supplier) return res.status(404).json({ message: 'Supplier not found' });

        let total_amount = 0;
        const items = [];

        // Process each item in the invoice
        for (const item of items_received) {
            const inventory = await Inventory.findOne({ name: item.inventory_name });
            if (!inventory) return res.status(404).json({ message: `Inventory item ${item.inventory_name} not found` });

            const total_price = item.quantity_received * inventory.unit_price;
            total_amount += total_price;

            // Update the inventory with the received quantity
            inventory.quantity += item.quantity_received;
            await inventory.save();

            // Prepare the item object to be saved in the invoice
            items.push({
                inventory: inventory._id,
                quantity_received: item.quantity_received,
                unit_price: inventory.unit_price,
                total_price
            });
        }

        // Create the invoice
        const invoice = new Invoice({
            invoice_number,
            supplier: supplier._id,
            lpo_number,
            items_received: items,
            total_amount,
            received_by: req.user._id
        });

        await invoice.save();

        // Create the corresponding creditor entry
        const creditor = new Creditors({
            invoice: invoice._id,
            supplier: supplier._id,
            date: invoice.date_received,
            total_amount: invoice.total_amount
        });
        await creditor.save();

        
        const purchase = new Purchase({
            purchase_number: `PUR-${invoice.invoice_number}`, 
            supplier: supplier._id,
            items: items.map(item => ({
                inventory: item.inventory,
                quantity: item.quantity_received,
                unit_price: item.unit_price,
                total_price: item.total_price
            })),
            total_amount,
            date_of_purchase: invoice.date_received,
            purchased_by: req.user._id,
            status: 'completed',
            invoice_no: invoice.invoice_number, 
            payment_terms: 'net 30' 
        });

        await purchase.save();

        res.status(201).json({ message: 'Invoice and purchase created successfully', invoice, purchase });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/invoices', authMiddleware, async (req, res) => {
    try {
        const invoices = await Invoice.find()
            .populate('supplier', 'name email')
            .populate('items_received.inventory', 'name unit_price')
            .populate('received_by', 'fname lname emp_no');
        res.status(200).json(invoices);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});


router.get('/invoices/number/:invoice_number', authMiddleware, async (req, res) => {
    try {
        const { invoice_number } = req.params;

        const invoice = await Invoice.findOne({ invoice_number })
            .populate('supplier', 'name email')
            .populate('items_received.inventory', 'name unit_price')
            .populate('received_by', 'fname lname emp_no');

        if (!invoice) return res.status(404).json({ message: 'Invoice not found' });

        res.status(200).json(invoice);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});


router.patch('/invoices/:id', authMiddleware, async (req, res) => {
    try {
        const { items_received } = req.body;

        const invoice = await Invoice.findById(req.params.id);
        if (!invoice) return res.status(404).json({ message: 'Invoice not found' });

        let total_amount = 0;
        const updatedItems = [];

        // Process each item in the updated invoice
        for (const item of items_received) {
            const inventory = await Inventory.findOne({ name: item.inventory_name });
            if (!inventory) return res.status(404).json({ message: `Inventory item ${item.inventory_name} not found` });

            const total_price = item.quantity_received * inventory.unit_price;
            total_amount += total_price;

            // Update the inventory with the received quantity
            inventory.quantity += item.quantity_received;
            await inventory.save();

            // Prepare the item object to be saved in the invoice
            updatedItems.push({
                inventory: inventory._id,
                quantity_received: item.quantity_received,
                unit_price: inventory.unit_price,
                total_price
            });
        }

        // Update the invoice with the new items and total amount
        invoice.items_received = updatedItems;
        invoice.total_amount = total_amount;
        await invoice.save();

        // Update the corresponding creditor record
        const creditor = await Creditors.findOne({ invoice: invoice._id });
        if (creditor) {
            creditor.total_amount = total_amount;
            await creditor.save();
        }

        // Find the corresponding purchase and update it
        const purchase = await Purchase.findOne({ invoice_no: invoice.invoice_number });
        if (purchase) {
            purchase.items = updatedItems.map(item => ({
                inventory: item.inventory,
                quantity: item.quantity_received,
                unit_price: item.unit_price,
                total_price: item.total_price
            }));
            purchase.total_amount = total_amount;
            await purchase.save();
        }

        res.status(200).json({ message: 'Invoice and corresponding purchase updated successfully', invoice });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

router.delete('/invoices/:id', authMiddleware, async (req, res) => {
    try {
        // Find the invoice and delete it
        const invoice = await Invoice.findByIdAndDelete(req.params.id);
        if (!invoice) return res.status(404).json({ message: 'Invoice not found' });

        // Delete the corresponding creditor record
        await Creditors.findOneAndDelete({ invoice: invoice._id });

        // Delete the corresponding purchase record
        const purchase = await Purchase.findOneAndDelete({ invoice_no: invoice.invoice_number });
        if (purchase) {
            // If the purchase is found and deleted, ensure items are removed from inventory
            for (const item of purchase.items) {
                const inventory = await Inventory.findById(item.inventory);
                if (inventory) {
                    inventory.quantity -= item.quantity;
                    await inventory.save();
                }
            }
        }

        res.status(200).json({ message: 'Invoice and corresponding purchase deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});




module.exports = router
