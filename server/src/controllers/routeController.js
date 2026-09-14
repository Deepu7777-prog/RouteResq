const db = require('../config/database');
const { calculateShortestPath } = require('../services/routeOptimizationService');
const { createNotification } = require('../services/notificationService');

async function calculateRoute(req, res, next) {
  try {
    const { startNode, endNode, blockedRoadIds = [] } = req.body;
    const roads = db.prepare('SELECT * FROM roads').all();

    const modifiedRoads = roads.map(r => {
      if (blockedRoadIds.includes(r.id)) {
        return { ...r, status: 'BLOCKED', risk_score: 100 };
      }
      return r;
    });

    const routeResult = calculateShortestPath(startNode || 'A', endNode || 'D', modifiedRoads);
    res.json({ success: true, ...routeResult });
  } catch (err) {
    next(err);
  }
}

async function getDeliveryRoutes(req, res, next) {
  try {
    const { deliveryId } = req.params;
    const routes = db.prepare('SELECT * FROM routes WHERE delivery_id = ? ORDER BY created_at DESC').all(deliveryId);
    res.json({ success: true, routes });
  } catch (err) {
    next(err);
  }
}

async function acceptAlternativeRoute(req, res, next) {
  try {
    const { deliveryId, vehicleId } = req.body;
    const idToUse = deliveryId || 'DEL-101';

    const delivery = db.prepare('SELECT * FROM deliveries WHERE id = ? OR vehicle_id = ?').get(idToUse, vehicleId || 'TRK001');
    if (!delivery) {
      return res.status(404).json({ error: 'Delivery not found.' });
    }

    // Set delivery status back to ACTIVE on bypass route
    const newRouteStr = 'Guwahati (A) → Nagaon (E) → Haflong (F) → Silchar (D)';
    db.prepare(`UPDATE deliveries SET status = 'ACTIVE', current_route = ?, estimated_arrival = '4h 05m' WHERE id = ?`).run(newRouteStr, delivery.id);

    // Notify driver & logistics manager
    const vehicle = db.prepare('SELECT * FROM vehicles WHERE id = ?').get(delivery.vehicle_id);
    if (vehicle && vehicle.driver_id) {
      createNotification({
        userId: vehicle.driver_id,
        title: '✓ ROUTE UPDATED',
        message: 'New bypass route accepted. Journey continuing safely.',
        type: 'ROUTE_UPDATE'
      });
    }

    res.json({ success: true, message: 'Alternative bypass route accepted successfully.', deliveryId: delivery.id });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  calculateRoute,
  getDeliveryRoutes,
  acceptAlternativeRoute
};
