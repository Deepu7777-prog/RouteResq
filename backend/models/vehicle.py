from datetime import datetime
from models import db

class Vehicle(db.Model):
    __tablename__ = 'vehicles'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    vehicle_id = db.Column(db.String(50), unique=True, nullable=False) # DRV-DEMO-001 or TS-DEMO-108
    vehicle_number = db.Column(db.String(50), nullable=True) # TS-DEMO-108
    driver_name = db.Column(db.String(100), nullable=True) # Arjun Kumar
    driver_id = db.Column(db.String(50), nullable=True) # DRV-DEMO-001
    vehicle_type = db.Column(db.String(50), nullable=False, default='Ambulance') # Ambulance, Police, Fire Truck
    latitude = db.Column(db.Float, nullable=False, default=17.3850)
    longitude = db.Column(db.Float, nullable=False, default=78.4867)
    location_name = db.Column(db.String(100), default='Hyderabad')
    availability = db.Column(db.Boolean, default=True)
    status = db.Column(db.String(50), default='Available') # Available, Dispatched, Responding, Busy, Maintenance
    eta = db.Column(db.String(50), default='8 minutes')
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "vehicle_id": self.vehicle_id,
            "vehicle_number": self.vehicle_number or self.vehicle_id,
            "driver_name": self.driver_name,
            "driver_id": self.driver_id,
            "vehicle_type": self.vehicle_type,
            "latitude": self.latitude,
            "longitude": self.longitude,
            "location_name": self.location_name,
            "availability": self.availability,
            "status": self.status,
            "eta": self.eta,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }
