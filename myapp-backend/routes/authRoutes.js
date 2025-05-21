const express = require('express');
const router = express.Router();
const AdminUser = require('../models/AdminUser');
const Company = require('../models/Company');
const jwt = require('jsonwebtoken');

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await AdminUser.findOne({ username, password }).populate('company', 'name');
  if (!user) return res.status(401).json({ message: 'Sai tài khoản hoặc mật khẩu' });

  // Tạo JWT token
  const payload = {
    _id: user._id,
    username: user.username,
    role: user.role,
    company: user.company?._id || null
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });

  res.json({
    token,
    user: {
      _id: user._id,
      username: user.username,
      role: user.role,
      company: user.company ? { _id: user.company._id, name: user.company.name } : null
    }
  });
});

module.exports = router;