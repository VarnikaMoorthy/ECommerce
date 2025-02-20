const { Order, OrderItem, Product, Cart, User } = require('../models');

exports.checkout = async (req, res) => {
  try {
    const user_id = req.user.id;

    // ✅ Fetch Cart Items from MySQL
    const cartItems = await Cart.findAll({ where: { user_id }, include: [Product] });

    if (!cartItems.length) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // ✅ Calculate Total Amount
    let totalAmount = 0;
    cartItems.forEach(item => {
      totalAmount += item.quantity * item.Product.new_price;
    });

    // ✅ Create an Order
    const newOrder = await Order.create({ user_id, total_amount: totalAmount, status: 'pending' });

    // ✅ Create Order Items
    for (let item of cartItems) {
      await OrderItem.create({
        order_id: newOrder.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.Product.new_price
      });
    }

    // ✅ Clear Cart After Checkout
    await Cart.destroy({ where: { user_id } });

    res.status(201).json({ message: 'Order placed successfully', order: newOrder });
  } catch (error) {
    console.error("Checkout Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// 📌 Get Order History
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { user_id: req.user.id },
      include: [{ model: OrderItem, include: [Product] }],
    });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
