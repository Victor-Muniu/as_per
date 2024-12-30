const express = require('express');
const mongoose = require('mongoose');
const Requisition = require('../../modules/procurement/requisition');
const Inventory = require('../../modules/procurement/inventory');
const Staff = require('../../modules/general/staff'); 
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();
router.post('/requisitions', authMiddleware, async (req, res) => {
    try {
      const { inventoryItems, department, status } = req.body;
      const user = req.user;
  
      if (!inventoryItems || !department) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
  
      
      const inventoryData = [];
      for (const item of inventoryItems) {
        const inventoryItem = await Inventory.findOne({ name: item.name });
        if (!inventoryItem) {
          return res.status(404).json({ error: `Inventory item ${item.name} not found` });
        }
        inventoryData.push({
          inventory: inventoryItem._id,
          quantity: item.quantity
        });
      }
  
     
      const requisition = new Requisition({
        requisition_number: `REQ-${Date.now()}`,
        inventory_items: inventoryData,
        department: department,
        status: status || 'pending',
        requested_by: user._id,
      });
  
      await requisition.save();
      res.status(201).json({ message: 'Requisition created successfully', requisition });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

router.get('/requisitions', authMiddleware, async (req, res) => {
  try {
    const requisitions = await Requisition.find()
      .populate('requested_by', 'name email')
      .populate('approved_by', 'name email')
      .populate('inventory_items.inventory', 'name quantity');

    res.status(200).json(requisitions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/requisitions/:id', authMiddleware, async (req, res) => {
  try {
    const requisition = await Requisition.findById(req.params.id)
      .populate('requested_by', 'name email')
      .populate('approved_by', 'name email')
      .populate('inventory_items.inventory', 'name quantity');

    if (!requisition) {
      return res.status(404).json({ error: 'Requisition not found' });
    }

    res.status(200).json(requisition);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.patch('/requisitions/:id/approve', authMiddleware, async (req, res) => {
  try {
    const requisition = await Requisition.findById(req.params.id);
    if (!requisition) {
      return res.status(404).json({ error: 'Requisition not found' });
    }
    if (requisition.status === 'approved') {
      return res.status(400).json({ error: 'Requisition is already approved' });
    }

    const { approved_by } = req.body; 
    const approver = await Staff.findById(approved_by);
    if (!approver) {
      return res.status(400).json({ error: 'Approver not found' });
    }

    let isValidApproval = true;


    for (const item of requisition.inventory_items) {
      const inventoryItem = await Inventory.findById(item.inventory);
      if (inventoryItem.quantity < item.quantity) {
        isValidApproval = false;
        break;
      }
    }

    if (!isValidApproval) {
      return res.status(400).json({ error: 'Insufficient inventory for approval' });
    }


    requisition.status = 'approved';
    requisition.approved_by = approved_by;
    await requisition.save();


    for (const item of requisition.inventory_items) {
      const inventoryItem = await Inventory.findById(item.inventory);
      inventoryItem.quantity -= item.quantity;
      await inventoryItem.save();
    }

    res.status(200).json({ message: 'Requisition approved successfully', requisition });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.delete('/requisitions/:id', authMiddleware, async (req, res) => {
  try {
    const requisition = await Requisition.findById(req.params.id);
    if (!requisition) {
      return res.status(404).json({ error: 'Requisition not found' });
    }

    await requisition.remove();
    res.status(200).json({ message: 'Requisition deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
