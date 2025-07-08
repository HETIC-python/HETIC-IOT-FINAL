from flask import Blueprint
from .user.user_routes import user_bp

main = Blueprint('main', __name__)

def register_blueprints(app):
    app.register_blueprint(user_bp) 