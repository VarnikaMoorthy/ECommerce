const { Product, User } = require('../models');
const { Op } = require('sequelize');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// ✅ Image Upload Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, uuidv4() + path.extname(file.originalname)),
});
const upload = multer({ storage }).single('image');

// 📌 Create a new product
const createProduct = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(500).json({ error: err.message });

    try {
      let { name, description, category, old_price, new_price, delivery_amount, free_delivery, start_date } = req.body;

      // ✅ Validate start_date format
      if (!/^\d{4}-\d{2}-\d{2}$/.test(start_date)) {
        return res.status(400).json({ error: "Invalid start_date format. Use YYYY-MM-DD." });
      }
      const parsedStartDate = new Date(start_date);
      if (isNaN(parsedStartDate.getTime())) {
        return res.status(400).json({ error: "Invalid start_date. Provide a valid date." });
      }

      // ✅ Calculate expiry_date (7 days from start_date)
      const expiry_date = new Date(parsedStartDate);
      expiry_date.setDate(expiry_date.getDate() + 7);

      // ✅ Ensure price values are valid
      old_price = parseFloat(old_price) || 0;
      new_price = parseFloat(new_price) || 0;
      delivery_amount = parseFloat(delivery_amount) || 0;
      free_delivery = free_delivery === 'true' || free_delivery === true;

      // ✅ Save to database
      const product = await Product.create({
        name,
        description,
        category,
        old_price,
        new_price,
        delivery_amount,
        free_delivery,
        start_date: parsedStartDate,
        expiry_date,
        image_url: req.file ? req.file.filename : null,
        product_url: uuidv4(),
        vendor_id: req.user.id,
      });

      res.status(201).json(product);
    } catch (error) {
      console.error("Product Creation Error:", error);
      res.status(500).json({ error: error.message });
    }
  });
};

// 📌 Get all products with pagination & search
const getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows } = await Product.findAndCountAll({
      where: { name: { [Op.like]: `%${search}%` } },
      offset: parseInt(offset),
      limit: parseInt(limit),
      order: [['createdAt', 'DESC']],
      include: [{ model: User, attributes: ['username', 'email'] }],
    });

    res.status(200).json({
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      products: rows,
    });
  } catch (error) {
    console.error("Error Fetching Products:", error);
    res.status(500).json({ error: error.message });
  }
};

// 📌 Get a single product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [{ model: User, attributes: ['username', 'email'] }],
    });

    if (!product) return res.status(404).json({ error: 'Product not found' });

    res.status(200).json(product);
  } catch (error) {
    console.error("Error Fetching Product by ID:", error);
    res.status(500).json({ error: error.message });
  }
};

// 📌 Update a product
const updateProduct = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(500).json({ error: err.message });

    try {
      const product = await Product.findByPk(req.params.id);
      if (!product) return res.status(404).json({ error: 'Product not found' });

      if (req.user.id !== product.vendor_id && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      let { name, description, category, old_price, new_price, delivery_amount, free_delivery, start_date } = req.body;

      // ✅ Validate start_date
      let expiry_date = product.expiry_date;
      if (start_date && /^\d{4}-\d{2}-\d{2}$/.test(start_date)) {
        const parsedStartDate = new Date(start_date);
        if (!isNaN(parsedStartDate.getTime())) {
          expiry_date = new Date(parsedStartDate);
          expiry_date.setDate(expiry_date.getDate() + 7);
        }
      }

      // ✅ Update values
      product.name = name || product.name;
      product.description = description || product.description;
      product.category = category || product.category;
      product.old_price = old_price !== undefined ? parseFloat(old_price) : product.old_price;
      product.new_price = new_price !== undefined ? parseFloat(new_price) : product.new_price;
      product.delivery_amount = delivery_amount !== undefined ? parseFloat(delivery_amount) : product.delivery_amount;
      product.free_delivery = free_delivery === 'true' || free_delivery === true;
      product.start_date = start_date || product.start_date;
      product.expiry_date = expiry_date;
      product.image_url = req.file ? req.file.filename : product.image_url;

      await product.save();
      res.status(200).json(product);
    } catch (error) {
      console.error("Product Update Error:", error);
      res.status(500).json({ error: error.message });
    }
  });
};

// 📌 Delete a product
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    if (req.user.id !== product.vendor_id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await product.destroy();
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error("Product Deletion Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ **Ensure this line is present to avoid "createProduct is not defined"**
module.exports = { createProduct, getProducts, getProductById, updateProduct, deleteProduct };
