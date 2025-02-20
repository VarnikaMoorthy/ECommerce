const { User, Role } = require('../models');
const bcrypt = require('bcrypt');

// 📌 Get all users (Admin Only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'username', 'email', 'role_id'],
      include: [{ model: Role, attributes: ['name'] }],
    });

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📌 Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ['id', 'username', 'email', 'role_id'],
      include: [{ model: Role, attributes: ['name'] }],
    });

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📌 Update user (Admin Only)
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const { username, email, password, role } = req.body;
    const existingRole = await Role.findOne({ where: { name: role } });

    if (!existingRole) return res.status(400).json({ error: 'Invalid role' });

    user.username = username || user.username;
    user.email = email || user.email;
    if (password) user.password = await bcrypt.hash(password, 10);
    user.role_id = existingRole.id;

    await user.save();

    res.status(200).json({ message: 'User updated successfully', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📌 Delete user (Admin Only)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    await user.destroy();
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📌 Create a Staff Member (Admin Only)
exports.createStaff = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const staffRole = await Role.findOne({ where: { name: 'staff' } });

    if (!staffRole) return res.status(400).json({ error: 'Staff role not found' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newStaff = await User.create({
      username,
      email,
      password: hashedPassword,
      role_id: staffRole.id,
    });

    res.status(201).json({ message: 'Staff created successfully', staff: newStaff });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
