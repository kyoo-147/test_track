// controllers/userController.js
const User = require('../models/User');

// GET /api/users
exports.getUsers = async (req, res) => {
  try {
    const filter = {};
    if (req.query.role)   filter.role   = new RegExp(req.query.role, 'i');
    if (req.query.status) filter.status = new RegExp(req.query.status, 'i');
    const users = await User.find(filter)
      .populate('ship', 'shipName')
      .populate('pkg',  'name volume');
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err });
  }
};

// POST /api/users
exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    // Dùng populate trực tiếp, không execPopulate()
    await user.populate('ship', 'shipName');
    await user.populate('pkg', 'name volume');
    res.status(201).json(user);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Invalid data: ' + err.message, error: err });
  }
};

// PUT /api/users/:id
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Populate sau khi update
    await user.populate('ship', 'shipName');
    await user.populate('pkg', 'name volume');
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Update failed: ' + err.message, error: err });
  }
};

// DELETE /api/users/:id
exports.deleteUser = async (req, res) => {
  try {
    const u = await User.findByIdAndDelete(req.params.id);
    if (!u) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Delete failed: ' + err.message, error: err });
  }
};
