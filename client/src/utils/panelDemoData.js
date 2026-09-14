// Centralized Fictional Demo Configuration for SIH 2026 Panel Presentation Mode

export const DEMO_CONFIG = {
  incident: {
    type: "Landslide",
    severity: "HIGH",
    road: "Road Segment R-17",
    status: "BLOCKED",
    location: "Nongpoh Pass (KM 34)",
    reportedBy: "Field Responder Officer T. Sangma",
    photoUrl: "/demo-landslide.jpg",
    time: "10:14 AM"
  },
  delivery: {
    id: "RR-1042",
    cargo: "Essential Medical Supplies & Oxygen Cylinders",
    destination: "Remote Health Centre, Silchar",
    origin: "Guwahati Central Depot",
    status: "AFFECTED"
  },
  vehicle: {
    number: "TR-09-DEMO-21",
    driverName: "Arjun Kumar",
    type: "Logistics Ambulance/Truck"
  },
  route: {
    original: "Guwahati → Nongpoh Pass (R-17) → Shillong → Silchar",
    alternative: "Guwahati → Jowai Safe Bypass Corridor → Silchar",
    originalETA: "2h 15m",
    alternativeETA: "2h 32m",
    riskScoreOriginal: 85,
    riskScoreAlternative: 18
  }
};

export const DEMO_STEPS = [
  {
    step: 1,
    title: "STEP 1 – INTRODUCE THE PROBLEM",
    heading: "Essential Supply Delivery in Progress",
    narration: [
      "RouteResQ continuously monitors emergency road corridors to keep essential medical supplies moving safely."
    ],
    view: "overview"
  },
  {
    step: 2,
    title: "STEP 2 – INCIDENT OCCURS",
    heading: "Landslide Disruption Reported on Segment R-17",
    narration: [
      "A field responder reports a sudden landslide blocking NH-39 Nongpoh Pass Corridor R-17."
    ],
    view: "incident"
  },
  {
    step: 3,
    title: "STEP 3 – RISK INTELLIGENCE",
    heading: "Risk Intelligence & Road Accessibility Update",
    narration: [
      "The risk engine evaluates the hazard, assigns an 85/100 risk score, and marks the corridor blocked."
    ],
    view: "risk"
  },
  {
    step: 4,
    title: "STEP 4 – IDENTIFY AFFECTED DELIVERY",
    heading: "1 Active Delivery Affected (RR-1042)",
    narration: [
      "The system instantly identifies that essential medical delivery RR-1042 is trapped before the block."
    ],
    view: "logistics"
  },
  {
    step: 5,
    title: "STEP 5 – CALCULATE ALTERNATIVE ROUTE",
    heading: "Safer Alternative Route Found (Dijkstra Optimization)",
    narration: [
      "Dijkstra pathfinding calculates a safer alternative bypass via the Jowai Corridor with minimal delay."
    ],
    view: "reroute"
  },
  {
    step: 6,
    title: "STEP 6 – ALERTS",
    heading: "Role-Specific Alerts Dispatched",
    narration: [
      "Role-specific alerts are instantly dispatched to the driver, logistics manager, and government authority."
    ],
    view: "alerts"
  },
  {
    step: 7,
    title: "STEP 7 – DRIVER ACTION",
    heading: "Driver Accepts Safer Route (REROUTED)",
    narration: [
      "The driver receives the alert on their HUD and accepts the recommended safer bypass route."
    ],
    view: "driver"
  },
  {
    step: 8,
    title: "STEP 8 – AUTHORITY MONITORING",
    heading: "Centralized Ecosystem Monitoring",
    narration: [
      "The authority monitors all incidents, affected fleet vehicles, and open corridors from one command center."
    ],
    view: "authority"
  },
  {
    step: 9,
    title: "FINAL SOLUTION SCREEN",
    heading: "ROUTERESQ – From Road Disruptions to Actionable Logistics Intelligence",
    narration: [
      "RouteResQ transforms road disruptions into actionable logistics intelligence for resilient transportation. Thank you."
    ],
    view: "final"
  }
];
