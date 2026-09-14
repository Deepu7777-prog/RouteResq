from datetime import datetime
from models import db

class Emergency(db.Model):
    __tablename__ = 'emergencies'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    request_id = db.Column(db.String(50), unique=True, nullable=True) # REQ-DEMO-001
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    emergency_type = db.Column(db.String(50), nullable=False) # Accident, Medical Emergency, Fire
    priority = db.Column(db.String(20), default='HIGH') # HIGH, CRITICAL
    required_service = db.Column(db.String(100), default='Ambulance') # Ambulance + Police, Fire Response
    latitude = db.Column(db.Float, nullable=False, default=17.3850)
    longitude = db.Column(db.Float, nullable=False, default=78.4867)
    location_name = db.Column(db.String(100), default='Hyderabad')
    description = db.Column(db.Text, nullable=True)
    status = db.Column(db.String(50), default='pending') # pending, acknowledged, dispatched, responding, en_route, arrived, resolved, cancelled
    assigned_driver = db.Column(db.String(100), nullable=True)
    assigned_vehicle = db.Column(db.String(50), nullable=True)
    pickup_location = db.Column(db.String(100), default='Hyderabad')
    destination = db.Column(db.String(100), default='City Emergency Hospital')
    eta = db.Column(db.String(50), default='8 minutes')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "emergency_id": self.id,
            "request_id": self.request_id or f"REQ-DEMO-{self.id:03d}",
            "user_id": self.user_id,
            "emergency_type": self.emergency_type,
            "priority": self.priority,
            "required_service": self.required_service,
            "latitude": self.latitude,
            "longitude": self.longitude,
            "location_name": self.location_name,
            "description": self.description,
            "status": self.status,
            "assigned_driver": self.assigned_driver,
            "assigned_vehicle": self.assigned_vehicle,
            "pickup_location": self.pickup_location,
            "destination": self.destination,
            "eta": self.eta,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }
