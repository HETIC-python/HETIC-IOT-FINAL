# test_sensor.py
from datetime import datetime
from flask import Flask
from src.extensions import db
from src.models import Sensor  # chemin selon ton arborescence

def create_test_app():
    app = Flask(__name__)
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///:memory:"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    db.init_app(app)
    return app

app = create_test_app()

with app.app_context():
    db.create_all()

    # Créer un capteur
    sensor = Sensor(
        name="Capteur Test",
        status="online",
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
        temperature=23.5,
        humidity=45.2,
        pressure=1012.3,
        mouvement=0.0
    )

    db.session.add(sensor)
    db.session.commit()

    # Vérifier
    s = Sensor.query.first()
    print(s)
