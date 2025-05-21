const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/adminUserController');

router.get('/',    ctrl.getAll);
router.post('/',   ctrl.create);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);

module.exports = router;