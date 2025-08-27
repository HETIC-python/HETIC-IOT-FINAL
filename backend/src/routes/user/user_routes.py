from flask import Blueprint, jsonify, request
from src.influxdb_client import get_influxdb_client
from src.models import User
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
                {"id": user.id, "username": user.username, "email": user.email}
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
def update_user_workspaces(user_id):
    token = request.headers.get("Authorization")
    if not token:
        return jsonify({"error": "No token provided"}), 401

    if not AuthService.verify_user_admin(token.split(" ")[1]):
        return jsonify({"error": "Unauthorized"}), 403

    data = request.get_json()
    workspaces = data.get("workspaces", [])

    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    try:
        # Update user's workspaces (you'll need to implement this based on your database structure)
        user.workspaces = workspaces  # Adjust this based on your actual model relationship
        db.session.commit()
        return jsonify({"message": "Workspaces updated successfully"})
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
