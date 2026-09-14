from datetime import datetime
from models import db

class Accident(db.Model):
    __tablename__ = 'accidents'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    incident_id = db.Column(db.String(50), unique=True, nullable=True) # INC-DEMO-001
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    incident_type = db.Column(db.String(50), default='Road Accident')
    latitude = db.Column(db.Float, nullable=False, default=17.3850)
    longitude = db.Column(db.Float, nullable=False, default=78.4867)
    location_name = db.Column(db.String(100), default='Hyderabad')
    description = db.Column(db.Text, nullable=True)
    severity = db.Column(db.String(50), default='medium') # low, medium, high, critical
    priority = db.Column(db.String(20), default='Critical')
    assigned_officer = db.Column(db.String(100), default='Rahul Verma')
    officer_id = db.Column(db.String(50), default='FIELD-DEMO-001')
    status = db.Column(db.String(50), default='Responding') # Responding, Active, Resolved
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "incident_id": self.incident_id or f"INC-DEMO-{self.id:03d}",
            "user_id": self.user_id,
            "incident_type": self.incident_type,
            "latitude": self.latitude,
            "longitude": self.longitude,
            "location_name": self.location_name,
            "description": self.description,
            "severity": self.severity,
            "priority": self.priority,
            "assigned_officer": self.assigned_officer,
            "officer_id": self.officer_id,
            "status": self.status,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }
