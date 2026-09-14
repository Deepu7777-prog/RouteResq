from flask import Blueprint, request, jsonify
from models import db
from models.emergency import Emergency

emergency_bp = Blueprint('emergency_bp', __name__)

VALID_STATUSES = ['pending', 'acknowledged', 'dispatched', 'en_route', 'arrived', 'resolved', 'cancelled']

@emergency_bp.route('/emergency', methods=['POST'])
def create_emergency():
    data = request.get_json() or {}
    emergency_type = data.get('emergency_type')
    latitude = data.get('latitude')
    longitude = data.get('longitude')

    if not emergency_type or latitude is None or longitude is None:
        return jsonify({
            "success": False,
            "error": "emergency_type, latitude, and longitude are required"
        }), 400

    try:
        latitude = float(latitude)
        longitude = float(longitude)
    except (ValueError, TypeError):
        return jsonify({"success": False, "error": "Invalid latitude or longitude format"}), 400

    emergency = Emergency(
        user_id=data.get('user_id'),
        emergency_type=emergency_type,
        latitude=latitude,
        longitude=longitude,
        description=data.get('description', ''),
        status='pending'
    )

    try:
        db.session.add(emergency)
        db.session.commit()
        return jsonify({
            "success": True,
            "emergency_id": emergency.id,
            "status": emergency.status
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "error": str(e)}), 500


@emergency_bp.route('/emergency/<int:emergency_id>', methods=['GET'])
def get_emergency(emergency_id):
    emergency = Emergency.query.get(emergency_id)
    if not emergency:
        return jsonify({"success": False, "error": "Emergency request not found"}), 404

    return jsonify({
        "success": True,
        "emergency": emergency.to_dict()
    }), 200


@emergency_bp.route('/emergency/<int:emergency_id>/status', methods=['PUT'])
def update_emergency_status(emergency_id):
    emergency = Emergency.query.get(emergency_id)
    if not emergency:
        return jsonify({"success": False, "error": "Emergency request not found"}), 404

    data = request.get_json() or {}
    new_status = data.get('status')

    if not new_status or new_status not in VALID_STATUSES:
        return jsonify({
            "success": False,
            "error": f"Invalid status. Must be one of: {', '.join(VALID_STATUSES)}"
        }), 400

    emergency.status = new_status

    try:
        db.session.commit()
        return jsonify({
            "success": True,
            "emergency_id": emergency.id,
            "status": emergency.status
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "error": str(e)}), 500


@emergency_bp.route('/sos', methods=['POST'])
def trigger_sos():
    data = request.get_json() or {}
    emergency_type = data.get('emergency_type', 'medical_sos')
    latitude = data.get('latitude')
    longitude = data.get('longitude')

    if latitude is None or longitude is None:
        return jsonify({
            "success": False,
            "error": "latitude and longitude are required to trigger SOS"
        }), 400

    try:
        latitude = float(latitude)
        longitude = float(longitude)
    except (ValueError, TypeError):
        return jsonify({"success": False, "error": "Invalid latitude or longitude format"}), 400

    emergency = Emergency(
        user_id=data.get('user_id'),
        emergency_type=emergency_type,
        latitude=latitude,
        longitude=longitude,
        description=data.get('description', 'Instant 1-Click SOS Triggered'),
        status='pending'
    )

    try:
        db.session.add(emergency)
        db.session.commit()
        return jsonify({
            "success": True,
            "emergency_id": emergency.id,
            "status": emergency.status,
            "message": "SOS Emergency signal broadcasted to rescue dispatch."
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "error": str(e)}), 500
