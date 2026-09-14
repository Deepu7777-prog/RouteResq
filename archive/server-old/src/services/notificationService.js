/**
 * RouteResQ DB-Backed Notification Service
 * Stores user notifications in SQLite database and retrieves notification counts & lists.
 */

const db = require('../config/database');

function createNotification({ userId, title, message, type = 'SYSTEM' }) {
  const id = `ALT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const stmt = db.prepare(`
    INSERT INTO notifications (id, user_id, title, message, type, is_read, created_at)
    VALUES (?, ?, ?, ?, ?, 0, CURRENT_TIMESTAMP)
  `);
  stmt.run(id, userId, title, message, type);
  return { id, userId, title, message, type, is_read: 0, created_at: new Date().toISOString() };
}

function notifyRole(role, title, message, type = 'SYSTEM') {
  const users = db.prepare(`SELECT id FROM users WHERE role = ? OR role = 'ADMIN'`).all(role);
  const created = [];
  users.forEach(u => {
    created.push(createNotification({ userId: u.id, title, message, type }));
  });
  return created;
}

function getUserNotifications(userId) {
  return db.prepare(`
    SELECT * FROM notifications
    WHERE user_id = ?
    ORDER BY created_at DESC
  `).all(userId);
}

function markNotificationRead(id, userId) {
  db.prepare(`UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?`).run(id, userId);
}

function markAllNotificationsRead(userId) {
  db.prepare(`UPDATE notifications SET is_read = 1 WHERE user_id = ?`).run(userId);
}

module.exports = {
  createNotification,
  notifyRole,
  getUserNotifications,
  markNotificationRead,
  markAllNotificationsRead
};
