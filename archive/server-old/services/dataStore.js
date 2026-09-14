/**
 * RouteResQ In-Memory Data Store & State Manager
 * Provides centralized state for real-time synchronization across all roles and live demo mode.
 */

const { NODES, INITIAL_ROADS, calculateShortestPath } = require("./graphEngine");
const { calculateRoadRisk } = require("./riskEngine");

function getInitialState() {
  const initialRoads = JSON.parse(JSON.stringify(INITIAL_ROADS));
  
  // Calculate initial route for TRK001 (A -> B -> C -> D)
  const initialRouteTRK001 = calculateShortestPath("A", "D", initialRoads);

  return {
    demoStep: 1, // 1 to 13
    demoStepDetails: {
      1: { title: "Step 1: Driver Dispatch", role: "driver", description: "Driver DRV001 assigned TRK001 carrying Essential Medicines from Guwahati to Silchar." },
      2: { title: "Step 2: Normal Route View", role: "driver", description: "TRK001 begins navigation on normal NH-40 highway route (A → B → C → D). ETA: 3h 20m." },
      3: { title: "Step 3: Logistics Monitoring", role: "logistics", description: "Logistics Manager monitors active regional fleet. TRK001 is on schedule." },
      4: { title: "Step 4: Authority GIS Center", role: "authority", description: "Authority monitors regional road accessibility network. All primary corridors GREEN." },
      5: { title: "Step 5: Incident Occurs", role: "field", description: "Field Officer reports major landslide disruption on Road R02 (Nongpoh-Shillong Pass)." },
      6: { title: "Step 6: Risk Analysis Engine", role: "authority", description: "RouteResQ AI Risk Engine evaluates incident (+50 pts) & flags Road R02 as BLOCKED." },
      7: { title: "Step 7: Road Status Update", role: "authority", description: "Road R02 updates to RED (BLOCKED) across live GIS command network." },
      8: { title: "Step 8: Authority Alert", role: "authority", description: "High-priority disruption alert issued to regional disaster management center." },
      9: { title: "Step 9: Logistics Impact Detection", role: "logistics", description: "Logistics Manager alerted: Delivery TRK001 affected by Road R02 blockage." },
      10: { title: "Step 10: Dijkstra Recalculation", role: "logistics", description: "Dijkstra Engine recalculates optimal bypass path: Guwahati → Nagaon → Haflong → Silchar." },
      11: { title: "Step 11: Driver Disruption Alert", role: "driver", description: "Driver receives ROUTE DISRUPTION ALERT with alternative bypass route." },
      12: { title: "Step 12: Driver Route Acceptance", role: "driver", description: "Driver accepts new alternative route (A → E → F → D). Updated ETA: 4h 05m." },
      13: { title: "Step 13: Delivery Continues", role: "driver", description: "TRK001 resumes safe transit on alternative corridor. Mission resilient!" }
    },
    users: [
      { username: "authority_demo", role: "authority", name: "Commander P. Baruah", title: "NER Infrastructure Command" },
      { username: "logistics_demo", role: "logistics", name: "Animesh Das", title: "Logistics Operations Lead" },
      { username: "driver_demo", role: "driver", name: "Demo Driver (DRV001)", vehicleId: "TRK001" },
      { username: "field_demo", role: "field", name: "Officer T. Sangma", district: "Ri-Bhoi Sector" }
    ],
    roads: initialRoads,
    nodes: NODES,
    vehicles: [
      {
        id: "TRK001",
        driverName: "Demo Driver (DRV001)",
        cargo: "Essential Medicines & Vaccines",
        origin: "Guwahati Hub (Node A)",
        destination: "Silchar Remote District (Node D)",
        originNode: "A",
        destinationNode: "D",
        currentLocation: "En route near Nongpoh Checkpoint",
        status: "ON ROUTE",
        routeStatus: "SAFE",
        isAffected: false,
        activeRoute: initialRouteTRK001,
        alternativeRoute: null,
        acceptedAlternative: false,
        speedKmh: 45
      },
      {
        id: "TRK002",
        driverName: "Rajesh Kumar",
        cargo: "Disaster Relief Food Rations",
        origin: "Guwahati Hub (Node A)",
        destination: "Nagaon Bypass Hub (Node E)",
        originNode: "A",
        destinationNode: "E",
        currentLocation: "NH-27 Nagaon Highway",
        status: "ON ROUTE",
        routeStatus: "SAFE",
        isAffected: false,
        activeRoute: calculateShortestPath("A", "E", initialRoads),
        alternativeRoute: null,
        acceptedAlternative: false,
        speedKmh: 60
      },
      {
        id: "TRK003",
        driverName: "Sunita Sharma",
        cargo: "Emergency Medical Oxygen Cylinders",
        origin: "Guwahati Hub (Node A)",
        destination: "Tezpur Gateway (Node G)",
        originNode: "A",
        destinationNode: "G",
        currentLocation: "Mangaldoi Bypass",
        status: "ON ROUTE",
        routeStatus: "MEDIUM_RISK",
        isAffected: false,
        activeRoute: calculateShortestPath("A", "G", initialRoads),
        alternativeRoute: null,
        acceptedAlternative: false,
        speedKmh: 50
      }
    ],
    incidents: [
      {
        id: "INC-101",
        type: "Heavy Rain",
        roadId: "R07",
        roadName: "NH-15 Guwahati-Tezpur Corridor",
        locationCoords: [26.45, 92.20],
        severity: "Medium",
        status: "ACTIVE",
        reportedBy: "Tezpur Patrol Unit",
        timestamp: "2026-09-01T08:30:00Z",
        description: "Monsoon heavy rainfall causing waterlogging on outer lane."
      }
    ],
    riskZones: [
      { id: "RZ-01", name: "Nongpoh-Shillong Slope Zone", riskLevel: "HIGH", vulnerability: "Landslide Prone", activeIncidents: 0 },
      { id: "RZ-02", name: "Dima Hasao Haflong Corridor", riskLevel: "MEDIUM", vulnerability: "Flash Flood Prone", activeIncidents: 0 },
      { id: "RZ-03", name: "Sonitpur Tezpur Flood Plain", riskLevel: "MEDIUM", vulnerability: "River Inundation", activeIncidents: 1 }
    ],
    alerts: [
      {
        id: "ALT-001",
        timestamp: new Date().toISOString(),
        title: "System Initialization Complete",
        message: "RouteResQ Command Engine online. All NER primary transit nodes connected.",
        type: "info",
        targetRole: "all"
      }
    ]
  };
}

