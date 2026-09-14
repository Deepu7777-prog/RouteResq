/**
 * RouteResQ Graph Engine
 * Implements Dijkstra shortest path algorithm with dynamic risk weighting and road blockage handling.
 */

const NODES = {
  A: { id: "A", name: "Guwahati Hub", coords: [26.1445, 91.7362], district: "Kamrup Metropolitan" },
  B: { id: "B", name: "Nongpoh Checkpoint", coords: [25.9004, 91.8804], district: "Ri-Bhoi" },
  C: { id: "C", name: "Shillong Transit Node", coords: [25.5788, 91.8933], district: "East Khasi Hills" },
  D: { id: "D", name: "Silchar Remote District", coords: [24.8333, 92.7789], district: "Cachar" },
  E: { id: "E", name: "Nagaon Bypass Hub", coords: [26.3462, 92.6841], district: "Nagaon" },
  F: { id: "F", name: "Haflong Mountain Pass", coords: [25.1764, 93.0142], district: "Dima Hasao" },
  G: { id: "G", name: "Tezpur Gateway", coords: [26.6338, 92.8000], district: "Sonitpur" },
  H: { id: "H", name: "Jowai Junction", coords: [25.4452, 92.2081], district: "West Jaintia Hills" }
};

const INITIAL_ROADS = [
  { id: "R01", u: "A", v: "B", name: "NH-40 Guwahati-Nongpoh", distanceKm: 52, status: "SAFE", riskScore: 15, speedKmh: 50 },
  { id: "R02", u: "B", v: "C", name: "NH-40 Nongpoh-Shillong Pass", distanceKm: 48, status: "SAFE", riskScore: 20, speedKmh: 45 },
  { id: "R03", u: "C", v: "D", name: "NH-6 Shillong-Silchar Hwy", distanceKm: 210, status: "SAFE", riskScore: 25, speedKmh: 40 },
  { id: "R04", u: "A", v: "E", name: "NH-27 Guwahati-Nagaon East", distanceKm: 120, status: "SAFE", riskScore: 10, speedKmh: 65 },
  { id: "R05", u: "E", v: "F", name: "NH-27 Nagaon-Haflong Pass", distanceKm: 150, status: "SAFE", riskScore: 18, speedKmh: 50 },
  { id: "R06", u: "F", v: "D", name: "NH-27 Haflong-Silchar Link", distanceKm: 105, status: "SAFE", riskScore: 22, speedKmh: 45 },
  { id: "R07", u: "A", v: "G", name: "NH-15 Guwahati-Tezpur Corridor", distanceKm: 175, status: "MEDIUM_RISK", riskScore: 45, speedKmh: 55 },
  { id: "R08", u: "C", v: "H", name: "SH-8 Shillong-Jowai Link", distanceKm: 64, status: "SAFE", riskScore: 15, speedKmh: 45 },
  { id: "R09", u: "H", v: "D", name: "NH-6 Jowai-Silchar Segment", distanceKm: 146, status: "SAFE", riskScore: 20, speedKmh: 40 }
];

/**
 * Runs Dijkstra's shortest path algorithm over the road network
 * @param {string} startNodeId 
 * @param {string} endNodeId 
 * @param {Array} roadsList 
 */
function calculateShortestPath(startNodeId, endNodeId, roadsList) {
  const adj = {};
  Object.keys(NODES).forEach(id => {
    adj[id] = [];
  });

  roadsList.forEach(road => {
    // If road is BLOCKED or has critical risk (> 80), exclude edge from pathfinding graph
    if (road.status === "BLOCKED" || road.riskScore >= 80) {
      return;
    }

    // Weight penalty for medium/high risk
    let riskWeightFactor = 1.0;
    if (road.riskScore > 60) riskWeightFactor = 2.5;
    else if (road.riskScore > 30) riskWeightFactor = 1.4;

    const edgeWeight = road.distanceKm * riskWeightFactor;

    adj[road.u].push({ node: road.v, weight: edgeWeight, road });
    adj[road.v].push({ node: road.u, weight: edgeWeight, road });
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
    // Get node with smallest distance
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

  // Reconstruct path
  if (distances[endNodeId] === Infinity) {
    return {
      success: false,
      nodes: [],
      roads: [],
      totalDistanceKm: 0,
      estimatedMinutes: 0,
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
    totalDistanceKm += r.distanceKm;
    const hours = r.distanceKm / (r.speedKmh || 45);
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
  INITIAL_ROADS,
  calculateShortestPath
};
