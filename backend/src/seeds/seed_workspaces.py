from datetime import datetime

from flask import current_app
from src.extensions import db
from src.models import Sensor, User, Workspace

from .seed_users import seed_users


def seed_workspaces():
    try:
        Sensor.query.delete()
        Workspace.query.delete()

        admin_user = User.query.filter_by(email="admin@iot.com").first()
        if not admin_user:
            admin_user = seed_users()

        if not admin_user:
            current_app.logger.error("Admin user not found and could not be created")
            return

        workspace_data = [
            {
                "workspace": Workspace(
                    user_id=admin_user.id,
                    name="Home Office",
                    description="Environment monitoring for home office setup",
                    created_at=datetime.utcnow(),
                    updated_at=datetime.utcnow(),
                    is_active=True,
                ),
                "sensors": [
                    {
                        "name": "Office Temperature",
                        "source_id": "1961532156",
                        "status": "active",
                    },
                    {
                        "name": "Office Humidity",
                        "source_id": "1042691358",
                        "status": "active",
                    },
                ],
            },
            {
                "workspace": Workspace(
                    user_id=admin_user.id,
                    name="Server Room",
                    description="Temperature and humidity monitoring for server infrastructure",
                    created_at=datetime.utcnow(),
                    updated_at=datetime.utcnow(),
                    is_active=True,
                ),
                "sensors": [
                    {
                        "name": "Server Rack 1",
                        "source_id": "1042691360",
                        "status": "active",
                    },
                    {
                        "name": "Server Rack 2",
                        "source_id": "1042691361",
                        "status": "active",
                    },
                ],
            },
            {
                "workspace": Workspace(
                    user_id=admin_user.id,
                    name="Living Room",
                    description="Air quality monitoring for living space",
                    created_at=datetime.utcnow(),
                    updated_at=datetime.utcnow(),
                    is_active=True,
                ),
                "sensors": [
                    {
                        "name": "Living Room Air Quality",
                        "source_id": "1042691362",
                        "status": "active",
                    },
                    {
                        "name": "Living Room Temperature",
                        "source_id": "1042691363",
                        "status": "active",
                    },
                ],
            },
        ]

        # Add workspaces and their sensors
        for data in workspace_data:
            workspace = data["workspace"]
            db.session.add(workspace)
            db.session.flush()  # Get workspace ID

            # Create and associate sensors
            for sensor_data in data["sensors"]:
                sensor = Sensor(
                    workspace_id=workspace.id,
                    name=sensor_data["name"],
                    source_id=sensor_data["source_id"],
                    status=sensor_data["status"],
                )
                db.session.add(sensor)

        db.session.commit()

        current_app.logger.info(
            f"Successfully seeded {len(workspace_data)} workspaces with sensors"
        )

    except Exception as e:
        current_app.logger.error(f"Error seeding workspaces and sensors: {str(e)}")
        db.session.rollback()
        raise e
