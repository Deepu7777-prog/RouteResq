from flask import Blueprint, request, jsonify
from models import db
from models.user import User

auth_bp = Blueprint('auth_bp', __name__)

@auth_bp.route('/auth/register', methods=['POST'])
@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    full_name = data.get('full_name')
    email = data.get('email')
    password = data.get('password')
    role = data.get('role', 'citizen')

    if not full_name or not email or not password:
        return jsonify({
            "success": False,
            "error": "full_name, email, and password are required"
        }), 400

    email_clean = email.strip()

    if User.query.filter_by(email=email_clean).first():
        return jsonify({
            "success": False,
            "error": "Account with this email already exists"
        }), 400

    # Real application new signups require verification if authority/officer role
    verification_status = 'VERIFIED' if role == 'citizen' else 'PENDING'

    user = User(
        full_name=full_name,
        email=email_clean,
        mobile=data.get('mobile', ''),
        role=role,
        verification_status=verification_status,
        officer_id=data.get('officer_id') or data.get('licenseNumber') or data.get('employeeId'),
        department=data.get('department') or data.get('organization') or 'Emergency Operations',
        location_name=data.get('district', 'Hyderabad, Telangana'),
        status_text='Available'
    )
    user.set_password(password)

    try:
        db.session.add(user)
        db.session.commit()
        return jsonify({
            "success": True,
            "message": "Registration submitted successfully.",
            "verification_status": verification_status,
            "role": user.role,
            "user": user.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "error": str(e)}), 500


@auth_bp.route('/auth/login', methods=['POST'])
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email = data.get('email') or data.get('username')
    password = data.get('password')

    if not email or not password:
        return jsonify({
            "success": False,
            "error": "Email/Username and password are required"
        }), 400

    email_clean = email.strip()
    user = User.query.filter_by(email=email_clean).first()

    # Fallback match for demo username shorthand without domain
    if not user and not email_clean.includes('@') if hasattr(email_clean, 'includes') else not '@' in email_clean:
        prefix = email_clean.split('_')[0]
        user = User.query.filter_by(email=f"{prefix}.demo@routeresq.com").first()

    if not user or not user.check_password(password):
        return jsonify({
            "success": False,
            "error": "Invalid email or password"
        }), 401

    return jsonify({
        "success": True,
        "message": f"Welcome back, {user.full_name}!",
        "role": user.role,
        "verification_status": user.verification_status,
        "user": user.to_dict()
    }), 200


@auth_bp.route('/auth/profile/<int:user_id>', methods=['GET'])
def get_profile(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"success": False, "error": "User profile not found"}), 404

    return jsonify({
        "success": True,
        "user": user.to_dict()
    }), 200


@auth_bp.route('/auth/verify/<int:user_id>', methods=['PATCH'])
def verify_user(user_id):
    data = request.get_json() or {}
    status = data.get('status', 'VERIFIED')

    user = User.query.get(user_id)
    if not user:
        return jsonify({"success": False, "error": "User not found"}), 404

    user.verification_status = status
    try:
        db.session.commit()
        return jsonify({
            "success": True,
            "message": f"User verification status updated to {status}",
            "user": user.to_dict()
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "error": str(e)}), 500
