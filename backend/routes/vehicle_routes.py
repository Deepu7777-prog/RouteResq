from flask import Blueprint, request, jsonify
from models import db
from models.vehicle import Vehicle
from services.emergency_service import find_nearest_vehicle

vehicle_bp = Blueprint('vehicle_bp', __name__)

@vehicle_bp.route('/vehicles', methods=['GET'])
def get_vehicles():
    vehicle_type = request.args.get('type')
    query = Vehicle.query

    if vehicle_type:
        query = query.filter(Vehicle.vehicle_type.ilike(f"%{vehicle_type}%"))

    vehicles = query.all()
    return jsonify({
        "success": True,
        "count": len(vehicles),
        "vehicles": [v.to_dict() for v in vehicles]
    }), 200


@vehicle_bp.route('/vehicles/<string:vehicle_id>', methods=['PUT'])
def update_vehicle(vehicle_id):
    vehicle = Vehicle.query.filter_by(vehicle_id=vehicle_id).first()
    if not vehicle:
        return jsonify({"success": False, "error": f"Vehicle '{vehicle_id}' not found"}), 404

    data = request.get_json() or {}

    if 'latitude' in data:
        vehicle.latitude = float(data['latitude'])
    if 'longitude' in data:
        vehicle.longitude = float(data['longitude'])
    if 'availability' in data:
        vehicle.availability = bool(data['availability'])
    if 'status' in data:
        vehicle.status = str(data['status'])

    try:
        db.session.commit()
        return jsonify({
            "success": True,
            "vehicle": vehicle.to_dict()
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "error": str(e)}), 500


@vehicle_bp.route('/nearest/<string:resource_type>', methods=['GET'])
def get_nearest_resource(resource_type):
    lat_str = request.args.get('latitude')
    lon_str = request.args.get('longitude')

    if not lat_str or not lon_str:
        return jsonify({
            "success": False,
            "error": "latitude and longitude query parameters are required"
        }), 400

    try:
        lat = float(lat_str)
        lon = float(lon_str)
    except (ValueError, TypeError):
        return jsonify({"success": False, "error": "Invalid latitude or longitude format"}), 400

    nearest = find_nearest_vehicle(resource_type, lat, lon)

    if not nearest:
        return jsonify({
            "success": False,
            "error": f"No available emergency resource found for type '{resource_type}'"
        }), 404

    return jsonify({
        "success": True,
        "nearest_resource": nearest
    }), 200