let currentState = getInitialState();

function getState() {
  return currentState;
}

function resetState() {
  currentState = getInitialState();
  return currentState;
}

function reportIncident({ type, roadId, severity, description, reportedBy, photoUrl, locationCoords }) {
  const road = currentState.roads.find(r => r.id === roadId);
  if (!road) {
    throw new Error(`Road with ID ${roadId} not found.`);
  }

  const incidentId = `INC-${Date.now().toString().slice(-4)}`;
  const newIncident = {
    id: incidentId,
    type,
    roadId,
    roadName: road.name,
    severity,
    description: description || "Ground disruption reported by field officer.",
    reportedBy: reportedBy || "Field Officer T. Sangma",
    photoUrl: photoUrl || null,
    locationCoords: locationCoords || [ (NODES[road.u].coords[0] + NODES[road.v].coords[0]) / 2, (NODES[road.u].coords[1] + NODES[road.v].coords[1]) / 2 ],
    status: "ACTIVE",
    timestamp: new Date().toISOString()
  };

  currentState.incidents.unshift(newIncident);

  // Recalculate Risk for this road
  const activeRoadIncidents = currentState.incidents.filter(i => i.roadId === roadId && i.status === "ACTIVE");
  const riskResult = calculateRoadRisk(road.riskScore, activeRoadIncidents, "Heavy Rain");

  road.riskScore = riskResult.riskScore;
  road.status = riskResult.status;

  // Trigger Dijkstra check for all active vehicles
  const affectedVehicles = [];

  currentState.vehicles.forEach(vehicle => {
    // Check if vehicle's active route uses the modified road
    const usesRoad = vehicle.activeRoute.roads && vehicle.activeRoute.roads.some(r => r.id === roadId);

    if (usesRoad && (road.status === "BLOCKED" || road.status === "HIGH_RISK")) {
      vehicle.isAffected = true;
      vehicle.routeStatus = road.status;

      // Calculate alternative path using Dijkstra with updated roads
      const newPath = calculateShortestPath(vehicle.originNode, vehicle.destinationNode, currentState.roads);
      vehicle.alternativeRoute = newPath;
      affectedVehicles.push(vehicle.id);

      // Create alerts
      currentState.alerts.unshift({
        id: `ALT-${Date.now()}-${vehicle.id}`,
        timestamp: new Date().toISOString(),
        title: `🚨 DELIVERY AFFECTED: ${vehicle.id}`,
        message: `Vehicle ${vehicle.id} route disrupted by ${type} on ${road.name}. Alternative route computed.`,
        type: "danger",
        targetRole: "logistics"
      });

      currentState.alerts.unshift({
        id: `ALT-DRV-${Date.now()}-${vehicle.id}`,
        timestamp: new Date().toISOString(),
        title: `🚨 ROUTE DISRUPTION DETECTED`,
        message: `${road.name} is currently ${road.status}. Recalculated bypass route available.`,
        type: "warning",
        targetRole: "driver"
      });
    }
  });

  currentState.alerts.unshift({
    id: `ALT-AUTH-${Date.now()}`,
    timestamp: new Date().toISOString(),
    title: `⚠ NEW INCIDENT REPORTED`,
    message: `${severity} severity ${type} reported on ${road.name}. Road status updated to ${road.status}.`,
    type: "warning",
    targetRole: "authority"
  });

  return {
    incident: newIncident,
    road,
    riskResult,
    affectedVehicles
  };
}

