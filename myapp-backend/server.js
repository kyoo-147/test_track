// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const companyRoutes = require('./routes/companyRoutes');
const shipRoutes    = require('./routes/shipRoutes');
const userRoutes    = require('./routes/userRoutes');
const speedRoutes = require('./routes/speedRoutes');
const packageRoutes = require('./routes/packageRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

// Mount các route riêng biệt
app.use('/api/companies', companyRoutes);
app.use('/api/ships',     shipRoutes);
app.use('/api/users',     userRoutes);
app.use('/api/speeds',    speedRoutes);
app.use('/api/packages',  packageRoutes);
app.use('/api/dashboard', dashboardRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
