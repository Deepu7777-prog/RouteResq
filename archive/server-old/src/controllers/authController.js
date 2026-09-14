const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const { JWT_SECRET } = require('../middleware/authMiddleware');

async function register(req, res, next) {
  try {
    const { full_name, email, mobile, password, role, organization, district } = req.body;

    if (!full_name || !email || !password || !role) {
      return res.status(400).json({ error: 'Missing required registration fields.' });
    }

    const validRoles = ['DRIVER', 'LOGISTICS', 'AUTHORITY', 'FIELD_OFFICER', 'ADMIN'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: 'Invalid role selected.' });
    }

    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) {
      return res.status(400).json({ error: 'Email is already registered.' });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const id = `USR-${Date.now()}`;

    db.prepare(`
      INSERT INTO users (id, full_name, email, mobile, password_hash, role, verification_status, organization, district, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, 'VERIFIED', ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `).run(id, full_name, email, mobile || '', password_hash, role, organization || '', district || '');

    const token = jwt.sign({ id, email, role }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      success: true,
      message: 'Registration successful.',
      token,
      user: { id, full_name, email, role, verification_status: 'VERIFIED', organization, district }
    });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email/Username and password required.' });
    }

    // Support email or demo username matching
    let user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    
    // Support demo logins if username provided without @
    if (!user && !email.includes('@')) {
      user = db.prepare('SELECT * FROM users WHERE email = ?').get(`${email}@routeresq.demo`);
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials. User not found.' });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match && password !== 'demo123') { // Fallback demo password check
      return res.status(401).json({ error: 'Invalid credentials. Password mismatch.' });
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    const safeUser = {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      role: user.role,
      verification_status: user.verification_status,
      organization: user.organization,
      district: user.district
    };

    res.json({
      success: true,
      token,
      user: safeUser
    });
  } catch (err) {
    next(err);
  }
}

async function getCurrentUser(req, res, next) {
  try {
    res.json({ success: true, user: req.user });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  register,
  login,
  getCurrentUser
};
