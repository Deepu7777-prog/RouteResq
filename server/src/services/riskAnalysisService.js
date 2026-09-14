/**
 * RouteResQ Explainable Risk Analysis Engine
 * Calculates road vulnerability index based on terrain, monsoon weather, and ground field reports.
 */

const INCIDENT_WEIGHTS = {
  LANDSLIDE: 50,
  FLOOD: 30,
  BRIDGE_DAMAGE: 45,
  ROAD_DAMAGE: 35,
  ACCIDENT: 25,
  TRAFFIC: 20,
  HEAVY_RAIN: 25
};

const SEVERITY_FACTORS = {
  LOW: 0.8,
  MEDIUM: 1.0,
  HIGH: 1.4,
  CRITICAL: 1.8
};

function calculateRoadRisk(baseVulnerability = 15, activeIncidents = [], weatherCondition = 'NORMAL') {
  let score = baseVulnerability;
  const factors = [`Base Vulnerability: +${baseVulnerability} pts`];

  if (weatherCondition === 'HEAVY_RAIN') {
    score += 25;
    factors.push('Monsoon Heavy Rainfall Warning: +25 pts');
  } else if (weatherCondition === 'FLASH_FLOOD') {
    score += 35;
    factors.push('Flash Flood Warning: +35 pts');
  }

  activeIncidents.forEach(inc => {
    const typeUpper = (inc.incident_type || inc.type || 'ACCIDENT').toUpperCase();
    const sevUpper = (inc.severity || 'MEDIUM').toUpperCase();

    const weight = INCIDENT_WEIGHTS[typeUpper] || 25;
    const factor = SEVERITY_FACTORS[sevUpper] || 1.0;
    const added = Math.round(weight * factor);

    score += added;
    factors.push(`Field Report [${typeUpper} - ${sevUpper}]: +${added} pts`);
  });

  score = Math.min(100, Math.max(0, score));

  let status = 'SAFE';
  if (score > 75 || activeIncidents.some(i => (i.severity || '').toUpperCase() === 'HIGH' || (i.incident_type || '').toUpperCase() === 'LANDSLIDE')) {
    status = 'BLOCKED';
  } else if (score > 50) {
    status = 'HIGH_RISK';
  } else if (score > 30) {
    status = 'CAUTION';
  }

  return {
    riskScore: score,
    status,
    factors,
    timestamp: new Date().toISOString()
  };
}

module.exports = {
  calculateRoadRisk
};