function resolveIncident(incidentId) {
  const inc = currentState.incidents.find(i => i.id === incidentId);
  if (!inc) return null;

  inc.status = "RESOLVED";

  // Check if remaining active incidents on this road
  const activeIncidents = currentState.incidents.filter(i => i.roadId === inc.roadId && i.status === "ACTIVE");
  const road = currentState.roads.find(r => r.id === inc.roadId);

  if (road) {
    if (activeIncidents.length === 0) {
      road.status = "SAFE";
      road.riskScore = 20;
    } else {
      const riskResult = calculateRoadRisk(20, activeIncidents, "Normal");
      road.status = riskResult.status;
      road.riskScore = riskResult.riskScore;
    }
  }

  currentState.alerts.unshift({
    id: `ALT-RES-${Date.now()}`,
    timestamp: new Date().toISOString(),
    title: `✓ INCIDENT RESOLVED: ${inc.id}`,
    message: `Disruption ${inc.type} on ${inc.roadName} marked resolved. Road status updated to ${road ? road.status : 'SAFE'}.`,
    type: "success",
    targetRole: "all"
  });

  return inc;
}

function acceptAlternativeRoute(vehicleId) {
  const vehicle = currentState.vehicles.find(v => v.id === vehicleId);
  if (!vehicle) {
    throw new Error(`Vehicle ${vehicleId} not found.`);
  }

  if (vehicle.alternativeRoute && vehicle.alternativeRoute.success) {
    vehicle.activeRoute = vehicle.alternativeRoute;
    vehicle.alternativeRoute = null;
    vehicle.isAffected = false;
    vehicle.acceptedAlternative = true;
    vehicle.routeStatus = "SAFE";

    currentState.alerts.unshift({
      id: `ALT-ACC-${Date.now()}`,
      timestamp: new Date().toISOString(),
      title: `✓ ROUTE UPDATED: ${vehicle.id}`,
      message: `Driver accepted alternative route via ${vehicle.activeRoute.nodes.join(" → ")}.`,
      type: "success",
      targetRole: "all"
    });
  }

  return vehicle;
}

function setDemoStep(stepNumber) {
  const step = Math.max(1, Math.min(13, stepNumber));
  currentState.demoStep = step;

  // Auto execute scenario actions matching demo step sequence
  if (step === 5 || step === 6) {
    // If step 5 and incident not yet reported on R02
    const existing = currentState.incidents.find(i => i.roadId === "R02" && i.status === "ACTIVE");
    if (!existing) {
      reportIncident({
        type: "Landslide",
        roadId: "R02",
        severity: "High",
        description: "Major slope collapse and debris blockage on Nongpoh-Shillong Pass (R02).",
        reportedBy: "Officer T. Sangma (Ri-Bhoi Sector)"
      });
    }
  } else if (step === 12 || step === 13) {
    const trk = currentState.vehicles.find(v => v.id === "TRK001");
    if (trk && trk.alternativeRoute) {
      acceptAlternativeRoute("TRK001");
    }
  } else if (step === 1) {
    // Reset to start state if step 1 selected
    resetState();
  }

  return currentState;
}

module.exports = {
  getState,
  resetState,
  reportIncident,
  resolveIncident,
  acceptAlternativeRoute,
  setDemoStep
};
