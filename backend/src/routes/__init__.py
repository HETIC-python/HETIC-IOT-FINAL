from flask import Blueprint

from .order.order import order_bp
from .user.user_routes import user_bp
from .workspace.workspace_routes import workspace_bp
from .task.task_routes import task_bp
from .auth.auth_routes import auth_bp
from .LSTM.lstm_routes import lstm_bp

main = Blueprint("main", __name__)


def register_blueprints(app):

    app.register_blueprint(task_bp, url_prefix='/api')
    app.register_blueprint(order_bp, url_prefix="/api")
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(user_bp, url_prefix="/api")
    app.register_blueprint(workspace_bp, url_prefix="/api")
    app.register_blueprint(lstm_bp, url_prefix="/api/lstm")
