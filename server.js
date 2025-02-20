const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());

// ✅ Test Route
app.get('/api/test-db', (req, res) => {
    res.json({ success: true, message: "Server is running!" });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
}).on('error', (err) => {
    console.error("❌ Server startup error:", err);
});
