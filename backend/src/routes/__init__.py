from flask import Blueprint
from .user.user_routes import user_bp
from .workspace.workspace_routes import workspace_bp

main = Blueprint('main', __name__)

def register_blueprints(app):
    app.register_blueprint(user_bp)
    app.register_blueprint(workspace_bp) 