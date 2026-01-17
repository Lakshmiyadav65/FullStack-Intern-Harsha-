const express = require('express');
const { User, Store, Rating } = require('../models');
const auth = require('../middleware/auth');
const router = express.Router();

// Store Owner Dashboard
router.get('/dashboard', auth(['STORE_OWNER']), async (req, res) => {
    try {
        // Assuming store owner is linked to a store by email (as per requirements simplicity)
        const store = await Store.findOne({ where: { email: req.user.email } });
        if (!store) {
            return res.status(404).json({ error: 'Store not found for this owner' });
        }

        const ratings = await Rating.findAll({
            where: { storeId: store.id },
            include: [{ model: User, attributes: ['name', 'email', 'address'] }]
        });

        const avgRating = ratings.length > 0
            ? ratings.reduce((acc, curr) => acc + curr.value, 0) / ratings.length
            : 0;

        res.json({
            storeName: store.name,
            averageRating: avgRating.toFixed(1),
            ratings: ratings.map(r => ({
                userName: r.User.name,
                userEmail: r.User.email,
                address: r.User.address,
                rating: r.value,
                date: r.createdAt
            }))
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

module.exports = router;
