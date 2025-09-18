from flask import Blueprint, jsonify, request
from src.decorators.auth_decorator import require_admin
from src.extensions import db
from src.influxdb_client import get_influxdb_client
from src.models import User, Workspace
from src.service.auth_service import AuthService

user_bp = Blueprint("user", __name__)


@user_bp.route("/users")
def get_users():
    users = User.query.all()
    return jsonify(
        [{"id": u.id, "username": u.username, "email": u.email} for u in users]
    )


@user_bp.route("/users/<int:user_id>")
def get_user(user_id):
    user = User.query.get(user_id)
    if user:
        return jsonify({"id": user.id, "username": user.username, "email": user.email})
    return jsonify({"error": "User not found"}), 404


@user_bp.route("/users/admin")
def get_user_admin():
    token = request.headers.get("Authorization")
    if not token:
        return jsonify({"error": "No token provided"}), 401
    token = token.split(" ")[1]
    res = AuthService.verify_user_admin(token)
    if not res:
        return jsonify({"error": "Unauthorized"}), 403

    user = AuthService.get_user_from_token(token)
    if user:
        return jsonify({"id": user.id, "username": user.username, "email": user.email})
    return jsonify({"error": "User not found"}), 404


@user_bp.route("/users/me")
def get_user_me():
    try:
        token = request.headers.get("Authorization")
        if not token:
            return jsonify({"error": "No token provided"}), 401
        if not token.startswith("Bearer "):
            return jsonify({"error": "Invalid token format"}), 401

        token = token.split(" ")[1]
        user = AuthService.get_user_from_token(token)
        if user:
            return jsonify(
                {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "firstName": user.first_name,
                    "lastName": user.last_name,
                }
            )
        return jsonify({"error": "User not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@user_bp.route("/influxdb/ping")
def influxdb_ping():
    client = get_influxdb_client()
    try:
        health = client.ping()
        return jsonify({"influxdb": "reachable", "health": str(health)})
    except Exception as e:
        return jsonify({"influxdb": "unreachable", "error": str(e)}), 500


@user_bp.route("/users/<int:user_id>/workspaces", methods=["PUT"])
@require_admin
def add_workspace_to_user(user_id):
    """
    Add an existing workspace to a user by updating the workspace's user_id.
    """
    data = request.get_json()
    workspace_id = data.get("workspace_id")
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    workspace = Workspace.query.get(workspace_id)
    if not workspace:
        return jsonify({"error": "Workspace not found"}), 404

    try:
        # Associate the workspace with the user
        workspace.user_id = user.id
        db.session.commit()

        return (
            jsonify(
                {
                    "message": "Workspace successfully added to user",
                    "workspace": {
                        "id": workspace.id,
                        "name": workspace.name,
                        "description": workspace.description,
                        "user_id": workspace.user_id,
                    },
                }
            ),
            200,
        )
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
