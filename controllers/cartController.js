const { Cart, Product, User } = require('../models'); // Import Cart model

// 📌 Add item to cart (Stores in MySQL)
exports.addToCart = async (req, res) => {
  try {
    const { product_id, quantity } = req.body;
    const user_id = req.user.id; // Get logged-in user's ID

    // Check if product exists
    const product = await Product.findByPk(product_id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    // Check if the item already exists in the user's cart
    let cartItem = await Cart.findOne({ where: { user_id, product_id } });

    if (cartItem) {
      // Update quantity if product already exists in the cart
      cartItem.quantity += parseInt(quantity);
      await cartItem.save();
    } else {
      // Add a new product to the cart
      cartItem = await Cart.create({ user_id, product_id, quantity });
    }

    res.status(200).json({ message: 'Product added to cart', cartItem });
  } catch (error) {
    console.error("Cart Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// 📌 View user's cart
exports.viewCart = async (req, res) => {
  try {
    const user_id = req.user.id;

    const cartItems = await Cart.findAll({
      where: { user_id },
      include: [{ model: Product, attributes: ['name', 'new_price'] }]
    });

    res.status(200).json(cartItems);
  } catch (error) {
    console.error("Cart View Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// 📌 Remove item from cart
exports.removeFromCart = async (req, res) => {
  try {
    const { product_id } = req.body;
    const user_id = req.user.id;

    const cartItem = await Cart.findOne({ where: { user_id, product_id } });
    if (!cartItem) return res.status(404).json({ error: 'Item not found in cart' });

    await cartItem.destroy();
    res.status(200).json({ message: 'Product removed from cart' });
  } catch (error) {
    console.error("Cart Remove Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// 📌 Clear entire cart
exports.clearCart = async (req, res) => {
  try {
    const user_id = req.user.id;

    await Cart.destroy({ where: { user_id } });
    res.status(200).json({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.error("Cart Clear Error:", error);
    res.status(500).json({ error: error.message });
  }
};
