from flask import Flask, jsonify
from flask_cors import CORS
from config import Config
from models import db

from routes.user_routes import user_bp
from routes.emergency_routes import emergency_bp
from routes.location_routes import location_bp
from routes.vehicle_routes import vehicle_bp
from routes.accident_routes import accident_bp
from routes.alert_routes import alert_bp
from routes.auth_routes import auth_bp
from routes.state_routes import state_bp

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Configure CORS for local development frontend
    CORS(app, resources={r"/api/*": {"origins": ["http://localhost:5173", "http://127.0.0.1:5173", "*"]}})

    db.init_app(app)

    with app.app_context():
        db.create_all()

    # Health Check Endpoint
    @app.route('/api/health', methods=['GET'])
    def health_check():
        return jsonify({
            "status": "success",
            "message": "RouteResQ backend is running"
        }), 200

    # Register Blueprints under /api prefix
    app.register_blueprint(auth_bp, url_prefix='/api')
    app.register_blueprint(user_bp, url_prefix='/api')
    app.register_blueprint(emergency_bp, url_prefix='/api')
    app.register_blueprint(location_bp, url_prefix='/api')
    app.register_blueprint(vehicle_bp, url_prefix='/api')
    app.register_blueprint(accident_bp, url_prefix='/api')
    app.register_blueprint(alert_bp, url_prefix='/api')
    app.register_blueprint(state_bp, url_prefix='/api')

    # Error Handlers
    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"success": False, "error": "Endpoint not found"}), 404

    @app.errorhandler(500)
    def server_error(e):
        return jsonify({"success": False, "error": "Internal server error"}), 500

    return app

app = create_app()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
