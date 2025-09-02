import os

from flask import jsonify
from flask_cors import CORS
from src import create_app
from src.models import Sensor, Task
from src.service.mail_service import MailService
from src.service.redis_client import redis_client
from tasks import treat_sleep_analysis, treat_work_analysis

app = create_app()

CORS(
    app,
    resources={
        r"/*": {  # Allow all routes
            "origins": "*",  # Allow all origins
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["*"],  # Allow all headers
            "expose_headers": ["*"],
        }
    },
)


@app.route("/")
def home():
    print("Home route accessed")

    # task_m = Task.query.filter_by(name="sleep").first()
    # sensors = task_m.sensors if task_m else []
    # print(f"Sensors fetched: {sensors}")
    # print(f"Task fetched: {task_m}")
    # sensors = Sensor.query.filter_by(task_id=task_m.id).all()
    # treat_sleep_analysis.delay()
    # treat_work_analysis.delay()
    # MailService.send_work_analysis_email("test@example.com", {"data": "test"})
    return jsonify({"message": "Welcome to the Flask app! uwu", "db": os.getenv("POSTGRES_URI", "uwu")}), 200


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
