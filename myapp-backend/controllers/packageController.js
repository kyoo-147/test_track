// controllers/packageController.js
const Package = require('../models/Package');

// GET tất cả (có filter)
exports.getPackages = async (req, res) => {
  const filter = {};
  if (req.query.id)       filter._id       = req.query.id;
  if (req.query.name)     filter.name      = new RegExp(req.query.name, 'i');
  try {
    const list = await Package.find(filter);
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

// POST tạo mới
exports.createPackage = async (req, res) => {
  try {
    const pkg = await Package.create(req.body);
    res.status(201).json(pkg);
  } catch (err) {
    res.status(400).json({ message: 'Invalid data', error: err });
  }
};

// PUT cập nhật
exports.updatePackage = async (req, res) => {
  try {
    const pkg = await Package.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!pkg) return res.status(404).json({ message: 'Not found' });
    res.json(pkg);
  } catch (err) {
    res.status(400).json({ message: 'Update failed', error: err });
  }
};

// DELETE
exports.deletePackage = async (req, res) => {
  try {
    const pkg = await Package.findByIdAndDelete(req.params.id);
    if (!pkg) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(400).json({ message: 'Delete failed', error: err });
  }
};
