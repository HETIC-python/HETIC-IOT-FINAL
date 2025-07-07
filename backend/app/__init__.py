from flask import Flask
from .extensions import db
from config import Config
from .routes import register_blueprints

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    

    register_blueprints(app)

    

    return app 