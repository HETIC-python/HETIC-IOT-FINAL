import pytest
from src.service.user import UserService
from src.models import User
from src.extensions import db

def test_get_user_by_id(app, test_user):
    with app.app_context():
        # Refresh the session to ensure test_user is attached
        test_user = db.session.merge(test_user)
        user = UserService.get_user_by_id(test_user.id)
        assert user is not None
        assert user.email == test_user.email

def test_get_user_by_email(app, test_user):
    with app.app_context():
        # Refresh the session to ensure test_user is attached
        test_user = db.session.merge(test_user)
        user = UserService.get_user_by_email(test_user.email)
        assert user is not None
        assert user.id == test_user.id

def test_create_user(app):
    with app.app_context():
        user_data = {
            'username': 'newuser',
            'email': 'new@example.com',
            'password': 'hashedpassword',
            'is_validated': True
        }
        user = UserService.create_user(user_data)
        print("Created user:", user)
        assert user.email == user_data['email']
        assert user.username == user_data['username']

def test_update_user(app, test_user):
    with app.app_context():
        test_user = db.session.merge(test_user)
        update_data = {
            'username': 'updated_username'
        }
        updated_user = UserService.update_user(test_user.id, update_data)
        db.session.refresh(updated_user)
        assert updated_user.username == 'updated_username'
