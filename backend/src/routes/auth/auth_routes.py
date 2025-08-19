from flask import Blueprint, request, jsonify
from src.models import User
from src.service.auth_service import AuthService
from src.service.mail_service import MailService
from src.schemas.user_schema import UserSignupSchema, UserLoginSchema
from src.extensions import db

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/signup', methods=['POST'])
def signup():
    try:
        schema = UserSignupSchema()
        data = schema.load(request.get_json())
        
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Email already exists'}), 400

        user = User(
            username=data['username'],
            email=data['email'],
            password=AuthService.hash_password(data['password']),
            is_validated=False
        )
        
        db.session.add(user)
        db.session.commit()

        token = AuthService.create_token(str(user.id), expiry_minutes=60)
        MailService.send_validation_email(user.email, token)
        
        return jsonify({'message': 'User created, validation email sent'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/signin', methods=['POST'])
def signin():
    schema = UserLoginSchema()
    data = schema.load(request.get_json())
    
    user = User.query.filter_by(email=data['email']).first()
    if not user or not AuthService.check_password(user, data['password']):
        return jsonify({'error': 'Invalid credentials'}), 401
        
    if not user.is_validated:
        return jsonify({'error': 'Account not validated'}), 403
        
    token = AuthService.create_token(user.id)
    return jsonify({'token': token})

# Add other auth routes (forgot-password, reset-password, validate)
