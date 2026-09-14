const db = require('../config/database');

async function getVehicles(req, res, next) {
  try {
    const vehicles = db.prepare(`
      SELECT v.*, u.full_name as driver_name
      FROM vehicles v
      LEFT JOIN users u ON v.driver_id = u.id
    `).all();
    res.json({ success: true, vehicles });
  } catch (err) {
    next(err);
  }
}

async function getVehicleById(req, res, next) {
  try {
    const { id } = req.params;
    const vehicle = db.prepare(`
      SELECT v.*, u.full_name as driver_name
      FROM vehicles v
      LEFT JOIN users u ON v.driver_id = u.id
      WHERE v.id = ?
    `).get(id);
    if (!vehicle) return res.status(404).json({ error: 'Vehicle not found.' });
    res.json({ success: true, vehicle });
  } catch (err) {
    next(err);
  }
}

async function updateVehicleLocation(req, res, next) {
  try {
    const { id } = req.params;
    const { latitude, longitude } = req.body;
    db.prepare(`UPDATE vehicles SET current_latitude = ?, current_longitude = ? WHERE id = ?`).run(latitude, longitude, id);
    res.json({ success: true, message: 'Vehicle location updated.' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getVehicles,
  getVehicleById,
  updateVehicleLocation
};
