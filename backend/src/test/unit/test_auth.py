import pytest
from src.service.auth_service import AuthService
from src.models import User
from werkzeug.security import check_password_hash
import jwt
import datetime

def test_password_hashing():
    password = "test_password"
    hashed = AuthService.hash_password(password)
    assert check_password_hash(hashed, password)
    assert not check_password_hash(hashed, "wrong_password")

def test_token_creation_and_verification(app):
    with app.app_context():
        user_id = 1
        token = AuthService.create_token(user_id, expiry_minutes=30)
        decoded = AuthService.verify_token(token)
        assert decoded['user_id'] == user_id

def test_invalid_token(app):
    with app.app_context():
        # Using a properly formatted but invalid JWT token
        expired_payload = {
            'user_id': 1,
            'exp': datetime.datetime.utcnow() - datetime.timedelta(minutes=1)
        }
        token = jwt.encode(expired_payload, 'test-secret-key', algorithm='HS256')
        if isinstance(token, bytes):
            token = token.decode('utf-8')
        decoded = AuthService.verify_token(token)
        assert decoded is None

class TestAuthRoutes:
    def test_signup_success(self, client, app):
        with app.app_context():
            response = client.post('/api/auth/signup', json={
                'username': 'newtestuser',
                'email': 'newtest@example.com',
                'password': 'password123'
            })
            assert response.status_code == 201
            assert b'User created' in response.data

    def test_signup_duplicate_email(self, client, app):
        # First signup
        client.post('/api/auth/signup', json={
            'username': 'testuser1',
            'email': 'test@example.com',
            'password': 'password123'
        })
        # Duplicate email signup
        response = client.post('/api/auth/signup', json={
            'username': 'testuser2',
            'email': 'test@example.com',
            'password': 'password123'
        })
        assert response.status_code == 400
        assert b'Email already exists' in response.data

    def test_signin_success(self, client, app, test_user):
        with app.app_context():
            response = client.post('/api/auth/signin', json={
                'email': test_user.email,
                'password': 'password123'
            })
            assert response.status_code == 200
            assert 'token' in response.json
