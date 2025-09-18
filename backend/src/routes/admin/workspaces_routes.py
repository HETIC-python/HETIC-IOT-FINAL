from flask import Blueprint, jsonify, request
from src.decorators.auth_decorator import require_admin
from src.extensions import db
from src.influxdb_client import get_influxdb_client
from src.models import User, Workspace
from src.service.auth_service import AuthService

admin_workspaces_bp = Blueprint("admin_workspaces", __name__)


@admin_workspaces_bp.route("/users/<int:user_id>/workspaces", methods=["GET"])
@require_admin
def get_user_workspaces(user_id):
    try:
        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404

        workspaces = Workspace.query.filter_by(user_id=user.id).all()
        return (
            jsonify(
                {
                    "success": 200,
                    "data": [{"id": ws.id, "name": ws.name} for ws in workspaces],
                }
            ),
            200,
        )
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
