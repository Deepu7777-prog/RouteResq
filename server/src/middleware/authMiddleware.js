const jwt = require('jsonwebtoken');
const db = require('../config/database');

const JWT_SECRET = process.env.JWT_SECRET || 'routeresq_secret_key_sih_2024_ner_protocol';

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied. Authentication token required.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = db.prepare(`SELECT id, full_name, email, role, verification_status, organization, district FROM users WHERE id = ?`).get(decoded.id);

    if (!user) {
      return res.status(401).json({ error: 'Invalid or expired user session.' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid authentication token.' });
  }
}

module.exports = {
  authenticateToken,
  JWT_SECRET
};
