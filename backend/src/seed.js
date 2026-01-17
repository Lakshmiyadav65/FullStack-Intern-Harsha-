const bcrypt = require('bcryptjs');
const { User, Store, Rating } = require('./models');
const sequelize = require('./config/database');

async function seed() {
    try {
        await sequelize.sync({ force: true });
        console.log('Database cleared and synced.');

        // Seed Admin
        const adminPassword = await bcrypt.hash('Admin@123', 8);
        await User.create({
            name: 'System Administrator',
            email: 'admin@roxiler.com',
            password: adminPassword,
            address: 'Corporate Headquarters, Roxiler Tower, 1st Street',
            role: 'ADMIN'
        });

        // Seed Stores
        const stores = [
            { name: 'Tech Gadgets Hub', email: 'tech@gadgets.com', address: '456 Digital Avenue, Silicon Valley' },
            { name: 'Green Garden Mart', email: 'garden@mart.com', address: '789 Nature Lane, Eco City' },
            { name: 'Urban Coffee House', email: 'urban@coffee.com', address: '101 Caffeine Street, Downtown' },
            { name: 'Fit & Fab Gym', email: 'gym@fitfab.com', address: '202 Muscle Road, Health Park' },
            { name: 'Gourmet Bites', email: 'gourmet@bites.com', address: '303 Delicious Way, Food Street' }
        ];

        const createdStores = await Store.bulkCreate(stores);
        console.log('Stores seeded');

        // Seed Users
        const userPassword = await bcrypt.hash('User@123', 8);
        const users = [
            { name: 'John Doe the Second Full Name', email: 'john@test.com', address: '45 Blue Street, New York', role: 'USER', password: userPassword },
            { name: 'Jane Smith Professional Tester', email: 'jane@test.com', address: '67 Red Avenue, London', role: 'USER', password: userPassword }
        ];

        const createdUsers = await User.bulkCreate(users);
        console.log('Users seeded');

        // Seed Store Owner for "Tech Gadgets Hub"
        const ownerPassword = await bcrypt.hash('Owner@123', 8);
        await User.create({
            name: 'Mark TechOwnerington StoreOwner',
            email: 'tech@gadgets.com', // Match store email as per our logic
            password: ownerPassword,
            address: '77 Silicon Square',
            role: 'STORE_OWNER'
        });
        console.log('Store Owner seeded');

        // Seed some initial ratings
        for (const user of createdUsers) {
            for (const store of createdStores) {
                await Rating.create({
                    userId: user.id,
                    storeId: store.id,
                    value: Math.floor(Math.random() * 5) + 1
                });
            }
        }
        console.log('Sample ratings seeded');

        console.log('Seeding completed successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Seeding error:', err);
        process.exit(1);
    }
}

seed();
