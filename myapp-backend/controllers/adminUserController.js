const AdminUser = require('../models/AdminUser');

// Lấy danh sách admin users
exports.getAll = async (req, res) => {
  const users = await AdminUser.find().populate('company', 'name');
  res.json(users);
};

// Tạo mới
exports.create = async (req, res) => {
  try {
    const user = await AdminUser.create(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: 'Invalid data', error: err });
  }
};

// Sửa
exports.update = async (req, res) => {
  try {
    const user = await AdminUser.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!user) return res.status(404).json({ message: 'Not found' });
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: 'Update failed', error: err });
  }
};

// Xóa
exports.remove = async (req, res) => {
  try {
    const user = await AdminUser.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(400).json({ message: 'Delete failed', error: err });
  }
};