const jwt = require('jsonwebtoken');
const { User } = require('../models');

const auth = (roles = []) => {
    return async (req, res, next) => {
        try {
            const token = req.header('Authorization')?.replace('Bearer ', '');

            if (!token) {
                throw new Error();
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
            const user = await User.findByPk(decoded.id);

            if (!user) {
                throw new Error();
            }

            if (roles.length && !roles.includes(user.role)) {
                return res.status(403).json({ error: 'Access denied' });
            }

            req.user = user;
            req.token = token;
            next();
        } catch (e) {
            res.status(401).json({ error: 'Please authenticate.' });
        }
    };
};

module.exports = auth;
