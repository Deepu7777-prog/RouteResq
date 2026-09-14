import os
import sys

# Ensure backend directory is in sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import create_app
from models import db
from models.user import User
from models.vehicle import Vehicle
from models.emergency import Emergency
from models.accident import Accident
from models.alert import Alert
from models.location import Location

app = create_app()

def seed_database():
    with app.app_context():
        print("[RouteResQ Seeder] Rebuilding SQLite schema with prototype demo data...")
        db.drop_all()
        db.create_all()

        # ----------------------------------------------------
        # 1. DEMO USER ACCOUNTS
        # ----------------------------------------------------
        demo_users = [
            {
                "full_name": "RouteResQ Demo Citizen",
                "email": "citizen.demo@routeresq.com",
                "mobile": "9000000001",
                "role": "citizen",
                "location_name": "Hyderabad, Telangana",
                "status_text": "Active"
            },
            {
                "full_name": "Arjun Kumar",
                "email": "driver.demo@routeresq.com",
                "mobile": "9000000002",
                "role": "driver",
                "officer_id": "DRV-DEMO-001",
                "department": "Emergency Medical Transport",
                "location_name": "Hyderabad, Telangana",
                "status_text": "Available"
            },
            {
                "full_name": "Priya Sharma",
                "email": "logistics.demo@routeresq.com",
                "mobile": "9000000003",
                "role": "logistics_officer",
                "officer_id": "LOG-DEMO-001",
                "department": "Emergency Logistics",
                "location_name": "Hyderabad, Telangana",
                "status_text": "On Duty"
            },
            {
                "full_name": "Rahul Verma",
                "email": "field.demo@routeresq.com",
                "mobile": "9000000004",
                "role": "field_officer",
                "officer_id": "FIELD-DEMO-001",
                "department": "Emergency Response",
                "location_name": "Hyderabad, Telangana",
                "status_text": "On Duty"
            },
            {
                "full_name": "RouteResQ Demo Admin",
                "email": "admin.demo@routeresq.com",
                "mobile": "9000000005",
                "role": "admin",
                "location_name": "Hyderabad, Telangana",
                "status_text": "Active Admin"
            }
        ]

        user_map = {}
        for u_data in demo_users:
            user = User(
                full_name=u_data['full_name'],
                email=u_data['email'],
                mobile=u_data['mobile'],
                role=u_data['role'],
                officer_id=u_data.get('officer_id'),
                department=u_data.get('department'),
                location_name=u_data['location_name'],
                status_text=u_data['status_text']
            )
            user.set_password("Demo@123") # Securely hashed
            db.session.add(user)
            db.session.commit()
            print(f" + Created Demo User [{u_data['role'].upper()}]: {u_data['email']}")
            user_map[u_data['role']] = user

        # ----------------------------------------------------
        # 2. DEMO DRIVER & VEHICLE RECORDS
        # ----------------------------------------------------
        v1 = Vehicle(
            vehicle_id="DRV-DEMO-001",
            vehicle_number="TS-DEMO-108",
            driver_name="Arjun Kumar",
            driver_id="DRV-DEMO-001",
            vehicle_type="Ambulance",
            latitude=17.3850,
            longitude=78.4867,
            location_name="Hyderabad",
            availability=True,
            status="Available",
            eta="8 minutes"
        )
        db.session.add(v1)
        db.session.commit()
        print(" + Created Demo Vehicle Record: TS-DEMO-108 (Ambulance)")

        # ----------------------------------------------------
        # 3. DEMO EMERGENCY REQUESTS (REQ-DEMO-001, 002, 003)
        # ----------------------------------------------------
        reqs = [
            {
                "request_id": "REQ-DEMO-001",
                "emergency_type": "Accident",
                "priority": "Critical",
                "required_service": "Ambulance + Police",
                "latitude": 17.3850,
                "longitude": 78.4867,
                "location_name": "Hyderabad",
                "description": "Two vehicle collision on main arterial corridor",
                "status": "Dispatched",
                "assigned_driver": "Arjun Kumar (DRV-DEMO-001)",
                "assigned_vehicle": "TS-DEMO-108",
                "pickup_location": "Hyderabad",
                "destination": "City Emergency Hospital",
                "eta": "8 minutes",
                "user_id": user_map.get('citizen').id if user_map.get('citizen') else 1
            },
            {
                "request_id": "REQ-DEMO-002",
                "emergency_type": "Medical Emergency",
                "priority": "High",
                "required_service": "Ambulance",
                "latitude": 17.4000,
                "longitude": 78.4900,
                "location_name": "Hyderabad",
                "description": "Patient experiencing severe chest pain requiring urgent transit",
                "status": "Responding",
                "assigned_driver": "Arjun Kumar (DRV-DEMO-001)",
                "assigned_vehicle": "TS-DEMO-108",
                "pickup_location": "Hyderabad",
                "destination": "Regional General Care",
                "eta": "5 minutes",
                "user_id": user_map.get('citizen').id if user_map.get('citizen') else 1
            },
            {
                "request_id": "REQ-DEMO-003",
                "emergency_type": "Fire",
                "priority": "Critical",
                "required_service": "Fire Response",
                "latitude": 17.3700,
                "longitude": 78.4700,
                "location_name": "Hyderabad",
                "description": "Electrical short-circuit fire contained",
                "status": "Resolved",
                "assigned_driver": "Fire Engine Crew",
                "assigned_vehicle": "FIRE-DEMO-99",
                "pickup_location": "Hyderabad",
                "destination": "Station Safe Zone",
                "eta": "0 minutes",
                "user_id": user_map.get('citizen').id if user_map.get('citizen') else 1
            }
        ]

        for r_data in reqs:
            em = Emergency(**r_data)
            db.session.add(em)
            db.session.commit()
            print(f" + Created Demo Emergency Request: {r_data['request_id']} [{r_data['status']}]")

        # ----------------------------------------------------
        # 4. DEMO FIELD RESPONSE RECORD (INC-DEMO-001)
        # ----------------------------------------------------
        acc = Accident(
            incident_id="INC-DEMO-001",
            incident_type="Road Accident",
            latitude=17.3850,
            longitude=78.4867,
            location_name="Hyderabad",
            description="Vehicle collision causing lane blockade",
            severity="critical",
            priority="Critical",
            assigned_officer="Rahul Verma",
            officer_id="FIELD-DEMO-001",
            status="Responding",
            user_id=user_map.get('citizen').id if user_map.get('citizen') else 1
        )
        db.session.add(acc)
        db.session.commit()
        print(" + Created Demo Field Response Record: INC-DEMO-001")

        # ----------------------------------------------------
        # 5. DEMO ALERTS
        # ----------------------------------------------------
        alt = Alert(
            alert_type="accident",
            message="Critical Road Accident reported near Hyderabad Main Intersection. Emergency units dispatched.",
            latitude=17.3850,
            longitude=78.4867,
            severity="critical",
            active=True
        )
        db.session.add(alt)
        db.session.commit()
        print(" + Created Demo Active Alert")

        print("[RouteResQ Seeder] Database schema rebuilt and prototype records seeded successfully!")

if __name__ == '__main__':
    seed_database()
