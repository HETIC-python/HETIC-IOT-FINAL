from datetime import datetime

from flask import current_app
from src.extensions import db
from src.models import User, Workspace


def seed_workspaces():
    try:
        # Delete existing workspaces
        Workspace.query.delete()
        
        # Get admin user
        admin_user = User.query.filter_by(email='admin@iot.com').first()
        if not admin_user:
            current_app.logger.error('Admin user not found, cannot seed workspaces')
            return

        # Create test workspaces
        workspaces = [
            Workspace(
                user_id=admin_user.id,
                name='Home Office',
                description='Environment monitoring for home office setup',
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow(),
                is_active=True
            ),
            Workspace(
                user_id=admin_user.id,
                name='Server Room',
                description='Temperature and humidity monitoring for server infrastructure',
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow(),
                is_active=True
            ),
            Workspace(
                user_id=admin_user.id,
                name='Living Room',
                description='Air quality monitoring for living space',
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow(),
                is_active=True
            )
        ]
        
        # Add workspaces to database
        db.session.bulk_save_objects(workspaces)
        db.session.commit()
        
        current_app.logger.info(f'Successfully seeded {len(workspaces)} workspaces')
        
    except Exception as e:
        current_app.logger.error(f'Error seeding workspaces: {str(e)}')
        db.session.rollback()
        raise e
