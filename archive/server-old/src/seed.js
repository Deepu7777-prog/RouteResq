const bcrypt = require('bcryptjs');
const db = require('./config/database');

async function seedDatabase() {
  console.log('[RouteResQ Database Seeder] Seeding initial dataset...');

  const passwordHash = await bcrypt.hash('demo123', 10);

  // 1. Seed Demo Users
  const insertUser = db.prepare(`
    INSERT OR REPLACE INTO users (id, full_name, email, mobile, password_hash, role, verification_status, organization, district, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, 'VERIFIED', ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  `);

  insertUser.run('USR-DRV-001', 'Rajesh Kumar (DRV001)', 'driver@routeresq.demo', '+91 98765 43210', passwordHash, 'DRIVER', 'NER Relief Transport', 'Kamrup');
  insertUser.run('USR-LOG-001', 'Animesh Das', 'logistics@routeresq.demo', '+91 98765 43211', passwordHash, 'LOGISTICS', 'NER Logistics Operations', 'Guwahati');
  insertUser.run('USR-AUTH-001', 'Commander P. Baruah', 'authority@routeresq.demo', '+91 98765 43212', passwordHash, 'AUTHORITY', 'MDoNER Disaster Infrastructure', 'Regional Command');
  insertUser.run('USR-FLD-001', 'Officer T. Sangma', 'field@routeresq.demo', '+91 98765 43213', passwordHash, 'FIELD_OFFICER', 'Ri-Bhoi Patrol Unit', 'Ri-Bhoi');
  
  // Also seed short username emails for quick login fallback
  insertUser.run('USR-DRV-DEMO', 'Rajesh Kumar (DRV001)', 'driver_demo', '+91 98765 43210', passwordHash, 'DRIVER', 'NER Relief Transport', 'Kamrup');
  insertUser.run('USR-LOG-DEMO', 'Animesh Das', 'logistics_demo', '+91 98765 43211', passwordHash, 'LOGISTICS', 'NER Logistics Operations', 'Guwahati');
  insertUser.run('USR-AUTH-DEMO', 'Commander P. Baruah', 'authority_demo', '+91 98765 43212', passwordHash, 'AUTHORITY', 'MDoNER Disaster Infrastructure', 'Regional Command');
  insertUser.run('USR-FLD-DEMO', 'Officer T. Sangma', 'field_demo', '+91 98765 43213', passwordHash, 'FIELD_OFFICER', 'Ri-Bhoi Patrol Unit', 'Ri-Bhoi');

  // 2. Seed Roads
  const insertRoad = db.prepare(`
    INSERT OR REPLACE INTO roads (id, road_name, start_location, end_location, distance_km, status, risk_score, latitude, longitude, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
  `);

  insertRoad.run('R01', 'NH-40 Guwahati-Nongpoh Segment', 'A', 'B', 52, 'SAFE', 15, 26.02, 91.80);
  insertRoad.run('R02', 'NH-40 Nongpoh-Shillong Pass', 'B', 'C', 48, 'SAFE', 20, 25.75, 91.88);
  insertRoad.run('R03', 'NH-6 Shillong-Silchar Highway', 'C', 'D', 210, 'SAFE', 25, 25.20, 92.30);
  insertRoad.run('R04', 'NH-27 Guwahati-Nagaon East', 'A', 'E', 120, 'SAFE', 10, 26.24, 92.21);
  insertRoad.run('R05', 'NH-27 Nagaon-Haflong Pass', 'E', 'F', 150, 'SAFE', 18, 25.76, 92.84);
  insertRoad.run('R06', 'NH-27 Haflong-Silchar Link', 'F', 'D', 105, 'SAFE', 22, 25.00, 92.89);
  insertRoad.run('R07', 'NH-15 Guwahati-Tezpur Corridor', 'A', 'G', 175, 'CAUTION', 45, 26.45, 92.20);

  // 3. Seed Vehicles
  const insertVehicle = db.prepare(`
    INSERT OR REPLACE INTO vehicles (id, vehicle_number, driver_id, logistics_manager_id, cargo_type, current_latitude, current_longitude, status, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'ACTIVE', CURRENT_TIMESTAMP)
  `);

  insertVehicle.run('TRK001', 'AS-01-HC-4092', 'USR-DRV-001', 'USR-LOG-001', 'Essential Medicines & Vaccines', 25.9004, 91.8804);
  insertVehicle.run('TRK002', 'AS-01-HC-8812', 'USR-DRV-001', 'USR-LOG-001', 'Disaster Relief Rations', 26.3462, 92.6841);
  insertVehicle.run('TRK003', 'AS-01-HC-3301', 'USR-DRV-001', 'USR-LOG-001', 'Emergency Medical Oxygen Cylinders', 26.4500, 92.2000);

  // 4. Seed Deliveries
  const insertDelivery = db.prepare(`
    INSERT OR REPLACE INTO deliveries (id, vehicle_id, cargo_type, source, destination, status, current_route, estimated_arrival, created_at)
    VALUES (?, ?, ?, ?, ?, 'ACTIVE', ?, ?, CURRENT_TIMESTAMP)
  `);

  insertDelivery.run('DEL-101', 'TRK001', 'Essential Medicines & Vaccines', 'Guwahati Hub (Node A)', 'Silchar Remote District (Node D)', 'Guwahati (A) → Nongpoh (B) → Shillong (C) → Silchar (D)', '3h 20m');

  // 5. Seed Initial Notifications
  const insertNotif = db.prepare(`
    INSERT OR REPLACE INTO notifications (id, user_id, title, message, type, is_read, created_at)
    VALUES (?, ?, ?, ?, ?, 0, CURRENT_TIMESTAMP)
  `);

  insertNotif.run('ALT-SEED-1', 'USR-AUTH-001', 'System Initialization', 'RouteResQ Command Engine online. All NER primary transit nodes connected.', 'SYSTEM');
  insertNotif.run('ALT-SEED-2', 'USR-LOG-001', 'Delivery Dispatch', 'TRK001 carrying Essential Medicines dispatched from Guwahati to Silchar.', 'DELIVERY');
  insertNotif.run('ALT-SEED-3', 'USR-DRV-001', 'Assigned Trip Active', 'TRK001 assigned route A-B-C-D. Current road status SAFE.', 'ROUTE_UPDATE');

  console.log('[RouteResQ Database Seeder] Seeding completed successfully!');
}

if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
