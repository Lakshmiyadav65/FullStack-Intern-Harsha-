# Roxiler Store Rating System

A full-stack web application that allows users to register, discover stores, and submit ratings. Built as a technical assignment.

## Tech Stack
- **Frontend**: React.js, Vite, Lucide Icons, Vanilla CSS
- **Backend**: Node.js, Express.js, Sequelize ORM
- **Database**: SQLite (local file-based)

## Features
- **Role-Based Access Control**:
  - **System Admin**: Manage users, stores, and view system analytics.
  - **Normal User**: Browse stores, search by name/address, and rate stores (1-5 stars).
  - **Store Owner**: View feedback and average rating for their specific store.
- **Modern UI**: Dark-themed glassmorphism design with responsive tables and interactive star ratings.

## Getting Started

### 1. Prerequisite
- Node.js installed on your machine.

### 2. Backend Setup
```bash
cd backend
npm install
node src/seed.js   # Seeds the database with demo data
node src/index.js  # Starts the server on port 5000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev -- --port 3000
```

### 4. Access the App
Open [http://localhost:3000](http://localhost:3000)

## Demo Credentials
| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | admin@roxiler.com | Admin@123 |
| **User** | john@test.com | User@123 |
| **Owner** | tech@gadgets.com | Owner@123 |
