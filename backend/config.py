import os

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DB_DIR = os.path.join(BASE_DIR, 'database')

if not os.path.exists(DB_DIR):
    os.makedirs(DB_DIR)

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'routeresq_flask_secret_2026_ner_sos')
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or f"sqlite:///{os.path.join(DB_DIR, 'app.db')}"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
