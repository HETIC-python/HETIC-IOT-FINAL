from datetime import datetime

from flask import current_app
from src.extensions import db
from src.models import Sensor, Settings, Task, User, Workspace
from src.service.auth_service import AuthService


def seed_users():
    try:
        User.query.delete()
        Settings.query.delete()
        
        users = [
            User(
                username='admin',
                email='admin@iot.com',
                password=AuthService.hash_password('test1234'),
                created_at=datetime.utcnow(),
                role='admin',
                is_validated=True
            ),
            User(
                username='test',
                email='test@iot.com',
                password=AuthService.hash_password('test1234'),
                created_at=datetime.utcnow(),
                role='user',
                is_validated=True
            ),
            User(
                username='demo',
                email='demo@iot.com',
                password=AuthService.hash_password('test1234'),
                created_at=datetime.utcnow(),
                role='user',
                is_validated=True
            )
        ]
        
        db.session.bulk_save_objects(users)
        db.session.commit()
        
        current_app.logger.info(f'Successfully seeded {len(users)} users')
        return users[0]  # NOTE: Return admin user for other seeders
        
    except Exception as e:
        current_app.logger.error(f'Error seeding users: {str(e)}')
        db.session.rollback()
        raise e
