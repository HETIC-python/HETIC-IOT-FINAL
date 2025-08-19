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

    def test_signin_unvalidated_account(self, client, app):
        with app.app_context():
            # Create unvalidated user
            client.post('/api/auth/signup', json={
                'username': 'unvalidated',
                'email': 'unvalidated@example.com',
                'password': 'password123'
            })
            
            response = client.post('/api/auth/signin', json={
                'email': 'unvalidated@example.com',
                'password': 'password123'
            })
            assert response.status_code == 403
            assert b'Account not validated' in response.data

    def test_forgot_password(self, client, app, test_user):
        with app.app_context():
            response = client.post('/api/auth/forgot-password', json={
                'email': test_user.email
            })
            assert response.status_code == 200
            assert b'Password reset instructions sent' in response.data

    def test_forgot_password_invalid_email(self, client, app):
        with app.app_context():
            response = client.post('/api/auth/forgot-password', json={
                'email': 'nonexistent@example.com'
            })
            assert response.status_code == 404
            assert b'Email not found' in response.data

    def test_reset_password(self, client, app, test_user):
        with app.app_context():
            # Create valid token
            token = AuthService.create_token(test_user.id, expiry_minutes=30)
            
            response = client.post(f'/api/auth/reset-password/{token}', json={
                'password': 'newpassword123'
            })
            assert response.status_code == 200
            assert b'Password updated successfully' in response.data

            # Try logging in with new password
            response = client.post('/api/auth/signin', json={
                'email': test_user.email,
                'password': 'newpassword123'
            })
            assert response.status_code == 200
            assert 'token' in response.json

    def test_reset_password_invalid_token(self, client, app):
        with app.app_context():
            response = client.post('/api/auth/reset-password/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30', json={
                'password': 'newpassword123'
            })
            assert response.status_code == 400

    def test_validate_account(self, client, app, test_user):
        with app.app_context():
            # Create unvalidated user
            signup_response = client.post('/api/auth/signup', json={
                'username': 'newtestuser',
                'email': 'newtest@example.com',
                'password': 'password123'
            })
            assert signup_response.status_code == 201
            user = User.query.filter_by(email='newtest@example.com').first()
            token = AuthService.create_token(user.id)
            response = client.get(f'/api/auth/validate/{token}')
            assert response.status_code == 200
            assert b'Account validated successfully' in response.data

            # Verify user is now validated
            updated_user = User.query.get(user.id)
            assert updated_user.is_validated is True
