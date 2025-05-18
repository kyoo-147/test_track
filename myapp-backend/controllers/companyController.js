const Company = require('../models/Company');

exports.getCompanies = async (req, res) => {
  const filter = req.query.q ? { name: new RegExp(req.query.q, 'i') } : {};
  const comps = await Company.find(filter);
  res.json(comps);
};

exports.createCompany = async (req, res) => {
  const comp = await Company.create(req.body);
  res.status(201).json(comp);
};

exports.updateCompany = async (req, res) => {
  const comp = await Company.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!comp) return res.status(404).json({ message: 'Company not found' });
  res.json(comp);
};

exports.deleteCompany = async (req, res) => {
  const comp = await Company.findByIdAndDelete(req.params.id);
  if (!comp) return res.status(404).json({ message: 'Company not found' });
  res.json({ message: 'Deleted' });
};
