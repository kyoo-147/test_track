// controllers/userController.js
const User = require('../models/User');

// Lấy danh sách user, hỗ trợ filter qua query params
exports.getUsers = async (req, res) => {
  const filter = {};
  if (req.query.company)    filter.company = new RegExp(req.query.company, 'i');
  if (req.query.shipName)   filter.shipName = new RegExp(req.query.shipName, 'i');
  if (req.query.role)       filter.role = new RegExp(req.query.role, 'i');
  if (req.query.status)     filter.status = new RegExp(req.query.status, 'i');
  try {
    const users = await User.find(filter);
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err });
  }
};

// Tạo mới user
exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: 'Dữ liệu không hợp lệ', error: err });
  }
};

// Cập nhật user
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!user) return res.status(404).json({ message: 'User không tồn tại' });
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: 'Cập nhật thất bại', error: err });
  }
};

// Xóa user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User không tồn tại' });
    res.json({ message: 'Đã xóa' });
  } catch (err) {
    res.status(400).json({ message: 'Xóa thất bại', error: err });
  }
};
