const express = require('express');
const { getAllUsers, getUserById, updateUser, deleteUser, createStaff } = require('../controllers/userController');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', authenticate, authorize(['admin']), getAllUsers);
router.get('/:id', authenticate, getUserById);
router.put('/:id', authenticate, authorize(['admin']), updateUser);
router.delete('/:id', authenticate, authorize(['admin']), deleteUser);
router.post('/create-staff', authenticate, authorize(['admin']), createStaff);

module.exports = router;
