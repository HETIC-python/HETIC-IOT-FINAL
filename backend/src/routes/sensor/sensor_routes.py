from flask import Blueprint, jsonify, request
from sqlalchemy.exc import SQLAlchemyError, IntegrityError
from src.extensions import db
from src.models import Sensor, Workspace, Task
import logging

# Configuration du logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

sensor_bp = Blueprint("sensor_bp", __name__)


# CREATE
@sensor_bp.route("/sensors", methods=["POST"])
def create_sensor():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Bad Request", "message": "Invalid JSON body"}), 400

        workspace_id = data.get("workspace_id")
        if not workspace_id:
            return jsonify({"error": "Bad Request", "message": "workspace_id is required"}), 400

        workspace = Workspace.query.get(workspace_id)
        if not workspace:
            return jsonify({"error": "Not Found", "message": "Workspace not found"}), 404

        sensor = Sensor(
            name=data.get("name"),
            # type=data.get("type"),
            status=data.get("status", "inactive"),
            workspace_id=workspace_id
        )

        if not sensor.name:
            return jsonify({"error": "Bad Request", "message": "name is required"}), 400
        if not sensor.status:
            return jsonify({"error": "Bad Request", "message": "status is required"}), 400
        
        db.session.add(sensor)
        db.session.commit()
        
        logger.info(f"Capteur créé avec succès: {sensor.name} (ID: {sensor.id})")
        return jsonify({"message": "Sensor created successfully", "sensor": sensor.to_dict()}), 201

    except IntegrityError as e:
        logger.error(f"Erreur d'intégrité lors de la création du capteur: {str(e)}")
        db.session.rollback()
        return jsonify({"error": "Validation Error", "message": "Invalid data for sensor creation"}), 400
    except SQLAlchemyError as e:
        logger.error(f"Erreur de base de données lors de la création du capteur: {str(e)}")
        db.session.rollback()
        return jsonify({"error": "Database Error", "message": "Unable to create sensor"}), 500
    except Exception as e:
        logger.error(f"Erreur inattendue lors de la création du capteur: {str(e)}")
        db.session.rollback()
        return jsonify({"error": "Server Error", "message": "An unexpected error occurred"}), 500


# READ ALL
@sensor_bp.route("/sensors", methods=["GET"])
def get_sensors():
    try:
        sensors = Sensor.query.all()
        return jsonify([s.to_dict() for s in sensors]), 200
    except SQLAlchemyError as e:
        logger.error(f"Erreur de base de données lors de la récupération des capteurs: {str(e)}")
        db.session.rollback()
        return jsonify({"error": "Database Error", "message": "Unable to retrieve sensors"}), 500
    except Exception as e:
        logger.error(f"Erreur inattendue lors de la récupération des capteurs: {str(e)}")
        return jsonify({"error": "Server Error", "message": "An unexpected error occurred"}), 500


# READ BY ID
@sensor_bp.route("/sensors/<int:sensor_id>", methods=["GET"])
def get_sensor(sensor_id):
    try:
        sensor = Sensor.query.get(sensor_id)
        if not sensor:
            return jsonify({"error": "Not Found", "message": f"Sensor with ID {sensor_id} not found"}), 404
        return jsonify(sensor.to_dict()), 200
    except SQLAlchemyError as e:
        logger.error(f"Erreur de base de données lors de la récupération du capteur {sensor_id}: {str(e)}")
        db.session.rollback()
        return jsonify({"error": "Database Error", "message": "Unable to retrieve sensor"}), 500
    except Exception as e:
        logger.error(f"Erreur inattendue lors de la récupération du capteur {sensor_id}: {str(e)}")
        return jsonify({"error": "Server Error", "message": "An unexpected error occurred"}), 500


# UPDATE
@sensor_bp.route("/sensors/<int:sensor_id>", methods=["PUT"])
def update_sensor(sensor_id):
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Bad Request", "message": "Invalid JSON body"}), 400

        sensor = Sensor.query.get(sensor_id)
        if not sensor:
            return jsonify({"error": "Not Found", "message": f"Sensor with ID {sensor_id} not found"}), 404

        if "name" in data:
            sensor.name = data["name"]
        if "type" in data:
            sensor.type = data["type"]
        if "workspace_id" in data:
            workspace = Workspace.query.get(data["workspace_id"])
            if not workspace:
                return jsonify({"error": "Not Found", "message": "Workspace not found"}), 404
            sensor.workspace_id = data["workspace_id"]

        db.session.commit()
        
        logger.info(f"Capteur {sensor_id} mis à jour avec succès")
        return jsonify({"message": "Sensor updated successfully", "sensor": sensor.to_dict()}), 200

    except IntegrityError as e:
        logger.error(f"Erreur d'intégrité lors de la mise à jour du capteur {sensor_id}: {str(e)}")
        db.session.rollback()
        return jsonify({"error": "Validation Error", "message": "Invalid data for sensor update"}), 400
    except SQLAlchemyError as e:
        logger.error(f"Erreur de base de données lors de la mise à jour du capteur {sensor_id}: {str(e)}")
        db.session.rollback()
        return jsonify({"error": "Database Error", "message": "Unable to update sensor"}), 500
    except Exception as e:
        logger.error(f"Erreur inattendue lors de la mise à jour du capteur {sensor_id}: {str(e)}")
        db.session.rollback()
        return jsonify({"error": "Server Error", "message": "An unexpected error occurred"}), 500


