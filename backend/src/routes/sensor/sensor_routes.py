from flask import Blueprint, jsonify, request
from sqlalchemy.exc import SQLAlchemyError
from src.extensions import db
from src.models import Sensor, Workspace

sensor_bp = Blueprint("sensor_bp", __name__)


# CREATE
@sensor_bp.route("/sensors", methods=["POST"])
def create_sensor():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Invalid JSON body"}), 400

        workspace_id = data.get("workspace_id")
        if not workspace_id:
            return jsonify({"error": "workspace_id is required"}), 400

        workspace = Workspace.query.get(workspace_id)
        if not workspace:
            return jsonify({"error": "Workspace not found"}), 404

        sensor = Sensor(
            name=data.get("name"),
            # type=data.get("type"),
            status=data.get("status", "inactive"),
            workspace_id=workspace_id
        )

        if not sensor.name:
            return jsonify({"error": "name is required"}), 400
        if not sensor.status:
            return jsonify({"error": "status is required"}), 400
        db.session.add(sensor)
        db.session.commit()
        return jsonify({"message": "Sensor created", "sensor": sensor.to_dict()}), 201

    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": "Database error", "details": str(e)}), 500
    except Exception as e:
        print("this is json", request.get_json())
        return jsonify({"error": "Unexpected error", "details": str(e)}), 500


# READ ALL
@sensor_bp.route("/sensors", methods=["GET"])
def get_sensors():
    try:
        sensors = Sensor.query.all()
        return jsonify([s.to_dict() for s in sensors]), 200
    except Exception as e:
        return jsonify({"error": "Unexpected error", "details": str(e)}), 500


# READ BY ID
@sensor_bp.route("/sensors/<int:sensor_id>", methods=["GET"])
def get_sensor(sensor_id):
    try:
        sensor = Sensor.query.get(sensor_id)
        if not sensor:
            return jsonify({"error": "Sensor not found"}), 404
        return jsonify(sensor.to_dict()), 200
    except Exception as e:
        return jsonify({"error": "Unexpected error", "details": str(e)}), 500


# UPDATE
@sensor_bp.route("/sensors/<int:sensor_id>", methods=["PUT"])
def update_sensor(sensor_id):
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Invalid JSON body"}), 400

        sensor = Sensor.query.get(sensor_id)
        if not sensor:
            return jsonify({"error": "Sensor not found"}), 404

        if "name" in data:
            sensor.name = data["name"]
        if "type" in data:
            sensor.type = data["type"]
        if "workspace_id" in data:
            workspace = Workspace.query.get(data["workspace_id"])
            if not workspace:
                return jsonify({"error": "Workspace not found"}), 404
            sensor.workspace_id = data["workspace_id"]

        db.session.commit()
        return jsonify({"message": "Sensor updated", "sensor": sensor.to_dict()}), 200

    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": "Database error", "details": str(e)}), 500
    except Exception as e:
        return jsonify({"error": "Unexpected error", "details": str(e)}), 500


# DELETE
@sensor_bp.route("/sensors/<int:sensor_id>", methods=["DELETE"])
def delete_sensor(sensor_id):
    try:
        sensor = Sensor.query.get(sensor_id)
        if not sensor:
            return jsonify({"error": "Sensor not found"}), 404

        db.session.delete(sensor)
        db.session.commit()
        return jsonify({"message": "Sensor deleted"}), 200

    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": "Database error", "details": str(e)}), 500
    except Exception as e:
        return jsonify({"error": "Unexpected error", "details": str(e)}), 500