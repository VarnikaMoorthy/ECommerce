const { sequelize } = require('./models');

sequelize.sync({ alter: true }).then(() => {
  console.log('✅ Database tables created successfully!');
  process.exit();
}).catch(err => {
  console.error('❌ Error syncing database:', err);
  process.exit(1);
});
