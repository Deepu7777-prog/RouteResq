const { getUserNotifications, markNotificationRead, markAllNotificationsRead } = require('../services/notificationService');

async function getNotifications(req, res, next) {
  try {
    const notifications = getUserNotifications(req.user.id);
    const unreadCount = notifications.filter(n => n.is_read === 0).length;
    res.json({ success: true, notifications, unreadCount });
  } catch (err) {
    next(err);
  }
}

async function markRead(req, res, next) {
  try {
    const { id } = req.params;
    markNotificationRead(id, req.user.id);
    res.json({ success: true, message: 'Notification marked read.' });
  } catch (err) {
    next(err);
  }
}

async function markAllRead(req, res, next) {
  try {
    markAllNotificationsRead(req.user.id);
    res.json({ success: true, message: 'All notifications marked read.' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getNotifications,
  markRead,
  markAllRead
};
