const express = require('express');
const { checkout, getOrders } = require('../controllers/orderController');
const { authenticate } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/checkout', authenticate, checkout);
router.get('/history', authenticate, getOrders);

module.exports = router;
