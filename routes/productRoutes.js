const express = require('express');
const { createProduct, getProducts, getProductById, updateProduct, deleteProduct } = require('../controllers/productController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// ✅ Use role names instead of numbers
router.post('/', authenticate, authorize(['admin', 'vendor']), createProduct);
router.get('/', getProducts); // ✅ Public access (users can view products without login)
router.get('/:id', getProductById); // ✅ Public access
router.put('/:id', authenticate, authorize(['admin', 'vendor']), updateProduct);
router.delete('/:id', authenticate, authorize(['admin', 'vendor']), deleteProduct);

module.exports = router; // ✅ Ensure this line is present
