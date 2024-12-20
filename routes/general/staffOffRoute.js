const express = require('express');
const mongoose = require('mongoose');
const StaffOff = require('../../modules/general/leave');  
const Staff = require('../../modules/general/staff'); 
const router = express.Router();

router.post('/staff-off', async (req, res) => {
    const { emp_no, weeklyOff, annualLeave, holidayOff, maternityLeave, paternityLeave, sickLeave, pending_request } = req.body;

    try {
      
        const staff = await Staff.findOne({ emp_no });
        if (!staff) {
            return res.status(404).json({ message: "Staff member not found" });
        }

        
        const staffOff = new StaffOff({
            staffID: staff._id, 
            weeklyOff,
            annualLeave,
            holidayOff,
            maternityLeave,
            paternityLeave,
            sickLeave, 
            pending_request
        });

        
        await staffOff.save();

     
        res.status(201).json(staffOff);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

router.get('/staff-off', async (req, res) => {
    try {
        
        const staffOffData = await StaffOff.find().populate('staffID', 'emp_no fname lname role'); 
        
        if (staffOffData.length === 0) {
            return res.status(404).json({ message: 'No staff off data found' });
        }

        res.status(200).json(staffOffData);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});




router.get('/staff-off/:emp_no', async (req, res) => {
    const { emp_no } = req.params;

    try {
        const staff = await Staff.findOne({ emp_no: emp_no });
        if (!staff) {
            return res.status(404).json({ message: 'Staff not found' });
        }

        const staffOff = await StaffOff.findOne({ staffID: staff._id });
        if (!staffOff) {
            return res.status(404).json({ message: 'Staff off data not found' });
        }

        res.status(200).json(staffOff);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});


router.patch('/staff-off/:emp_no', async (req, res) => {
    const { emp_no } = req.params;
    const updates = req.body;

    try {
        const staff = await Staff.findOne({ emp_no: emp_no });
        if (!staff) {
            return res.status(404).json({ message: 'Staff not found' });
        }

        const staffOff = await StaffOff.findOneAndUpdate(
            { staffID: staff._id },
            { $set: updates },
            { new: true }  
        );

        if (!staffOff) {
            return res.status(404).json({ message: 'Staff off data not found' });
        }

        res.status(200).json(staffOff);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.delete('/staff-off/:emp_no', async (req, res) => {
    const { emp_no } = req.params;

    try {
        const staff = await Staff.findOne({ emp_no: emp_no });
        if (!staff) {
            return res.status(404).json({ message: 'Staff not found' });
        }

        const staffOff = await StaffOff.findOneAndDelete({ staffID: staff._id });
        if (!staffOff) {
            return res.status(404).json({ message: 'Staff off data not found' });
        }

        res.status(200).json({ message: 'Staff off data deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
