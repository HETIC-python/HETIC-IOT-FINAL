import logging

from flask import Blueprint, jsonify, request
from src.extensions import db
from src.models import Settings, User
from src.schemas.user_schema import UserLoginSchema, UserSignupSchema
from src.service.auth_service import AuthService
from src.service.mail_service import MailService

# Configuration du logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/signup', methods=['POST'])
def signup():
    try:
        schema = UserSignupSchema()
        data = schema.load(request.get_json())
        
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Email already exists'}), 400
            
        if User.query.filter_by(username=data['username']).first():
            return jsonify({'error': 'Username already exists'}), 400

        user = User(
            username=data['username'],
            email=data['email'],
            password=AuthService.hash_password(data['password']),
            is_validated=False
        )
        
        db.session.add(user)
        db.session.flush() 

        if not Settings.query.filter_by(user_id=user.id).first():
            setting = Settings(user_id=user.id)
            db.session.add(setting)

        db.session.commit()

        token = AuthService.create_token(str(user.id), expiry_minutes=60)
        MailService.send_validation_email(user.email, token)
        
        return jsonify({'message': 'User created, validation email sent'}), 201
    except Exception as e:
        db.session.rollback()
        logger.error(f"Erreur lors de l'inscription: {str(e)}")
        return jsonify({'error': 'Server Error', 'message': 'Unable to create user'}), 500

@auth_bp.route('/signin', methods=['POST'])
def signin():
    try:
        schema = UserLoginSchema()
        data = schema.load(request.get_json())
        
        user = User.query.filter_by(email=data['email']).first()
        if not user or not AuthService.check_password(user, data['password']):
            return jsonify({'error': 'Invalid credentials'}), 401
            
        if not user.is_validated:
            return jsonify({'error': 'Account not validated'}), 403
            
        token = AuthService.create_token(user.id, expiry_minutes=60*24*100)
        return jsonify({'token': token})
    except Exception as e:
        logger.error(f"Erreur lors de la connexion: {str(e)}")
        return jsonify({'error': 'Server Error', 'message': 'Unable to authenticate user'}), 500

@auth_bp.route('/me', methods=['GET'])
def get_current_user():
    """Récupère les informations de l'utilisateur connecté"""
    try:
        # Récupérer le token depuis le header Authorization
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': 'Unauthorized', 'message': 'Missing or invalid authorization header'}), 401
        
        token = auth_header.split(' ')[1]
        
        # Vérifier et décoder le token
        decoded = AuthService.verify_token(token)
        if not decoded:
            return jsonify({'error': 'Unauthorized', 'message': 'Invalid or expired token'}), 401
        
        user_id = decoded.get('user_id')
        if not user_id:
            return jsonify({'error': 'Unauthorized', 'message': 'Invalid token format'}), 401
        
        # Récupérer l'utilisateur
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'Not Found', 'message': 'User not found'}), 404
        
        # Retourner les informations de l'utilisateur (sans le mot de passe)
        user_data = {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'is_validated': user.is_validated,
            'role': user.role,
            'created_at': user.created_at.isoformat() if user.created_at else None,
            'address_line': user.address_line,
            'city': user.city,
            'postal_code': user.postal_code,
            'country': user.country
        }
        
        logger.info(f"Informations utilisateur récupérées avec succès pour l'utilisateur {user.id}")
        return jsonify({'user': user_data})
        
    except Exception as e:
        logger.error(f"Erreur lors de la récupération des informations utilisateur: {str(e)}")
        return jsonify({'error': 'Server Error', 'message': 'Unable to retrieve user information'}), 500

@auth_bp.route('/validate/<token>', methods=['GET'])
def validate_account(token):
    try:
        decoded = AuthService.verify_token(token)
        if not decoded:
            return jsonify({'error': 'Invalid or expired token'}), 400

        user = User.query.get(decoded['user_id'])
        if not user:
            return jsonify({'error': 'User not found'}), 404

        user.is_validated = True
        db.session.commit()
        return jsonify({'message': 'Account validated successfully'})
    except Exception as e:
        logger.error(f"Erreur lors de la validation du compte: {str(e)}")
        return jsonify({'error': 'Server Error', 'message': 'Unable to validate account'}), 500

@auth_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    try:
        data = request.get_json()
        email = data.get('email')
        user = User.query.filter_by(email=email).first()
        
        if not user:
            return jsonify({'error': 'Email not found'}), 404

        token = AuthService.create_token(user.id, expiry_minutes=30)
        MailService.send_reset_password_email(email, token)
        
        return jsonify({'message': 'Password reset instructions sent'})
    except Exception as e:
        logger.error(f"Erreur lors de la demande de réinitialisation de mot de passe: {str(e)}")
        return jsonify({'error': 'Server Error', 'message': 'Unable to process password reset request'}), 500

@auth_bp.route('/reset-password/<token>', methods=['POST'])
def reset_password(token):
    try:
        decoded = AuthService.verify_token(token)
        if not decoded:
            return jsonify({'error': 'Invalid or expired token'}), 400

        user = User.query.get(decoded['user_id'])
        if not user:
            return jsonify({'error': 'User not found'}), 404

        data = request.get_json()
        new_password = data.get('password')
        
        if not new_password:
            return jsonify({'error': 'Password is required'}), 400

        user.password = AuthService.hash_password(new_password)
        db.session.commit()
        
        return jsonify({'message': 'Password updated successfully'})
    except Exception as e:
        logger.error(f"Erreur lors de la réinitialisation du mot de passe: {str(e)}")
        return jsonify({'error': 'Server Error', 'message': 'Unable to reset password'}), 500
