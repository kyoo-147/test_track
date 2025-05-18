const express = require('express');
const router = express.Router();
const controller = require('../controllers/shipController');

router.get('/', controller.getShips);
router.post('/', controller.createShip);
router.put('/:id', controller.updateShip);
router.delete('/:id', controller.deleteShip);

module.exports = router;
