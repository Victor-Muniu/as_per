const express = require('express');
const router = express.Router();
const LeaveApplication = require('../../modules/general/leave_application');  
const Staff = require('../../modules/general/staff');  


router.post('/leave-applications', async (req, res) => {
    const { emp_no, leaveType, startDate, endDate, reason } = req.body;

    try {
        const staff = await Staff.findOne({ emp_no });
        console.log(staff);
        if (!staff) {
            return res.status(404).json({ error: 'Staff member not found' });
        }

        
        const newLeaveApplication = new LeaveApplication({
            staffID: staff._id,
            leaveType,
            startDate,
            endDate,
            reason,
        });

        await newLeaveApplication.save();
        res.status(201).json({ message: 'Leave application created successfully' });
    } catch (error) {
        console.error('Error creating leave application:', error);
        res.status(500).json({ error: 'Failed to create leave application' });
    }
});


router.get('/leave-applications', async (req, res) => {
    try {
        const leaveApplications = await LeaveApplication.find()
            .populate('staffID') // Populate with all staff fields
            .exec();

        res.status(200).json(leaveApplications);
    } catch (error) {
        console.error('Error fetching leave applications:', error);
        res.status(500).json({ error: 'Failed to fetch leave applications' });
    }
});


router.get('/leave-applications/:id', async (req, res) => {
    try {
        const application = await LeaveApplication.findById(req.params.id);
        if (!application) {
            return res.status(404).json({ error: 'Leave application not found' });
        }
        res.json(application);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch leave application' });
    }
});


router.patch('/leave-applications/:id', async (req, res) => {
    try {
        const application = await LeaveApplication.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!application) {
            return res.status(404).json({ error: 'Leave application not found' });
        }
        res.json({ message: 'Leave application updated', application });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update leave application' });
    }
});


router.delete('/leave-applications/:id', async (req, res) => {
    try {
        const application = await LeaveApplication.findByIdAndDelete(req.params.id);
        if (!application) {
            return res.status(404).json({ error: 'Leave application not found' });
        }
        res.json({ message: 'Leave application deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete leave application' });
    }
});

module.exports = router;
