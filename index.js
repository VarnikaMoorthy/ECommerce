require('dotenv').config();
console.log("Loaded JWT Secret:", process.env.JWT_SECRET);  // ✅ Debugging Line


const express = require('express');
const { sequelize } = require('./models');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();
app.use(express.json());
app.use(cors());

// ✅ Define Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

app.get('/', (req, res) => res.send('🚀 Server is running successfully!'));

const PORT = process.env.PORT || 5000;

// ✅ Sync Database & Start Server
sequelize.sync({ alter: true }).then(() => {
  app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
}).catch(err => console.error('❌ Database connection error:', err));
