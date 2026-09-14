/**
 * RouteResQ Prototype Risk Intelligence Model
 * Transparent risk evaluation engine for terrain, weather, and ground incident reports.
 */

const INCIDENT_RISK_WEIGHTS = {
  Landslide: 50,
  Flood: 60,
  "Road Damage": 40,
  "Bridge Damage": 55,
  "Traffic Blockage": 25,
  "Heavy Rain": 30
};

const SEVERITY_MULTIPLIERS = {
  Low: 0.8,
  Medium: 1.0,
  High: 1.4,
  Critical: 1.8
};

/**
 * Calculates updated risk score and status for a road segment based on ground reports and factors
 */
function calculateRoadRisk(baseRisk = 15, incidents = [], weatherCondition = "Normal") {
  let score = baseRisk;
  const calculations = [`Base Road Vulnerability: ${baseRisk} pts`];

  if (weatherCondition === "Heavy Rain") {
    score += 25;
    calculations.push("Monsoon Heavy Rain Warning: +25 pts");
  } else if (weatherCondition === "Flash Flood Warning") {
    score += 45;
    calculations.push("Flash Flood Warning: +45 pts");
  }

  incidents.forEach(inc => {
    const weight = INCIDENT_RISK_WEIGHTS[inc.type] || 30;
    const mult = SEVERITY_MULTIPLIERS[inc.severity] || 1.0;
    const addedScore = Math.round(weight * mult);
    score += addedScore;
    calculations.push(`Field Report [${inc.type} - ${inc.severity}]: +${addedScore} pts`);
  });

  score = Math.min(100, Math.max(0, score));

  let status = "SAFE";
  if (score > 75 || incidents.some(i => i.severity === "High" || i.type === "Landslide" || i.type === "Flood")) {
    status = "BLOCKED";
  } else if (score > 60) {
    status = "HIGH_RISK";
  } else if (score > 30) {
    status = "MEDIUM_RISK";
  }

  return {
    riskScore: score,
    status,
    calculations,
    timestamp: new Date().toISOString()
  };
}

module.exports = {
  INCIDENT_RISK_WEIGHTS,
  SEVERITY_MULTIPLIERS,
  calculateRoadRisk
};
