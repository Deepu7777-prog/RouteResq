from flask import Blueprint, request, jsonify
from models import db
from models.location import Location

location_bp = Blueprint('location_bp', __name__)

@location_bp.route('/location', methods=['POST'])
def update_location():
    data = request.get_json() or {}
    user_id = data.get('user_id')
    latitude = data.get('latitude')
    longitude = data.get('longitude')

    if not user_id or latitude is None or longitude is None:
        return jsonify({
            "success": False,
            "error": "user_id, latitude, and longitude are required"
        }), 400

    try:
        latitude = float(latitude)
        longitude = float(longitude)
    except (ValueError, TypeError):
        return jsonify({"success": False, "error": "Invalid latitude or longitude format"}), 400

    location = Location(
        user_id=user_id,
        latitude=latitude,
        longitude=longitude
    )

    try:
        db.session.add(location)
        db.session.commit()
        return jsonify({
            "success": True,
            "location": location.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "error": str(e)}), 500


@location_bp.route('/location/<int:user_id>', methods=['GET'])
def get_user_location(user_id):
    location = Location.query.filter_by(user_id=user_id).order_by(Location.timestamp.desc()).first()
    if not location:
        return jsonify({"success": False, "error": "No location found for this user"}), 404

    return jsonify({
        "success": True,
        "location": location.to_dict()
    }), 200
