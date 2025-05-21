// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

// Lấy users, chỉ trả về users của công ty Tech nếu là Tech
router.get('/', auth(['Admin', 'Tech']), async (req, res) => {
  if (req.user.role === 'Tech') {
    // Lọc theo company của Tech
    return userController.getUsersByCompany(req, res, req.user.company);
  }
  return userController.getUsers(req, res);
});
router.post('/',   userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
