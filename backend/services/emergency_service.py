import math
from models.vehicle import Vehicle

def haversine_distance(lat1, lon1, lat2, lon2):
    """
    Calculate the great circle distance in kilometers between two points 
    on the earth (specified in decimal degrees).
    """
    R = 6371.0 # Radius of earth in kilometers

    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)

    a = math.sin(dlat / 2.0) ** 2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2.0) ** 2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

    distance = R * c
    return round(distance, 2)

def find_nearest_vehicle(resource_type, latitude, longitude):
    query = Vehicle.query.filter_by(availability=True)
    if resource_type:
        query = query.filter(Vehicle.vehicle_type.ilike(f"%{resource_type}%"))

    vehicles = query.all()

    if not vehicles:
        return None

    nearest_vehicle = None
    min_distance = float('inf')

    for v in vehicles:
        dist = haversine_distance(latitude, longitude, v.latitude, v.longitude)
        if dist < min_distance:
            min_distance = dist
            nearest_vehicle = v

    if nearest_vehicle:
        result = nearest_vehicle.to_dict()
        result['distance_km'] = min_distance
        return result

    return None
