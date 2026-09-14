const express = require('express');
const router = express.Router();
const { getNotifications, markRead, markAllRead } = require('../controllers/notificationController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.get('/', authenticateToken, getNotifications);
router.patch('/:id/read', authenticateToken, markRead);
router.patch('/read-all', authenticateToken, markAllRead);

module.exports = router;
