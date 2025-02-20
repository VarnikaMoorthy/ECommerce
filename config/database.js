const { Sequelize } = require('sequelize'); 
require('dotenv').config();

// Debugging: Print database connection details
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD ? "******" : "Not Set");
console.log("DB_NAME:", process.env.DB_NAME);
console.log("DB_PORT:", process.env.DB_PORT);

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 14374,  // Ensure correct port
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
