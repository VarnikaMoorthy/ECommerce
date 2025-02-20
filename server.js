const express = require('express');
const dotenv = require('dotenv');
const mysql = require('mysql2');

dotenv.config();

const app = express();
app.use(express.json());

// ✅ Create MySQL Connection
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

connection.connect((err) => {
    if (err) {
        console.error("❌ Database connection failed:", err.message);
    } else {
        console.log("✅ Connected to MySQL Database");
    }
});

// ✅ Test Route for DB Connection
app.get('/api/test-db', (req, res) => {
    connection.query("SELECT 1", (err, results) => {
        if (err) {
            console.error("❌ Database test query failed:", err.message);
            return res.status(500).json({ success: false, message: "Database connection error", error: err.message });
        }
        res.json({ success: true, message: "Database connected successfully!" });
    });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
}).on('error', (err) => {
    console.error("❌ Server startup error:", err);
});
