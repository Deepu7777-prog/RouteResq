const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/authRoutes');
const incidentRoutes = require('./routes/incidentRoutes');
const roadRoutes = require('./routes/roadRoutes');
const routeRoutes = require('./routes/routeRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
const deliveryRoutes = require('./routes/deliveryRoutes');
const errorHandler = require('./middleware/errorMiddleware');
const db = require('./config/database');
const { calculateShortestPath } = require('./services/routeOptimizationService');

const app = express();

app.use(cors());
app.use(express.json());

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    platform: 'RouteResQ AI Smart Logistics API',
    organization: 'Ministry of Development of North Eastern Region (MDoNER)',
    timestamp: new Date().toISOString()
  });
});

// Backward Compatibility Endpoint: /api/state
app.get('/api/state', (req, res) => {
  try {
    const users = db.prepare('SELECT * FROM users').all();
    const roads = db.prepare('SELECT * FROM roads').all();
    const vehicles = db.prepare('SELECT * FROM vehicles').all();
    const incidents = db.prepare('SELECT * FROM incidents ORDER BY created_at DESC').all();
    const deliveries = db.prepare('SELECT * FROM deliveries').all();
    const notifications = db.prepare('SELECT * FROM notifications ORDER BY created_at DESC').all();

    const formattedRoads = roads.map(r => ({
      ...r,
      u: r.start_location,
      v: r.end_location,
      distanceKm: r.distance_km,
      riskScore: r.risk_score,
      name: r.road_name
    }));

    const trk001Route = calculateShortestPath('A', 'D', formattedRoads);

    const formattedVehicles = vehicles.map(v => {
      const isAffected = formattedRoads.some(r => (r.status === 'BLOCKED' || r.status === 'HIGH_RISK') && r.id === 'R02');
      return {
        id: v.id,
        driverName: 'Rajesh Kumar (DRV001)',
        cargo: v.cargo_type,
        origin: 'Guwahati Hub (Node A)',
        destination: 'Silchar Remote District (Node D)',
        originNode: 'A',
        destinationNode: 'D',
        currentLocation: 'En route near Nongpoh Checkpoint',
        status: 'ON ROUTE',
        routeStatus: isAffected ? 'BLOCKED' : 'SAFE',
        isAffected: isAffected,
        activeRoute: trk001Route,
        alternativeRoute: isAffected ? calculateShortestPath('A', 'D', formattedRoads) : null,
        acceptedAlternative: false
      };
    });

    res.json({
      demoStep: 1,
      users: users.map(u => ({ username: u.email, role: u.role.toLowerCase(), name: u.full_name, title: u.organization })),
      roads: formattedRoads,
      nodes: require('./services/routeOptimizationService').NODES,
      vehicles: formattedVehicles,
      incidents: incidents.map(i => ({
        id: i.id,
        type: i.incident_type,
        roadId: i.road_id,
        roadName: roads.find(r => r.id === i.road_id)?.road_name || 'NH-40',
        severity: i.severity,
        status: i.status,
        description: i.description,
        reportedBy: i.reportedBy || i.reported_by,
        timestamp: i.created_at
      })),
      alerts: notifications.map(n => ({
        id: n.id,
        timestamp: n.created_at,
        title: n.title,
        message: n.message,
        type: n.type === 'WARNING' ? 'danger' : 'info',
        targetRole: 'all'
      })),
      riskZones: [
        { id: 'RZ-01', name: 'Nongpoh-Shillong Slope Zone', riskLevel: 'HIGH', vulnerability: 'Landslide Prone', activeIncidents: 1 },
        { id: 'RZ-02', name: 'Dima Hasao Haflong Corridor', riskLevel: 'MEDIUM', vulnerability: 'Flash Flood Prone', activeIncidents: 0 }
      ]
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Backward Compatibility Endpoint: /api/reset
app.post('/api/reset', (req, res) => {
  const seed = require('./seed');
  seed();
  res.json({ success: true, message: 'Database reset to initial safe state.' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/incidents', incidentRoutes);
app.use('/api/roads', roadRoutes);
app.use('/api/routes', routeRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/deliveries', deliveryRoutes);

// Global Error Middleware
app.use(errorHandler);

module.exports = app;
