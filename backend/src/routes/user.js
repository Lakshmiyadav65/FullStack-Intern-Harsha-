const express = require('express');
const { User, Store, Rating } = require('../models');
const auth = require('../middleware/auth');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const router = express.Router();

// Get Stores for Normal User
router.get('/stores', auth(['USER']), async (req, res) => {
    try {
        const { name, address } = req.query;
        const where = {};
        if (name) where.name = { [Op.like]: `%${name}%` };
        if (address) where.address = { [Op.like]: `%${address}%` };

        const stores = await Store.findAll({
            where,
            include: [{ model: Rating }]
        });

        const result = stores.map(store => {
            const allRatings = store.Ratings || [];
            const userRating = allRatings.find(r => r.userId === req.user.id);
            const avgRating = allRatings.length > 0
                ? allRatings.reduce((acc, curr) => acc + curr.value, 0) / allRatings.length
                : 0;

            return {
                id: store.id,
                name: store.name,
                address: store.address,
                overallRating: avgRating.toFixed(1),
                userSubmittedRating: userRating ? userRating.value : null,
                ratingId: userRating ? userRating.id : null
            };
        });

        res.json(result);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Submit/Modify Rating
router.post('/ratings', auth(['USER']), async (req, res) => {
    try {
        const { storeId, value } = req.body;
        if (value < 1 || value > 5) {
            return res.status(400).json({ error: 'Rating must be between 1 and 5' });
        }

        const [rating, created] = await Rating.findOrCreate({
            where: { userId: req.user.id, storeId },
            defaults: { value }
        });

        if (!created) {
            rating.value = value;
            await rating.save();
        }

        res.json(rating);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

// Update Password
router.put('/profile/password', auth(['USER', 'STORE_OWNER', 'ADMIN']), async (req, res) => {
    try {
        const { password } = req.body;
        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,16})/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                error: 'Password must be 8-16 characters long and include at least one uppercase letter and one special character.'
            });
        }

        req.user.password = await bcrypt.hash(password, 8);
        await req.user.save();
        res.json({ message: 'Password updated successfully' });
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

module.exports = router;
