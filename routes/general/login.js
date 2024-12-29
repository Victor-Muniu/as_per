const express = require('express');
const jwt = require('jsonwebtoken');
const Staff = require('../../modules/general/staff');  
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();


router.post('/login', async (req, res) => {
    const { emp_no, password } = req.body;

    try {
        const user = await Staff.findOne({ emp_no });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.password !== password) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const payload = {
            user: {
                emp_no: user.emp_no, 
                role: user.role
            }
        };
        
        jwt.sign(payload, 'your_secret_key', { expiresIn: '1h' }, (err, token) => {
            if (err) {
                throw err;
            }
        
            res.cookie('token', token, {
               
                secure: process.env.NODE_ENV === 'production', 
                maxAge: 3600000 
            });
        
            res.json({
                user: {
                    emp_no: user.emp_no,
                    fname: user.fname,
                    lname: user.lname,
                    role: user.role,
                    email: user.email
                }
            });
        });
        
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});


router.get('/current-user', authMiddleware, async (req, res) => {
    try {
        const user = await Staff.findOne({ emp_no: req.user.emp_no }); 
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            user: {
                emp_no: user.emp_no,
                fname: user.fname,
                lname: user.lname,
                role: user.role,
                email: user.email
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
