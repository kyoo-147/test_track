const SpeedSetting = require('../models/SpeedSetting');

exports.getAll = async (req, res) => {
  try {
    const list = await SpeedSetting.find();
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

exports.create = async (req, res) => {
  try {
    const item = await SpeedSetting.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ message: 'Invalid data', error: err });
  }
};

exports.update = async (req, res) => {
  try {
    const item = await SpeedSetting.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(400).json({ message: 'Update failed', error: err });
  }
};

exports.remove = async (req, res) => {
  try {
    const item = await SpeedSetting.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(400).json({ message: 'Delete failed', error: err });
  }
};
