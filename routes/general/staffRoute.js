const express = require('express');
const Staff = require('../../modules/general/staff'); 
const router = express.Router();
router.post('/staff', async (req, res) => {
    const { fname, lname, role, department, status, email, password, emp_no } = req.body;
    
    const newStaff = new Staff({
        fname,
        lname,
        role,
        department,
        status,
        email,
        password,
        emp_no
    });

    try {
        const staff = await newStaff.save();
        res.status(201).json(staff);
    } catch (err) {
        res.status(400).json({ message: 'Error creating staff member', error: err.message });
    }
});


router.get('/staff', async (req, res) => {
    try {
        const staffList = await Staff.find();
        res.status(200).json(staffList);
    } catch (err) {
        res.status(400).json({ message: 'Error retrieving staff members', error: err.message });
    }
});


router.get('/staff/:id', async (req, res) => {
    try {
        const staff = await Staff.findById(req.params.id);
        if (!staff) {
            return res.status(404).json({ message: 'Staff member not found' });
        }
        res.status(200).json(staff);
    } catch (err) {
        res.status(400).json({ message: 'Error retrieving staff member', error: err.message });
    }
});


router.patch('/staff/:id', async (req, res) => {
    try {
        const staff = await Staff.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!staff) {
            return res.status(404).json({ message: 'Staff member not found' });
        }
        res.status(200).json(staff);
    } catch (err) {
        res.status(400).json({ message: 'Error updating staff member', error: err.message });
    }
});


router.delete('/staff/:id', async (req, res) => {
    try {
        const staff = await Staff.findByIdAndDelete(req.params.id);
        if (!staff) {
            return res.status(404).json({ message: 'Staff member not found' });
        }
        res.status(200).json({ message: 'Staff member deleted successfully' });
    } catch (err) {
        res.status(400).json({ message: 'Error deleting staff member', error: err.message });
    }
});

module.exports = router;
