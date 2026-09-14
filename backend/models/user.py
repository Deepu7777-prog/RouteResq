from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from models import db

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    full_name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    mobile = db.Column(db.String(20), nullable=True)
    password_hash = db.Column(db.String(256), nullable=False)
    role = db.Column(db.String(50), nullable=False, default='citizen') # citizen, driver, logistics_officer, field_officer, admin
    verification_status = db.Column(db.String(30), default='VERIFIED') # VERIFIED, PENDING, REJECTED
    officer_id = db.Column(db.String(50), nullable=True)
    department = db.Column(db.String(100), nullable=True)
    location_name = db.Column(db.String(100), default='Hyderabad, Telangana')
    status_text = db.Column(db.String(50), default='Available')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        if not self.password_hash:
            return False
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            "id": self.id,
            "full_name": self.full_name,
            "email": self.email,
            "mobile": self.mobile,
            "role": self.role,
            "verification_status": self.verification_status or 'VERIFIED',
            "officer_id": self.officer_id,
            "department": self.department,
            "location_name": self.location_name,
            "status_text": self.status_text,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }
