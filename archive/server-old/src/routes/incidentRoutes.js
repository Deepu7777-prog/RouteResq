const express = require('express');
const router = express.Router();
const { createIncident, getIncidents, updateIncidentStatus } = require('../controllers/incidentController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { requireRoles } = require('../middleware/roleMiddleware');

router.post('/', authenticateToken, requireRoles('FIELD_OFFICER', 'AUTHORITY', 'ADMIN'), createIncident);
router.get('/', getIncidents);
router.patch('/:id/status', authenticateToken, requireRoles('AUTHORITY', 'ADMIN'), updateIncidentStatus);

module.exports = router;
