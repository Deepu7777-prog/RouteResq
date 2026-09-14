const express = require('express');
const router = express.Router();
const { getRoads, getRoadById, updateRoadStatus } = require('../controllers/roadController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { requireRoles } = require('../middleware/roleMiddleware');

router.get('/', getRoads);
router.get('/:id', getRoadById);
router.patch('/:id/status', authenticateToken, requireRoles('AUTHORITY', 'ADMIN'), updateRoadStatus);

module.exports = router;
