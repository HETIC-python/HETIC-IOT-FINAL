from config import Config, TestConfig
from flask import Flask
from flask_migrate import Migrate

from .extensions import db
from .routes import register_blueprints

migrate = Migrate()


def create_app(environment=None):
    app = Flask(__name__)

    if environment == 'testing':
        app.config.from_object(TestConfig)
    else:
        app.config.from_object(Config)

    db.init_app(app)
    migrate.init_app(app, db)  # Initialize Flask-Migrate

    # with app.app_context():
    #     db.create_all()

    register_blueprints(app)
    return app