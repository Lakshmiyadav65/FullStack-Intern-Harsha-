const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const router = express.Router();

// Register Normal User
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, address } = req.body;

        // Password validation: 8-16 chars, 1 upper, 1 special
        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,16})/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                error: 'Password must be 8-16 characters long and include at least one uppercase letter and one special character.'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 8);
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            address,
            role: 'USER'
        });

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'secret');
        res.status(201).json({ user, token });
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid login credentials' });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'secret');
        res.json({ user, token });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

module.exports = router;
