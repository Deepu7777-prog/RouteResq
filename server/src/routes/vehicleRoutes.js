const express = require('express');
const router = express.Router();
const { getVehicles, getVehicleById, updateVehicleLocation } = require('../controllers/vehicleController');

router.get('/', getVehicles);
router.get('/:id', getVehicleById);
router.patch('/:id/location', updateVehicleLocation);

module.exports = router;
