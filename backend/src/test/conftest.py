import sys
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from src import create_app
from src.extensions import db
from src.models import Task, User, Workspace
from src.models.sensor.sensor import Sensor
from src.service.auth_service import AuthService


@pytest.fixture(scope="session")
def app():
    app = create_app("testing")
    with app.app_context():
        db.create_all()  # tables en mémoire
        yield app
        db.session.remove()
        db.drop_all()


@pytest.fixture(scope="function")
def client(app):
    return app.test_client()


@pytest.fixture(scope="function")
def test_user(app):
    with app.app_context():
        # Nettoyage utilisateurs
        db.session.query(User).delete()
        db.session.commit()

        user = User(
            username="testuser",
            email="test@example.com",
            password=AuthService.hash_password("password123"),
            is_validated=True,
        )
        db.session.add(user)
        db.session.commit()
        db.session.refresh(user)

        yield user

        # Cleanup
        db.session.query(User).delete()
        db.session.commit()


@pytest.fixture(scope="function")
def test_workspace(app):
    """Workspace de test pour sensors"""
    with app.app_context():
        # Nettoyage workspaces
        db.session.query(User).delete()
        db.session.query(Workspace).delete()
        db.session.commit()

        user = User(
            username="testuser",
            email="test500@example.com",
            password=AuthService.hash_password("password123"),
            is_validated=True,
        )
        print("i am the user", user)
        db.session.add(user)
        db.session.commit()
        db.session.refresh(user)

        ws = Workspace(name="Test Workspace", user_id=user.id, description="A test workspace", is_active=True)
        db.session.add(ws)
        db.session.commit()
        db.session.refresh(ws)

        yield ws

        # Cleanup
        db.session.query(Workspace).delete()
        db.session.query(User).delete()
        db.session.commit()


@pytest.fixture(scope="function")
def test_task(app, test_workspace):
    """Task fixture for testing"""
    with app.app_context():
        # Clean up existing tasks
        db.session.query(Task).delete()
        db.session.commit()

        task = Task(
            name="Test Task",
            description="A test task",
            status="pending"
        )
        
        db.session.add(task)
        db.session.commit()
        db.session.refresh(task)

        yield task

        # Cleanup
        db.session.query(Task).delete()
        db.session.commit()


@pytest.fixture(scope="function")
def test_sensor(app, test_workspace):
    """Sensor fixture for testing"""
    with app.app_context():
        # Clean up existing sensors
        db.session.query(Sensor).delete()
        db.session.commit()

        sensor = Sensor(
            name="Test Sensor",
            workspace_id=test_workspace.id
        )
        
        db.session.add(sensor)
        db.session.commit()
        db.session.refresh(sensor)

        yield sensor

        # Cleanup
        db.session.query(Sensor).delete()
        db.session.commit()