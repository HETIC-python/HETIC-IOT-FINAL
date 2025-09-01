from datetime import datetime

from flask import current_app
from src.extensions import db
from src.models import Sensor, Settings, Task, User, Workspace
from src.service.auth_service import AuthService


def seed_users():
    try:
        # Clear existing data
        User.query.delete()
        Settings.query.delete()

        # Create users
        users = [
            User(
                username="admin",
                email="admin@iot.com",
                password=AuthService.hash_password("test1234"),
                created_at=datetime.utcnow(),
                role="admin",
                is_validated=True,
            ),
            User(
                username="test",
                email="test@iot.com",
                password=AuthService.hash_password("test1234"),
                created_at=datetime.utcnow(),
                role="user",
                is_validated=True,
            ),
            User(
                username="demo",
                email="demo@iot.com",
                password=AuthService.hash_password("test1234"),
                created_at=datetime.utcnow(),
                role="user",
                is_validated=True,
            ),
        ]

        for user in users:
            db.session.add(user)
        db.session.commit()

        print("users", users[0].id, users[1].id, users[2].id)

        settings = [
            Settings(
                user_id=users[0].id,
                email_notif=True,
                mobile_notif=True,
                theme_mode="dark",
            ),
            Settings(
                user_id=users[1].id,
                email_notif=False,
                mobile_notif=True,
                theme_mode="light",
            ),
            Settings(
                user_id=users[2].id,
                email_notif=True,
                mobile_notif=False,
                theme_mode="light",
            ),
        ]

        for setting in settings:
            db.session.add(setting)
        db.session.commit()

        current_app.logger.info(
            f"Successfully seeded {len(users)} users and {len(settings)} settings"
        )
        return users[0]  # NOTE: Return admin user for other seeders

    except Exception as e:
        current_app.logger.error(f"Error seeding users and settings: {str(e)}")
        db.session.rollback()
        raise e
