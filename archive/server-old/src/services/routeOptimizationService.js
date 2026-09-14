/**
 * RouteResQ Route Optimization Service (Dijkstra Shortest Path Graph Engine)
 * Models North Eastern Region (NER) transit corridors and dynamic bypass routing.
 */

const NODES = {
  A: { id: "A", name: "Guwahati Hub", coords: [26.1445, 91.7362], district: "Kamrup Metro" },
  B: { id: "B", name: "Nongpoh Checkpoint", coords: [25.9004, 91.8804], district: "Ri-Bhoi" },
  C: { id: "C", name: "Shillong Transit Node", coords: [25.5788, 91.8933], district: "East Khasi Hills" },
  D: { id: "D", name: "Silchar Remote District", coords: [24.8333, 92.7789], district: "Cachar" },
  E: { id: "E", name: "Nagaon Bypass Hub", coords: [26.3462, 92.6841], district: "Nagaon" },
  F: { id: "F", name: "Haflong Mountain Pass", coords: [25.1764, 93.0142], district: "Dima Hasao" }
};

function calculateShortestPath(startNodeId, endNodeId, roadsList) {
  const adj = {};
  Object.keys(NODES).forEach(id => {
    adj[id] = [];
  });

  roadsList.forEach(road => {
    // If road is BLOCKED, exclude edge from pathfinding graph
    if (road.status === "BLOCKED" || road.risk_score >= 80) {
      return;
    }

    let riskWeightFactor = 1.0;
    if (road.risk_score > 50) riskWeightFactor = 2.0;
    else if (road.risk_score > 30) riskWeightFactor = 1.3;

    const u = road.start_location || road.u;
    const v = road.end_location || road.v;
    const distanceKm = road.distance_km || road.distanceKm || 50;

    if (adj[u] && adj[v]) {
      const weight = distanceKm * riskWeightFactor;
      adj[u].push({ node: v, weight, road });
      adj[v].push({ node: u, weight, road });
    }
  });

  const distances = {};
  const previous = {};
  const prevRoad = {};
  const unvisited = new Set();

  Object.keys(NODES).forEach(node => {
    distances[node] = Infinity;
    previous[node] = null;
    prevRoad[node] = null;
    unvisited.add(node);
  });

  distances[startNodeId] = 0;

  while (unvisited.size > 0) {
    let current = null;
    let minDist = Infinity;
    for (const node of unvisited) {
      if (distances[node] < minDist) {
        minDist = distances[node];
        current = node;
      }
    }

    if (current === null || minDist === Infinity || current === endNodeId) {
      break;
    }

    unvisited.delete(current);

    for (const neighbor of adj[current]) {
      if (!unvisited.has(neighbor.node)) continue;
      const newDist = distances[current] + neighbor.weight;
      if (newDist < distances[neighbor.node]) {
        distances[neighbor.node] = newDist;
        previous[neighbor.node] = current;
        prevRoad[neighbor.node] = neighbor.road;
      }
    }
  }

  if (distances[endNodeId] === Infinity) {
    return {
      success: false,
      nodes: [],
      roads: [],
      totalDistanceKm: 0,
      estimatedMinutes: 0,
      etaFormatted: "No Accessible Route Available",
      message: "No accessible route currently available"
    };
  }

  const pathNodes = [];
  const pathRoads = [];
  let curr = endNodeId;

  while (curr !== null) {
    pathNodes.unshift(curr);
    if (prevRoad[curr]) {
      pathRoads.unshift(prevRoad[curr]);
    }
    curr = previous[curr];
  }

  let totalDistanceKm = 0;
  let totalMinutes = 0;

  pathRoads.forEach(r => {
    const dist = r.distance_km || r.distanceKm || 50;
    totalDistanceKm += dist;
    const hours = dist / 45;
    totalMinutes += Math.round(hours * 60);
  });

  const hoursPart = Math.floor(totalMinutes / 60);
  const minsPart = totalMinutes % 60;
  const etaFormatted = `${hoursPart}h ${minsPart < 10 ? "0" : ""}${minsPart}m`;

  return {
    success: true,
    nodes: pathNodes,
    nodeDetails: pathNodes.map(id => NODES[id]),
    roads: pathRoads,
    totalDistanceKm,
    totalMinutes,
    etaFormatted,
    coordinatesPath: pathNodes.map(id => NODES[id].coords)
  };
}

module.exports = {
  NODES,
  calculateShortestPath
};
