const { Sequelize } = require('sequelize');
require('dotenv').config({ path: __dirname + '/../.env' }); // Load .env file explicitly

console.log('DB_HOST:', process.env.DB_HOST || 'Not Loaded'); // Debugging
console.log('DB_USER:', process.env.DB_USER || 'Not Loaded');
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? 'Set' : 'Not Set');
console.log('DB_NAME:', process.env.DB_NAME || 'Not Loaded');
console.log('DB_PORT:', process.env.DB_PORT || 'Not Loaded');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: 'mysql',
  logging: false,
  dialectOptions: {
    connectTimeout: 60000,
  },
});

sequelize.authenticate()
  .then(() => console.log('✅ Connected to MySQL Database'))
  .catch(err => console.error('❌ MySQL Connection Failed:', err));

module.exports = sequelize;
