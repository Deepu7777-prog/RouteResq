const express = require('express');
const router = express.Router();
const { getDeliveries, getDeliveryById, updateDeliveryStatus } = require('../controllers/deliveryController');

router.get('/', getDeliveries);
router.get('/:id', getDeliveryById);
router.patch('/:id/status', updateDeliveryStatus);

module.exports = router;
