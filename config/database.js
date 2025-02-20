const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: 'mysql',
  logging: false, // Disable SQL logging
  dialectOptions: {
    connectTimeout: 60000, // Increase timeout for cloud DBs
  },
});

sequelize.authenticate()
  .then(() => console.log('✅ Connected to MySQL Database'))
  .catch(err => console.error('❌ MySQL Connection Failed:', err));

module.exports = sequelize;
