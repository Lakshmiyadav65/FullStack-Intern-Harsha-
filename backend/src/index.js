require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const { User, Store, Rating } = require('./models');

const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/user');
const storeRoutes = require('./routes/store');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/store', storeRoutes);

const PORT = process.env.PORT || 5000;

sequelize.sync({ force: false }).then(() => {
    console.log('Database synced');
    // Seed an admin if not exists
    User.findOne({ where: { role: 'ADMIN' } }).then(async admin => {
        if (!admin) {
            const bcrypt = require('bcryptjs');
            const hashedPassword = await bcrypt.hash('Admin@123', 8);
            await User.create({
                name: 'System Administrator',
                email: 'admin@roxiler.com',
                password: hashedPassword,
                address: 'Main Office',
                role: 'ADMIN'
            });
            console.log('Admin seeded: admin@roxiler.com / Admin@123');
        }
    });

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
