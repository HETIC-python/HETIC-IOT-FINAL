from datetime import datetime, timedelta
from functools import wraps

import jwt
from flask import current_app, jsonify, request
from src.models import User
from werkzeug.security import check_password_hash, generate_password_hash


class AuthService:
    @staticmethod
    def create_token(user_id, expiry_minutes=30):
        return jwt.encode(
            {
                "user_id": user_id,
                "exp": datetime.utcnow() + timedelta(minutes=expiry_minutes),
            },
            current_app.config["SECRET_KEY"],
            algorithm="HS256",
        )

    @staticmethod
    def verify_token(token):
        try:
            decoded = jwt.decode(
                token, current_app.config["SECRET_KEY"], algorithms=["HS256"]
            )
            return decoded
        except Exception as e:
            current_app.logger.error(f"Token verification error: {str(e)}")
            return None

    @staticmethod
    def hash_password(password):
        return generate_password_hash(password)

    @staticmethod
    def check_password(user, password):
        return check_password_hash(user.password, password)

    @staticmethod
    def verify_user_authenticated(token):
        decoded = AuthService.verify_token(token)
        user = User.query.get(decoded["user_id"]) if decoded else None
        return user is not None and user.is_validated

    @staticmethod
    def verify_user_admin(token):
        decoded = AuthService.verify_token(token)
        user = User.query.get(decoded["user_id"]) if decoded else None
        return user is not None and user.is_admin

    @staticmethod
    def get_user_from_token(token):
        decoded = AuthService.verify_token(token)
        if decoded:
            return User.query.get(decoded["user_id"])
        return None

    @staticmethod
    def require_authentication(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            try:
                token = request.headers.get("Authorization")
                if not token:
                    return jsonify({"error": "Authentication required"}), 401
                if token.startswith("Bearer "):
                    token = token.split(" ", 1)[1]
                user = AuthService.get_user_from_token(token)
                if not user:
                    return jsonify({"error": "Invalid or expired token"}), 401
                return func(user, *args, **kwargs)
            except Exception as e:
                current_app.logger.error(f"Auth error: {str(e)}")
                return jsonify({"error": "Authentication error"}), 401

        return wrapper
