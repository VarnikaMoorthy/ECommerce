const express = require('express');
const { addToCart, viewCart, removeFromCart, clearCart } = require('../controllers/cartController');
const { authenticate } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/add', authenticate, addToCart); // Add item to cart
router.get('/view', authenticate, viewCart); // View cart
router.post('/remove', authenticate, removeFromCart); // Remove specific item
router.post('/clear', authenticate, clearCart); // Clear entire cart

module.exports = router;
