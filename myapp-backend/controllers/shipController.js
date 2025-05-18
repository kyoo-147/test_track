const Ship = require('../models/Ship');

exports.getShips = async (req, res) => {
  const filter = {};
  if (req.query.company) filter.company = new RegExp(req.query.company, 'i');
  if (req.query.shipName) filter.shipName = new RegExp(req.query.shipName, 'i');
  const ships = await Ship.find(filter);
  res.json(ships);
};

exports.createShip = async (req, res) => {
  const ship = await Ship.create(req.body);
  res.status(201).json(ship);
};

exports.updateShip = async (req, res) => {
  const ship = await Ship.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!ship) return res.status(404).json({ message: 'Ship not found' });
  res.json(ship);
};

exports.deleteShip = async (req, res) => {
  const ship = await Ship.findByIdAndDelete(req.params.id);
  if (!ship) return res.status(404).json({ message: 'Ship not found' });
  res.json({ message: 'Deleted' });
};
