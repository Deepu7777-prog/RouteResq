from flask import Blueprint, request, jsonify
from models import db
from models.alert import Alert

alert_bp = Blueprint('alert_bp', __name__)

@alert_bp.route('/alerts', methods=['GET'])
def get_alerts():
    alerts = Alert.query.filter_by(active=True).order_by(Alert.created_at.desc()).all()
    return jsonify({
        "success": True,
        "count": len(alerts),
        "alerts": [a.to_dict() for a in alerts]
    }), 200


@alert_bp.route('/alerts', methods=['POST'])
def create_alert():
    data = request.get_json() or {}
    alert_type = data.get('alert_type')
    message = data.get('message')

    if not alert_type or not message:
        return jsonify({
            "success": False,
            "error": "alert_type and message are required"
        }), 400

    lat = data.get('latitude')
    lon = data.get('longitude')
    if lat is not None:
        try:
            lat = float(lat)
        except (ValueError, TypeError):
            lat = None
    if lon is not None:
        try:
            lon = float(lon)
        except (ValueError, TypeError):
            lon = None

    alert = Alert(
        alert_type=alert_type,
        message=message,
        latitude=lat,
        longitude=lon,
        severity=data.get('severity', 'high'),
        active=data.get('active', True)
    )

    try:
        db.session.add(alert)
        db.session.commit()
        return jsonify({
            "success": True,
            "alert": alert.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "error": str(e)}), 500
