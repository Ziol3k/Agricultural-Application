const express = require('express');
const router = express.Router();
const machineController = require('../controllers/machineController'); 

router.get('/', machineController.showMachines);
router.get('/:id', machineController.showMachineDetails);

module.exports = router;
