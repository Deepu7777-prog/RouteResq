const db = require('../config/database');

async function getRoads(req, res, next) {
  try {
    const roads = db.prepare('SELECT * FROM roads ORDER BY id ASC').all();
    res.json({ success: true, roads });
  } catch (err) {
    next(err);
  }
}

async function getRoadById(req, res, next) {
  try {
    const { id } = req.params;
    const road = db.prepare('SELECT * FROM roads WHERE id = ?').get(id);
    if (!road) return res.status(404).json({ error: 'Road not found.' });
    res.json({ success: true, road });
  } catch (err) {
    next(err);
  }
}

async function updateRoadStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status, risk_score } = req.body;
    db.prepare(`UPDATE roads SET status = ?, risk_score = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`)
      .run(status, risk_score || 15, id);
    res.json({ success: true, message: 'Road status updated.' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getRoads,
  getRoadById,
  updateRoadStatus
};
