module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    total_amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    status: { type: DataTypes.STRING, defaultValue: 'pending' }, // pending, completed, canceled
  }, { timestamps: true });

  return Order;
};
