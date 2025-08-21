import pytest
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from src.extensions import db
from src import create_app
from src.models import User
from src.service.auth_service import AuthService

@pytest.fixture(scope='session')
def app():
    app = create_app('testing')
    with app.app_context():
        db.create_all()  # Create all tables in the in-memory database
        yield app
        db.session.remove()
        db.drop_all()

@pytest.fixture(scope='function')
def client(app):
    return app.test_client()

@pytest.fixture(scope='function')
def test_user(app):
    with app.app_context():
        # Clear any existing users
        db.session.query(User).delete()
        db.session.commit()
        
        # Create new test user
        user = User(
            username='testuser',
            email='test@example.com',
            password=AuthService.hash_password('password123'),
            is_validated=True
        )
        db.session.add(user)
        db.session.commit()
        
        # Refresh user instance to ensure it's bound to the session
        db.session.refresh(user)
        
        yield user
        
        # Cleanup
        db.session.query(User).delete()
        db.session.commit()
