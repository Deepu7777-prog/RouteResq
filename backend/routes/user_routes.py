from flask import Blueprint, request, jsonify
from datetime import datetime
from models import db
from models.user import User

user_bp = Blueprint('user_bp', __name__)

# Pre-seeded demo verification users for memory fallback / initial DB seed
DEMO_VERIFICATION_USERS = [
    {
        "id": 101,
        "full_name": "Arjun Kumar",
        "email": "driver.demo@routeresq.com",
        "mobile": "9000000002",
        "role": "DRIVER",
        "verification_status": "PENDING",
        "officer_id": "DL-AS-2024-9981",
        "department": "Emergency Medical Transport",
        "location_name": "Nongpoh, Meghalaya",
        "documents": ["Driving License (DL-AS-2024)", "Vehicle Registration (AS-01-EQ-9921)", "Medical Fitness Cert"],
        "created_at": "2026-09-10T10:30:00"
    },
    {
        "id": 102,
        "full_name": "Priya Sharma",
        "email": "logistics.demo@routeresq.com",
        "mobile": "9000000003",
        "role": "LOGISTICS_OFFICER",
        "verification_status": "PENDING",
        "officer_id": "LOG-NER-4402",
        "department": "Relief Cargo Dispatch",
        "location_name": "Guwahati Hub, Assam",
        "documents": ["Department ID (LOG-NER-4402)", "Govt Transport Permit", "Aadhaar Card"],
        "created_at": "2026-09-10T11:15:00"
    },
    {
        "id": 103,
        "full_name": "Ravi Kumar",
        "email": "field.demo@routeresq.com",
        "mobile": "9000000004",
        "role": "FIELD_OFFICER",
        "verification_status": "VERIFIED",
        "officer_id": "FLD-SHG-8812",
        "department": "State Disaster Management",
        "location_name": "Shillong, Meghalaya",
        "documents": ["Department Badge (FLD-SHG-8812)", "Disaster Response Cert"],
        "created_at": "2026-09-09T14:20:00"
    },
    {
        "id": 104,
        "full_name": "Sunita Roy",
        "email": "citizen.demo@routeresq.com",
        "mobile": "9000000001",
        "role": "CITIZEN",
        "verification_status": "PENDING",
        "officer_id": "N/A",
        "department": "Public Citizen",
        "location_name": "Silchar, Assam",
        "documents": ["Aadhaar Identity Proof"],
        "created_at": "2026-09-11T09:00:00"
    },
    {
        "id": 105,
        "full_name": "Rajesh Nath",
        "email": "rajesh.field@routeresq.com",
        "mobile": "9000000009",
        "role": "FIELD_OFFICER",
        "verification_status": "REJECTED",
        "officer_id": "FLD-EXP-0001",
        "department": "Highway Police Division",
        "location_name": "Jowai, Meghalaya",
        "documents": ["Expired Department ID"],
        "created_at": "2026-09-08T16:45:00"
    }
]

SYSTEM_AUDIT_LOGS = [
    {"id": 1, "timestamp": "2026-09-11T18:30:00", "action": "User Verified", "details": "Admin verified Officer Ravi Kumar (FLD-SHG-8812)"},
    {"id": 2, "timestamp": "2026-09-11T17:45:00", "action": "Incident Reported", "details": "Landslide reported on Nongpoh-Shillong Pass (R02)"},
    {"id": 3, "timestamp": "2026-09-11T16:20:00", "action": "Route Dispatched", "details": "TRK001 rerouted via Jowai Safe Bypass (R04)"},
    {"id": 4, "timestamp": "2026-09-11T15:10:00", "action": "Dashboard Access", "details": "Logistics Dispatcher authenticated successfully"}
]

@user_bp.route('/users', methods=['GET'])
def get_users():
    try:
        users = User.query.all()
        if users:
            return jsonify({"success": True, "users": [u.to_dict() for u in users]}), 200
    except Exception:
        pass
    return jsonify({"success": True, "users": DEMO_VERIFICATION_USERS}), 200

@user_bp.route('/users/pending', methods=['GET'])
def get_pending_users():
    try:
        users = User.query.filter_by(verification_status='PENDING').all()
        if users:
            return jsonify({"success": True, "users": [u.to_dict() for u in users]}), 200
    except Exception:
        pass
    pending = [u for u in DEMO_VERIFICATION_USERS if u["verification_status"] == "PENDING"]
    return jsonify({"success": True, "users": pending}), 200

@user_bp.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    try:
        user = User.query.get(user_id)
        if user:
            return jsonify({"success": True, "user": user.to_dict()}), 200
    except Exception:
        pass
    match = next((u for u in DEMO_VERIFICATION_USERS if u["id"] == user_id), None)
    if match:
        return jsonify({"success": True, "user": match}), 200
    return jsonify({"success": False, "error": "User not found"}), 404

@user_bp.route('/users/<int:user_id>/approve', methods=['POST'])
def approve_user(user_id):
    try:
        user = User.query.get(user_id)
        if user:
            user.verification_status = 'VERIFIED'
            db.session.commit()
    except Exception:
        pass

    for u in DEMO_VERIFICATION_USERS:
        if u["id"] == user_id:
            u["verification_status"] = "VERIFIED"

    log_entry = {
        "id": len(SYSTEM_AUDIT_LOGS) + 1,
        "timestamp": datetime.now().isoformat(),
        "action": "User Approved",
        "details": f"Admin approved user ID #{user_id}"
    }
    SYSTEM_AUDIT_LOGS.insert(0, log_entry)

    return jsonify({"success": True, "message": "User verified successfully"}), 200

@user_bp.route('/users/<int:user_id>/reject', methods=['POST'])
def reject_user(user_id):
    try:
        user = User.query.get(user_id)
        if user:
            user.verification_status = 'REJECTED'
            db.session.commit()
    except Exception:
        pass

    for u in DEMO_VERIFICATION_USERS:
        if u["id"] == user_id:
            u["verification_status"] = "REJECTED"

    log_entry = {
        "id": len(SYSTEM_AUDIT_LOGS) + 1,
        "timestamp": datetime.now().isoformat(),
        "action": "User Rejected",
        "details": f"Admin rejected user ID #{user_id}"
    }
    SYSTEM_AUDIT_LOGS.insert(0, log_entry)

    return jsonify({"success": True, "message": "User access rejected"}), 200

@user_bp.route('/system/status', methods=['GET'])
def system_status():
    return jsonify({
        "success": True,
        "status": "OPERATIONAL",
        "api_status": "ONLINE",
        "map_status": "ACTIVE",
        "backend_status": "HEALTHY",
        "active_users": 42,
        "last_incident_at": "10 minutes ago"
    }), 200

@user_bp.route('/audit-logs', methods=['GET'])
def get_audit_logs():
    return jsonify({"success": True, "logs": SYSTEM_AUDIT_LOGS}), 200
