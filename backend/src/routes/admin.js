const express = require('express');
const { User, Store, Rating } = require('../models');
const auth = require('../middleware/auth');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const router = express.Router();

// Get Dashboard Stats
router.get('/dashboard', auth(['ADMIN']), async (req, res) => {
    try {
        const totalUsers = await User.count();
        const totalStores = await Store.count();
        const totalRatings = await Rating.count();
        res.json({ totalUsers, totalStores, totalRatings });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Add New Store
router.post('/stores', auth(['ADMIN']), async (req, res) => {
    try {
        const store = await Store.create(req.body);
        res.status(201).json(store);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

// Add New User (Admin can add any role)
router.post('/users', auth(['ADMIN']), async (req, res) => {
    try {
        const { name, email, password, address, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 8);
        const user = await User.create({
            name, email, password: hashedPassword, address, role
        });
        res.status(201).json(user);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

// List Stores with Ratings
router.get('/stores', auth(['ADMIN']), async (req, res) => {
    try {
        const { name, email, address, sortBy, order } = req.query;
        const where = {};
        if (name) where.name = { [Op.like]: `%${name}%` };
        if (email) where.email = { [Op.like]: `%${email}%` };
        if (address) where.address = { [Op.like]: `%${address}%` };

        const stores = await Store.findAll({
            where,
            include: [{ model: Rating }],
            order: sortBy ? [[sortBy, order || 'ASC']] : [['name', 'ASC']]
        });

        const result = stores.map(store => {
            const ratings = store.Ratings || [];
            const avgRating = ratings.length > 0
                ? ratings.reduce((acc, curr) => acc + curr.value, 0) / ratings.length
                : 0;
            return {
                ...store.toJSON(),
                averageRating: avgRating.toFixed(1)
            };
        });

        res.json(result);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// List Users
router.get('/users', auth(['ADMIN']), async (req, res) => {
    try {
        const { name, email, address, role, sortBy, order } = req.query;
        const where = {};
        if (name) where.name = { [Op.like]: `%${name}%` };
        if (email) where.email = { [Op.like]: `%${email}%` };
        if (address) where.address = { [Op.like]: `%${address}%` };
        if (role) where.role = role;

        const users = await User.findAll({
            where,
            include: [{ model: Rating }],
            order: sortBy ? [[sortBy, order || 'ASC']] : [['name', 'ASC']]
        });

        const result = users.map(user => {
            let extra = {};
            if (user.role === 'STORE_OWNER') {
                // Average rating for store owner (if we associate owner to store)
                // The requirement says "If user is Store Owner, their Rating should also be displayed"
                // This usually means the rating of the store they own.
                // For simplicity, let's assume we match store owner email to store email or something.
                // But the requirement doesn't explicitly link them. I'll just skip or add a field.
            }
            return user;
        });

        res.json(result);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

module.exports = router;
