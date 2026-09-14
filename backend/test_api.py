import unittest
import json
import os
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import create_app
from models import db
from seed import seed_database

class TestRouteResQDemoAccounts(unittest.TestCase):

    def setUp(self):
        self.app = create_app()
        self.client = self.app.test_client()

    def test_01_health_check(self):
        res = self.client.get('/api/health')
        data = res.get_json()
        self.assertEqual(res.status_code, 200)
        self.assertEqual(data['status'], 'success')

    def test_02_demo_logins(self):
        demo_credentials = [
            ("citizen.demo@routeresq.com", "Demo@123", "citizen"),
            ("driver.demo@routeresq.com", "Demo@123", "driver"),
            ("logistics.demo@routeresq.com", "Demo@123", "logistics_officer"),
            ("field.demo@routeresq.com", "Demo@123", "field_officer"),
            ("admin.demo@routeresq.com", "Demo@123", "admin")
        ]

        for email, pwd, expected_role in demo_credentials:
            res = self.client.post('/api/auth/login', json={"email": email, "password": pwd})
            data = res.get_json()
            self.assertEqual(res.status_code, 200, f"Login failed for {email}")
            self.assertTrue(data['success'])
            self.assertEqual(data['role'], expected_role)
            print(f" + Authenticated [{expected_role.upper()}]: {email}")

    def test_03_emergency_requests(self):
        res = self.client.get('/api/emergency/1')
        self.assertEqual(res.status_code, 200)

    def test_04_vehicles_and_nearest(self):
        res = self.client.get('/api/vehicles')
        self.assertEqual(res.status_code, 200)
        self.assertTrue(len(res.get_json()['vehicles']) > 0)

        res_near = self.client.get('/api/nearest/ambulance?latitude=17.3850&longitude=78.4867')
        self.assertEqual(res_near.status_code, 200)

if __name__ == '__main__':
    unittest.main()
