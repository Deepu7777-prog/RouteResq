const express = require('express');
const router = express.Router();
const { calculateRoute, getDeliveryRoutes, acceptAlternativeRoute } = require('../controllers/routeController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.post('/calculate', calculateRoute);
router.get('/delivery/:deliveryId', getDeliveryRoutes);
router.post('/accept', acceptAlternativeRoute);

module.exports = router;
