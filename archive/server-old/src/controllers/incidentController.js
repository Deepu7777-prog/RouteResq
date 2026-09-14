const db = require('../config/database');
const { calculateRoadRisk } = require('../services/riskAnalysisService');
const { calculateShortestPath } = require('../services/routeOptimizationService');
const { notifyRole, createNotification } = require('../services/notificationService');

async function createIncident(req, res, next) {
  try {
    const { incident_type, description, severity, road_id, latitude, longitude, image_url } = req.body;

    if (!incident_type || !road_id || !severity) {
      return res.status(400).json({ error: 'Missing required incident fields: incident_type, road_id, severity.' });
    }

    const road = db.prepare('SELECT * FROM roads WHERE id = ?').get(road_id);
    if (!road) {
      return res.status(404).json({ error: `Road ${road_id} not found.` });
    }

    const incidentId = `INC-${Date.now().toString().slice(-4)}`;
    const reportedBy = req.user ? req.user.full_name : 'Field Officer';

    db.prepare(`
      INSERT INTO incidents (id, incident_type, description, severity, road_id, reported_by, latitude, longitude, image_url, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `).run(incidentId, incident_type, description || '', severity, road_id, reportedBy, latitude || road.latitude, longitude || road.longitude, image_url || null);

    // Get all active incidents for this road
    const activeIncidents = db.prepare(`SELECT * FROM incidents WHERE road_id = ? AND status = 'ACTIVE'`).all(road_id);
    
    // 1. Calculate Risk Analysis
    const riskEval = calculateRoadRisk(road.risk_score, activeIncidents, 'HEAVY_RAIN');

    // 2. Update Road Status & Risk Score in Database
    db.prepare(`UPDATE roads SET status = ?, risk_score = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`)
      .run(riskEval.status, riskEval.riskScore, road_id);

    // 3. Identify Affected Deliveries & Vehicles
    const allRoads = db.prepare(`SELECT * FROM roads`).all();
    const activeDeliveries = db.prepare(`SELECT * FROM deliveries WHERE status IN ('ACTIVE', 'DELAYED', 'REROUTED')`).all();
    const affectedDeliveries = [];

    activeDeliveries.forEach(del => {
      // Check if delivery route uses the disrupted road
      if (del.current_route && del.current_route.includes(road_id) && (riskEval.status === 'BLOCKED' || riskEval.status === 'HIGH_RISK')) {
        // Run Dijkstra to find alternative bypass route
        const newRouteResult = calculateShortestPath('A', 'D', allRoads);
        
        if (newRouteResult.success) {
          // Update delivery status in DB
          db.prepare(`UPDATE deliveries SET status = 'REROUTED' WHERE id = ?`).run(del.id);

          // Save new recommended route in routes table
          const routeId = `RTE-${Date.now()}`;
          db.prepare(`
            INSERT INTO routes (id, delivery_id, route_data, distance_km, estimated_time, risk_score, is_recommended, created_at)
            VALUES (?, ?, ?, ?, ?, ?, 1, CURRENT_TIMESTAMP)
          `).run(routeId, del.id, JSON.stringify(newRouteResult), newRouteResult.totalDistanceKm, newRouteResult.etaFormatted, riskEval.riskScore);

          affectedDeliveries.push({ delivery: del, alternativeRoute: newRouteResult });

          // Notify vehicle driver
          const vehicle = db.prepare(`SELECT * FROM vehicles WHERE id = ?`).get(del.vehicle_id);
          if (vehicle && vehicle.driver_id) {
            createNotification({
              userId: vehicle.driver_id,
              title: '🚨 ROUTE DISRUPTION DETECTED',
              message: `${road.road_name} is ${riskEval.status}. Recalculated bypass route via Nagaon-Haflong available.`,
              type: 'ROUTE_UPDATE'
            });
          }
        }
      }
    });

    // 4. Generate DB Notifications for Roles
    notifyRole('AUTHORITY', `⚠ NEW INCIDENT: ${incident_type}`, `${severity} severity report on ${road.road_name}. Status: ${riskEval.status}.`, 'INCIDENT');
    notifyRole('LOGISTICS', `🚨 DELIVERY AFFECTED`, `Landslide on ${road.road_name} affects essential delivery route. Reroute computed.`, 'WARNING');

    res.json({
      success: true,
      message: 'Incident reported and processed successfully.',
      incident: { id: incidentId, incident_type, road_id, severity, road_name: road.road_name },
      riskAnalysis: riskEval,
      affectedCount: affectedDeliveries.length
    });
  } catch (err) {
    next(err);
  }
}

async function getIncidents(req, res, next) {
  try {
    const incidents = db.prepare(`
      SELECT i.*, r.road_name
      FROM incidents i
      JOIN roads r ON i.road_id = r.id
      ORDER BY i.created_at DESC
    `).all();
    res.json({ success: true, incidents });
  } catch (err) {
    next(err);
  }
}

async function updateIncidentStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    db.prepare(`UPDATE incidents SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`).run(status, id);

    const inc = db.prepare('SELECT * FROM incidents WHERE id = ?').get(id);
    if (inc && status === 'RESOLVED') {
      // Restore road status if no other active incidents
      const active = db.prepare(`SELECT * FROM incidents WHERE road_id = ? AND status = 'ACTIVE'`).all(inc.road_id);
      if (active.length === 0) {
        db.prepare(`UPDATE roads SET status = 'SAFE', risk_score = 15 WHERE id = ?`).run(inc.road_id);
      }
    }

    res.json({ success: true, message: 'Incident status updated.' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createIncident,
  getIncidents,
  updateIncidentStatus
};
