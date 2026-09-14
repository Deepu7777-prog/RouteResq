from flask import Blueprint, jsonify, request

state_bp = Blueprint('state_bp', __name__)

DEFAULT_STATE = {
    "demoStep": 1,
    "demoStepDetails": {
        1: {"title": "STEP 1 — SAFE BASELINE MONITORING", "description": "All major transit corridors in NER are open. Vehicles operating normally."},
        2: {"title": "STEP 2 — WEATHER WARNING", "description": "Heavy rainfall alert issued for Meghalaya-Assam border districts."},
        3: {"title": "STEP 3 — LANDSLIDE DISRUPTION", "description": "Landslide reported on Nongpoh-Shillong Pass (R02). Corridor blocked."},
        4: {"title": "STEP 4 — AI REROUTING DISPATCH", "description": "AI engine calculates safer alternative route via Jowai Bypass (R04)."},
        5: {"title": "STEP 5 — DRIVER ROUTE ACCEPTANCE", "description": "Driver Arjun Kumar accepts reroute notification on mobile HUD."}
    },
    "roads": [
        {"id": "R01", "name": "Guwahati - Nongpoh Expressway", "status": "SAFE", "riskScore": 15, "u": "A", "v": "B", "distanceKm": 52},
        {"id": "R02", "name": "Nongpoh - Shillong Pass", "status": "BLOCKED", "riskScore": 92, "u": "B", "v": "C", "distanceKm": 48},
        {"id": "R03", "name": "Shillong - Silchar Highway", "status": "MEDIUM_RISK", "riskScore": 45, "u": "C", "v": "D", "distanceKm": 165},
        {"id": "R04", "name": "Jowai Bypass Corridor", "status": "SAFE", "riskScore": 20, "u": "B", "v": "D", "distanceKm": 180},
        {"id": "R05", "name": "Guwahati Outer Bypass", "status": "SAFE", "riskScore": 10, "u": "A", "v": "D", "distanceKm": 210}
    ],
    "nodes": {
        "A": {"id": "A", "name": "Guwahati Central Hub", "coords": [26.14, 91.73], "district": "Kamrup Metropolitan"},
        "B": {"id": "B", "name": "Nongpoh Transit Hub", "coords": [25.90, 91.88], "district": "Ri-Bhoi"},
        "C": {"id": "C", "name": "Shillong Command Center", "coords": [25.57, 91.88], "district": "East Khasi Hills"},
        "D": {"id": "D", "name": "Silchar Relief Depot", "coords": [24.83, 92.77], "district": "Cachar"}
    },
    "vehicles": [
        {
            "id": "TRK001",
            "cargo": "Medical & Oxygen Supplies",
            "driverName": "Arjun Kumar",
            "driverPhone": "9000000002",
            "status": "AFFECTED",
            "originNode": "B",
            "destinationNode": "D",
            "destination": "Silchar Relief Depot",
            "isAffected": True,
            "activeRoute": {
                "etaFormatted": "4h 15m",
                "distanceKm": 196,
                "coords": [[25.90, 91.88], [25.57, 91.88], [24.83, 92.77]]
            },
            "alternativeRoute": {
                "success": True,
                "routeName": "Jowai Safe Bypass",
                "etaFormatted": "3h 40m",
                "distanceKm": 180,
                "riskScore": 22,
                "coords": [[25.90, 91.88], [25.44, 92.20], [24.83, 92.77]]
            }
        },
        {
            "id": "TRK002",
            "cargo": "Ration & Food Supplies",
            "driverName": "Vikram Singh",
            "driverPhone": "9000000008",
            "status": "ON_ROUTE",
            "originNode": "A",
            "destinationNode": "B",
            "destination": "Nongpoh Transit Hub",
            "isAffected": False,
            "activeRoute": {
                "etaFormatted": "1h 10m",
                "distanceKm": 52,
                "coords": [[26.14, 91.73], [25.90, 91.88]]
            }
        }
    ],
    "incidents": [
        {
            "id": "INC-101",
            "type": "LANDSLIDE",
            "roadId": "R02",
            "roadName": "Nongpoh - Shillong Pass (R02)",
            "severity": "High",
            "description": "Major landslide blocking both lanes near KM 34.",
            "reportedBy": "Field Officer Rajesh",
            "locationCoords": [25.75, 91.88]
        }
    ]
}

current_state = dict(DEFAULT_STATE)

@state_bp.route('/state', methods=['GET'])
def get_state():
    return jsonify(current_state), 200

@state_bp.route('/reset', methods=['POST'])
def reset_state():
    global current_state
    current_state = dict(DEFAULT_STATE)
    return jsonify({"success": True, "message": "State reset to baseline", "state": current_state}), 200

@state_bp.route('/incidents', methods=['POST'])
def create_incident():
    data = request.get_json() or {}
    new_inc = {
        "id": f"INC-{len(current_state['incidents']) + 101}",
        "type": data.get("incident_type", "LANDSLIDE"),
        "roadId": data.get("road_id", "R02"),
        "roadName": "Nongpoh - Shillong Pass (R02)",
        "severity": data.get("severity", "High"),
        "description": data.get("description", "Field emergency report submitted."),
        "reportedBy": data.get("reportedBy", "Field Response Officer"),
        "locationCoords": [25.75, 91.88]
    }
    current_state['incidents'].append(new_inc)
    return jsonify({"success": True, "incident": new_inc}), 201
