from datetime import datetime
from models import db

class Alert(db.Model):
    __tablename__ = 'alerts'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    alert_type = db.Column(db.String(50), nullable=False) # accident, flood, landslide, emergency_roadblock
    message = db.Column(db.Text, nullable=False)
    latitude = db.Column(db.Float, nullable=True)
    longitude = db.Column(db.Float, nullable=True)
    severity = db.Column(db.String(50), default='high')
    active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "alert_type": self.alert_type,
            "message": self.message,
            "latitude": self.latitude,
            "longitude": self.longitude,
            "severity": self.severity,
            "active": self.active,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }
