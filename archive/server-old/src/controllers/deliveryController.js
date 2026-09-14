const db = require('../config/database');

async function getDeliveries(req, res, next) {
  try {
    const deliveries = db.prepare(`
      SELECT d.*, v.vehicle_number, v.cargo_type, u.full_name as driver_name
      FROM deliveries d
      JOIN vehicles v ON d.vehicle_id = v.id
      LEFT JOIN users u ON v.driver_id = u.id
      ORDER BY d.created_at DESC
    `).all();
    res.json({ success: true, deliveries });
  } catch (err) {
    next(err);
  }
}

async function getDeliveryById(req, res, next) {
  try {
    const { id } = req.params;
    const delivery = db.prepare(`
      SELECT d.*, v.vehicle_number, v.cargo_type, u.full_name as driver_name
      FROM deliveries d
      JOIN vehicles v ON d.vehicle_id = v.id
      LEFT JOIN users u ON v.driver_id = u.id
      WHERE d.id = ?
    `).get(id);
    if (!delivery) return res.status(404).json({ error: 'Delivery not found.' });
    res.json({ success: true, delivery });
  } catch (err) {
    next(err);
  }
}

async function updateDeliveryStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    db.prepare(`UPDATE deliveries SET status = ? WHERE id = ?`).run(status, id);
    res.json({ success: true, message: 'Delivery status updated.' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getDeliveries,
  getDeliveryById,
  updateDeliveryStatus
};
