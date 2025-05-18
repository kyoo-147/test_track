// routes/packageRoutes.js
const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/packageController');

router.get('/',    ctrl.getPackages);
router.post('/',   ctrl.createPackage);
router.put('/:id', ctrl.updatePackage);
router.delete('/:id', ctrl.deletePackage);

module.exports = router;
