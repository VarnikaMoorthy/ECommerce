const express = require('express');
const { Product } = require('../models');
const { authenticate, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// 🟢 Create a Product (Only Admins & Vendors)
router.post('/', auth, async (req, res) => {
    if (req.user.role !== 1 && req.user.role !== 3) {
        return res.status(403).json({ message: "Access Denied: Only Admins & Vendors can add products." });
    }

    try {
        const { name, description, category, old_price, new_price, delivery_amount, free_delivery, start_date } = req.body;
        const product = await Product.create({
            name, description, category, old_price, new_price,
            delivery_amount, free_delivery, start_date,
            expiry_date: new Date(new Date(start_date).getTime() + 7 * 24 * 60 * 60 * 1000),
            vendor_id: req.user.id
        });

        res.status(201).json({ message: "Product added successfully", product });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

// 🟢 Get All Products (Anyone)
router.get('/', async (req, res) => {
    try {
        const products = await Product.findAll();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

// 🟢 Update a Product (Only Admins & Vendors)
router.put('/:id', auth, async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });

        if (req.user.role !== 1 && req.user.role !== 3 && req.user.id !== product.vendor_id) {
            return res.status(403).json({ message: "Access Denied: Only the product owner or an admin can update this product." });
        }

        await product.update(req.body);
        res.json({ message: "Product updated successfully", product });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

// 🟢 Delete a Product (Only Admins & Vendors)
router.delete('/:id', auth, async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });

        if (req.user.role !== 1 && req.user.role !== 3 && req.user.id !== product.vendor_id) {
            return res.status(403).json({ message: "Access Denied: Only the product owner or an admin can delete this product." });
        }

        await product.destroy();
        res.json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

module.exports = router;
