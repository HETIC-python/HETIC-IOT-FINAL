from datetime import datetime

from flask import current_app
from src.extensions import db
from src.models import User
from werkzeug.security import generate_password_hash


def seed_users():
    try:
        # Delete existing users
        User.query.delete()
        
        # Create test users
        users = [
            User(
                email='admin@iot.com',
                password="test1234",
                created_at=datetime.utcnow()
            ),
            User(
                email='test@iot.com',
                password="test1234",
                created_at=datetime.utcnow()
            ),
            User(
                email='demo@iot.com',
                password="test1234",
                created_at=datetime.utcnow()
            )
        ]
        
        # Add users to database
        db.session.bulk_save_objects(users)
        db.session.commit()
        
        current_app.logger.info(f'Successfully seeded {len(users)} users')
        
    except Exception as e:
        current_app.logger.error(f'Error seeding users: {str(e)}')
        db.session.rollback()
        raise e
