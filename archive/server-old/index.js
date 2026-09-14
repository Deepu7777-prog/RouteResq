const express = require("express");
const cors = require("cors");
const { getState, resetState, reportIncident, resolveIncident, acceptAlternativeRoute, setDemoStep } = require("./services/dataStore");
const { calculateShortestPath } = require("./services/graphEngine");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ONLINE", platform: "RouteResQ NER Intelligence Server", timestamp: new Date() });
});

// Get current system state
app.get("/api/state", (req, res) => {
  res.json(getState());
});

// Reset system state to default baseline
app.post("/api/reset", (req, res) => {
  const state = resetState();
  res.json({ success: true, message: "System state reset to initial safe condition.", state });
});

// Field Officer submits incident
app.post("/api/incidents", (req, res) => {
  try {
    const { type, roadId, severity, description, reportedBy, photoUrl, locationCoords } = req.body;
    if (!type || !roadId || !severity) {
      return res.status(400).json({ error: "Missing required incident fields: type, roadId, severity." });
    }

    const result = reportIncident({ type, roadId, severity, description, reportedBy, photoUrl, locationCoords });
    res.json({ success: true, ...result, state: getState() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Resolve incident endpoint
app.post("/api/incidents/resolve", (req, res) => {
  try {
    const { incidentId } = req.body;
    if (!incidentId) {
      return res.status(400).json({ error: "Missing incidentId parameter." });
    }

    const resolved = resolveIncident(incidentId);
    res.json({ success: true, incident: resolved, state: getState() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Driver accepts alternative route
app.post("/api/driver/accept-route", (req, res) => {
  try {
    const { vehicleId } = req.body;
    if (!vehicleId) {
      return res.status(400).json({ error: "Missing vehicleId parameter." });
    }

    const updatedVehicle = acceptAlternativeRoute(vehicleId);
    res.json({ success: true, vehicle: updatedVehicle, state: getState() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Set Live Demo step
app.post("/api/demo/step", (req, res) => {
  try {
    const { step } = req.body;
    const newState = setDemoStep(Number(step));
    res.json({ success: true, demoStep: newState.demoStep, state: newState });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Simulated Login endpoint
app.post("/api/login", (req, res) => {
  const { username } = req.body;
  const state = getState();
  const user = state.users.find(u => u.username === username);

  if (user) {
    res.json({ success: true, user });
  } else {
    res.status(401).json({ error: "Invalid credentials. Please select one of the 4 demo accounts." });
  }
});

// Calculate route on demand endpoint
app.post("/api/route/calculate", (req, res) => {
  const { originNode, destinationNode, blockedRoadIds = [] } = req.body;
  const state = getState();
  const modifiedRoads = state.roads.map(r => {
    if (blockedRoadIds.includes(r.id)) {
      return { ...r, status: "BLOCKED", riskScore: 100 };
    }
    return r;
  });

  const routeResult = calculateShortestPath(originNode || "A", destinationNode || "D", modifiedRoads);
  res.json(routeResult);
});

// Serve Built React Frontend Static Files (Combined Deployment)
const path = require("path");
const fs = require("fs");
const distPath = path.join(__dirname, "../client/dist");

if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) return next();
    res.sendFile(path.join(distPath, "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`[RouteResQ API Server] Running on http://localhost:${PORT}`);
});
