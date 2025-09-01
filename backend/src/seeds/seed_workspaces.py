from datetime import datetime

from flask import current_app
from src.extensions import db
from src.models import Sensor, Task, User, Workspace

from .seed_users import seed_users

sensor1, sensor2, sensor3 = 1961532156, 1042691358, 546745754

def seed_workspaces():
    try:
        Sensor.query.delete()
        Workspace.query.delete()
        Task.query.delete()

        admin_user = User.query.filter_by(email="admin@iot.com").first()
        test_user = User.query.filter_by(email="test@iot.com").first()
        if not admin_user:
            admin_user = seed_users()

        if not admin_user:
            current_app.logger.error("Admin user not found and could not be created")
            return
        sleep_task = Task(name="sleep", description="Sleep analysis", status="active")
        work_task = Task(name="work", description="Work analysis", status="active")
        db.session.add(sleep_task)
        db.session.add(work_task)
        db.session.flush()

        workspace_data = [
            {
                "workspace": Workspace(
                    user_id=test_user.id,
                    name="Home Office",
                    description="Environment monitoring for home office setup",
                    created_at=datetime.utcnow(),
                    updated_at=datetime.utcnow(),
                    is_active=True,
                ),
                "sensors": [
                    {
                        "name": "Office Temperature",
                        "source_id": sensor1,
                        "status": "active",
                    },
                    {
                        "name": "Office Humidity",
                        "source_id": sensor2,
                        "status": "active",
                    },
                    {
                        "name": "Office CO2",
                        "source_id": sensor3,
                        "status": "active",
                    }
                ],
            },
            {
                "workspace": Workspace(
                    user_id=test_user.id,
                    name="Server Room",
                    description="Temperature and humidity monitoring for server infrastructure",
                    created_at=datetime.utcnow(),
                    updated_at=datetime.utcnow(),
                    is_active=True,
                ),
                "sensors": [
                    # {
                    #     "name": "Server Rack 1",
                    #     "source_id": "1042691360",
                    #     "status": "active",
                    # },
                    # {
                    #     "name": "Server Rack 2",
                    #     "source_id": "1042691361",
                    #     "status": "active",
                    # },
                ],
            },
            {
                "workspace": Workspace(
                    user_id=test_user.id,
                    name="Living Room",
                    description="Air quality monitoring for living space",
                    created_at=datetime.utcnow(),
                    updated_at=datetime.utcnow(),
                    is_active=True,
                ),
                "sensors": [
                    # {
                    #     "name": "Living Room Air Quality",
                    #     "source_id": "1042691362",
                    #     "status": "active",
                    # },
                    # {
                    #     "name": "Living Room Temperature",
                    #     "source_id": "1042691363",
                    #     "status": "active",
                    # },
                ],
            },
        ]

        for data in workspace_data:
            workspace = data["workspace"]
            db.session.add(workspace)
            db.session.flush()

            # Create and associate sensors
            for sensor_data in data["sensors"]:
                sensor = Sensor(
                    workspace_id=workspace.id,
                    name=sensor_data["name"],
                    source_id=sensor_data["source_id"],
                    status=sensor_data["status"],
                )
                sensor.tasks.append(sleep_task)
                db.session.add(sensor)

        db.session.commit()

        current_app.logger.info(
            f"Successfully seeded {len(workspace_data)} workspaces with sensors + tasks"
        )

    except Exception as e:
        current_app.logger.error(f"Error seeding workspaces and sensors: {str(e)}")
        db.session.rollback()
        raise e
