from datetime import datetime

from flask import current_app
from src.extensions import db
from src.models import Sensor, Task, User, Workspace

from .seed_users import seed_users


def seed_tasks():
    try:
        Task.query.delete()
        task_data = [
            Task(name="sleep", description="sleep analysis", status="active"),
            Task(name="work", description="sleep work analysis", status="active"),
        ]

        for data in task_data:
            db.session.add(data)
        db.session.commit()

        current_app.logger.info(f"Successfully seeded {len(task_data)} tasks")

    except Exception as e:
        current_app.logger.error(f"Error seeding tasks: {str(e)}")
        db.session.rollback()
        raise e
