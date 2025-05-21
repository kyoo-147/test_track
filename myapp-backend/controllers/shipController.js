// controllers/shipController.js
const Ship = require('../models/Ship');

exports.getShips = async (req, res) => {
  try {
    const filter = {};
    if (req.query.company) filter.company = new RegExp(req.query.company, 'i');
    if (req.query.shipName) filter.shipName = new RegExp(req.query.shipName, 'i');
    const ships = await Ship.find(filter).populate('company');
    res.json(ships); // Trả về nguyên bản, installationDate là Date
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch ships', error });
  }
};

exports.createShip = async (req, res) => {
  try {
    const ship = await Ship.create(req.body);
    res.status(201).json(ship);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create ship', error });
  }
};

exports.updateShip = async (req, res) => {
  try {
    const ship = await Ship.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!ship) return res.status(404).json({ message: 'Ship not found' });
    res.json(ship);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update ship', error });
  }
};

exports.deleteShip = async (req, res) => {
  try {
    const ship = await Ship.findByIdAndDelete(req.params.id);
    if (!ship) return res.status(404).json({ message: 'Ship not found' });
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete ship', error });
  }
};
