from functools import wraps

from flask import jsonify, request
from src.models import User
from src.service.auth_service import AuthService


def require_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': 'Unauthorized', 'message': 'Missing or invalid authorization header'}), 401
        
        token = auth_header.split(' ')[1]
        decoded = AuthService.verify_token(token)
        
        if not decoded:
            return jsonify({'error': 'Unauthorized', 'message': 'Invalid or expired token'}), 401
        
        user_id = decoded.get('user_id')
        if not user_id:
            return jsonify({'error': 'Unauthorized', 'message': 'Invalid token format'}), 401
        
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'Not Found', 'message': 'User not found'}), 404
            
        return f(user, request, *args, **kwargs)
    return decorated
