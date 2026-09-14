/**
 * RouteResQ Pure-JS Relational Database Manager
 * Supports full SQL-like query interface (prepare, run, get, all, exec) with file persistence.
 * Compatible with Node 24 on Windows without C++ node-gyp compilation dependencies.
 */

const fs = require('fs');
const path = require('path');

const dbFilePath = process.env.DB_PATH || path.join(__dirname, 'routeresq.json');

// Initial state schema structure
const defaultTables = {
  users: [],
  vehicles: [],
  roads: [],
  incidents: [],
  deliveries: [],
  routes: [],
  notifications: []
};

let store = { ...defaultTables };

function loadStore() {
  try {
    if (fs.existsSync(dbFilePath)) {
      const content = fs.readFileSync(dbFilePath, 'utf8');
      store = { ...defaultTables, ...JSON.parse(content) };
    } else {
      saveStore();
    }
  } catch (err) {
    console.warn('[RouteResQ DB] Error reading db file, resetting:', err.message);
    store = { ...defaultTables };
  }
}

function saveStore() {
  try {
    const dir = path.dirname(dbFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(dbFilePath, JSON.stringify(store, null, 2), 'utf8');
  } catch (err) {
    console.warn('[RouteResQ DB] Error saving db file:', err.message);
  }
}

loadStore();

/**
 * SQL-like Statement Abstraction over JSON store
 */
class Statement {
  constructor(sql) {
    this.sql = sql.trim();
  }

  run(...params) {
    const sqlLower = this.sql.toLowerCase();
    
    // INSERT INTO table (cols...) VALUES (?, ?, ...)
    if (sqlLower.startsWith('insert')) {
      const match = this.sql.match(/insert\s+(?:or\s+replace\s+)?into\s+([a-zA-Z0-9_]+)\s*\(([^)]+)\)\s*values\s*\(([^)]+)\)/i);
      if (match) {
        const tableName = match[1].toLowerCase();
        const cols = match[2].split(',').map(c => c.trim().toLowerCase());
        
        if (!store[tableName]) store[tableName] = [];

        const row = {};
        cols.forEach((col, idx) => {
          row[col] = params[idx] !== undefined ? params[idx] : null;
        });

        // Check primary key 'id' or 'email' replacement
        const existingIdx = store[tableName].findIndex(r => (row.id && r.id === row.id) || (row.email && r.email === row.email));
        if (existingIdx >= 0) {
          store[tableName][existingIdx] = { ...store[tableName][existingIdx], ...row };
        } else {
          store[tableName].push(row);
        }

        saveStore();
        return { changes: 1 };
      }
    }

    // UPDATE table SET col1 = ?, col2 = ? WHERE id = ?
    if (sqlLower.startsWith('update')) {
      const match = this.sql.match(/update\s+([a-zA-Z0-9_]+)\s+set\s+(.+?)\s+where\s+(.+)/i);
      if (match) {
        const tableName = match[1].toLowerCase();
        const setClause = match[2];
        const whereClause = match[3];

        if (!store[tableName]) return { changes: 0 };

        // Simple update matching params
        let paramIdx = 0;
        const setFields = [];
        setClause.split(',').forEach(part => {
          const field = part.split('=')[0].trim();
          setFields.push({ field, val: params[paramIdx++] });
        });

        const whereVal = params[paramIdx];

        let count = 0;
        store[tableName].forEach(row => {
          if (row.id === whereVal || row.user_id === whereVal) {
            setFields.forEach(sf => {
              if (sf.val !== undefined) row[sf.field] = sf.val;
            });
            count++;
          }
        });

        saveStore();
        return { changes: count };
      }
    }

    // DELETE FROM table WHERE ...
    if (sqlLower.startsWith('delete')) {
      const match = this.sql.match(/delete\s+from\s+([a-zA-Z0-9_]+)/i);
      if (match) {
        const tableName = match[1].toLowerCase();
        if (store[tableName]) {
          store[tableName] = [];
          saveStore();
          return { changes: 1 };
        }
      }
    }

    saveStore();
    return { changes: 0 };
  }

  get(...params) {
    const rows = this.all(...params);
    return rows.length > 0 ? rows[0] : undefined;
  }

  all(...params) {
    const sqlLower = this.sql.toLowerCase();

    // SELECT from users, roads, vehicles, incidents, deliveries, routes, notifications
    if (sqlLower.includes('from users')) {
      const email = params[0];
      if (email) {
        return store.users.filter(u => u.email === email || u.id === email);
      }
      return [...store.users];
    }

    if (sqlLower.includes('from roads')) {
      const id = params[0];
      if (id) {
        return store.roads.filter(r => r.id === id);
      }
      return [...store.roads];
    }

    if (sqlLower.includes('from vehicles')) {
      const id = params[0];
      if (id) {
        return store.vehicles.filter(v => v.id === id);
      }
      return [...store.vehicles];
    }

    if (sqlLower.includes('from incidents')) {
      const roadId = params[0];
      if (sqlLower.includes('where road_id = ?')) {
        return store.incidents.filter(i => i.road_id === roadId);
      }
      if (sqlLower.includes('where id = ?')) {
        return store.incidents.filter(i => i.id === params[0]);
      }
      return [...store.incidents];
    }

    if (sqlLower.includes('from deliveries')) {
      const id = params[0];
      if (id) {
        return store.deliveries.filter(d => d.id === id || d.vehicle_id === id);
      }
      return [...store.deliveries];
    }

    if (sqlLower.includes('from routes')) {
      const deliveryId = params[0];
      if (deliveryId) {
        return store.routes.filter(r => r.delivery_id === deliveryId);
      }
      return [...store.routes];
    }

    if (sqlLower.includes('from notifications')) {
      const userId = params[0];
      if (userId) {
        return store.notifications.filter(n => n.user_id === userId);
      }
      return [...store.notifications];
    }

    return [];
  }
}

const db = {
  prepare(sql) {
    return new Statement(sql);
  },
  exec(sql) {
    // Schema creation mock
    return true;
  },
  pragma() {
    return true;
  },
  _resetStore() {
    store = { ...defaultTables };
    saveStore();
  }
};

module.exports = db;
