const express = require('express');
const mysql = require('mysql2');
const router = express.Router();
const dotenv = require('dotenv');

dotenv.config();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

// ✅ Test Database Connection Route
router.get('/test-db', (req, res) => {
    db.query('SELECT 1', (err, results) => {
        if (err) {
            console.error('❌ Database query error:', err);
            return res.status(500).json({ success: false, message: 'Database connection failed', error: err });
        }
        res.json({ success: true, message: 'Database connection successful!' });
    });
});

module.exports = router;