# DELETE
@sensor_bp.route("/sensors/<int:sensor_id>", methods=["DELETE"])
def delete_sensor(sensor_id):
    try:
        sensor = Sensor.query.get(sensor_id)
        if not sensor:
            return jsonify({"error": "Not Found", "message": f"Sensor with ID {sensor_id} not found"}), 404

        sensor_name = sensor.name
        db.session.delete(sensor)
        db.session.commit()
        
        logger.info(f"Capteur '{sensor_name}' (ID: {sensor_id}) supprimé avec succès")
        return jsonify({"message": "Sensor deleted successfully"}), 200

    except SQLAlchemyError as e:
        logger.error(f"Erreur de base de données lors de la suppression du capteur {sensor_id}: {str(e)}")
        db.session.rollback()
        return jsonify({"error": "Database Error", "message": "Unable to delete sensor"}), 500
    except Exception as e:
        logger.error(f"Erreur inattendue lors de la suppression du capteur {sensor_id}: {str(e)}")
        db.session.rollback()
        return jsonify({"error": "Server Error", "message": "An unexpected error occurred"}), 500


# ASSOCIATE TASKS WITH SENSOR
@sensor_bp.route("/sensors/<int:sensor_id>/tasks", methods=["POST"])
def associate_tasks_with_sensor(sensor_id):
    """Associe des tâches à un capteur spécifique"""
    try:
        # Validation des données d'entrée
        if not request.is_json:
            return jsonify({"error": "Bad Request", "message": "Content must be in JSON format"}), 400
        
        data = request.get_json()
        task_ids = data.get("task_ids", [])
        
        if not task_ids or not isinstance(task_ids, list):
            return jsonify({"error": "Bad Request", "message": "task_ids must be a non-empty array"}), 400
        
        # Vérifier que le capteur existe
        sensor = Sensor.query.get(sensor_id)
        if not sensor:
            return jsonify({"error": "Not Found", "message": f"Sensor with ID {sensor_id} not found"}), 404
        
        # Vérifier que toutes les tâches existent
        tasks = Task.query.filter(Task.id.in_(task_ids)).all()
        if len(tasks) != len(task_ids):
            return jsonify({"error": "Bad Request", "message": "Some tasks not found"}), 400
        
        # Associer les tâches au capteur
        sensor.tasks = tasks
        db.session.commit()
        
        logger.info(f"Tâches {task_ids} associées avec succès au capteur {sensor_id}")
        return jsonify({
            "message": "Tasks associated with sensor successfully",
            "sensor_id": sensor_id,
            "associated_tasks": len(tasks)
        }), 200
        
    except IntegrityError as e:
        logger.error(f"Erreur d'intégrité lors de l'association des tâches au capteur {sensor_id}: {str(e)}")
        db.session.rollback()
        return jsonify({"error": "Validation Error", "message": "Invalid data for task association"}), 400
    except SQLAlchemyError as e:
        logger.error(f"Erreur de base de données lors de l'association des tâches au capteur {sensor_id}: {str(e)}")
        db.session.rollback()
        return jsonify({"error": "Database Error", "message": "Unable to associate tasks with sensor"}), 500
    except Exception as e:
        logger.error(f"Erreur inattendue lors de l'association des tâches au capteur {sensor_id}: {str(e)}")
        db.session.rollback()
        return jsonify({"error": "Server Error", "message": "An unexpected error occurred"}), 500


# GET SENSOR TASKS
@sensor_bp.route("/sensors/<int:sensor_id>/tasks", methods=["GET"])
def get_sensor_tasks(sensor_id):
    """Récupère toutes les tâches d'un capteur spécifique"""
    try:
        # Vérifier que le capteur existe
        sensor = Sensor.query.get(sensor_id)
        if not sensor:
            return jsonify({"error": "Not Found", "message": f"Sensor with ID {sensor_id} not found"}), 404
        
        # Récupérer les tâches du capteur
        tasks = []
        for task in sensor.tasks:
            try:
                task_data = task.to_dict()
                tasks.append(task_data)
            except Exception as e:
                logger.error(f"Erreur lors de la sérialisation de la tâche {task.id}: {str(e)}")
                continue
        
        return jsonify({
            "sensor_id": sensor_id,
            "sensor_name": sensor.name,
            "tasks": tasks,
            "total_tasks": len(tasks)
        }), 200
        
    except SQLAlchemyError as e:
        logger.error(f"Erreur de base de données lors de la récupération des tâches du capteur {sensor_id}: {str(e)}")
        db.session.rollback()
        return jsonify({"error": "Database Error", "message": "Unable to retrieve sensor tasks"}), 500
    except Exception as e:
        logger.error(f"Erreur inattendue lors de la récupération des tâches du capteur {sensor_id}: {str(e)}")
        return jsonify({"error": "Server Error", "message": "An unexpected error occurred"}), 500