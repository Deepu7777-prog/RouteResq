from flask import Blueprint, request, jsonify
from models import db
from models.accident import Accident

accident_bp = Blueprint('accident_bp', __name__)

@accident_bp.route('/accidents', methods=['POST'])
def report_accident():
    data = request.get_json() or {}
    latitude = data.get('latitude')
    longitude = data.get('longitude')

    if latitude is None or longitude is None:
        return jsonify({
            "success": False,
            "error": "latitude and longitude are required to report an accident"
        }), 400

    try:
        latitude = float(latitude)
        longitude = float(longitude)
    except (ValueError, TypeError):
        return jsonify({"success": False, "error": "Invalid latitude or longitude format"}), 400

    accident = Accident(
        user_id=data.get('user_id'),
        latitude=latitude,
        longitude=longitude,
        description=data.get('description', 'Accident reported'),
        severity=data.get('severity', 'medium')
    )

    try:
        db.session.add(accident)
        db.session.commit()
        return jsonify({
            "success": True,
            "accident": accident.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "error": str(e)}), 500


@accident_bp.route('/accidents', methods=['GET'])
def get_accidents():
    accidents = Accident.query.order_by(Accident.created_at.desc()).all()
    return jsonify({
        "success": True,
        "count": len(accidents),
        "accidents": [a.to_dict() for a in accidents]
    }), 200
