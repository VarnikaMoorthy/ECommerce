module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    category: { type: DataTypes.STRING, allowNull: false },
    old_price: { type: DataTypes.DECIMAL(10, 2), allowNull: false, get() { return parseFloat(this.getDataValue('old_price')); } },
    new_price: { type: DataTypes.DECIMAL(10, 2), allowNull: false, get() { return parseFloat(this.getDataValue('new_price')); } },
    delivery_amount: { type: DataTypes.DECIMAL(10, 2), allowNull: true, get() { return parseFloat(this.getDataValue('delivery_amount')); } },
    free_delivery: { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: false },
    start_date: { type: DataTypes.DATE, allowNull: true },
    expiry_date: { type: DataTypes.DATE, allowNull: true },
    image_url: { type: DataTypes.STRING, allowNull: true },
    product_url: { type: DataTypes.STRING, allowNull: true, unique: true },
    vendor_id: { type: DataTypes.INTEGER, allowNull: true },
  }, { timestamps: true });

  return Product;
};
