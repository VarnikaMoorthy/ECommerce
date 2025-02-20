const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');
const testDbRoutes = require('./routes/test-db');  // Import the test-db route

dotenv.config(); // Load environment variables

const app = express();
app.use(express.json()); // Middleware for parsing JSON
app.use('/api', testDbRoutes); // Mount the test-db route

// ✅ Establish Database Connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

db.connect(err => {
    if (err) {
        console.error('❌ Database connection failed:', err);
    } else {
        console.log('✅ Connected to MySQL Database');
    }
});

// ✅ Server Listen
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
