import logging
from datetime import datetime

from flask import Blueprint, current_app, jsonify, request
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from src.extensions import db
from src.models.task.task import Task
from src.models.sensor.sensor import Sensor
from src.models.workspace.workspace import Workspace
from src.models.user.user import User

# Configuration du logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

task_bp = Blueprint("task", __name__)


@task_bp.route("/tasks", methods=["GET"])
def get_tasks():
    """Récupère toutes les tâches avec gestion d'erreur robuste"""
    try:
        tasks = Task.query.all()
        
        task_list = []
        for task in tasks:
            try:
                task_data = task.to_dict()
                task_list.append(task_data)
            except Exception as e:
                logger.error(f"Erreur lors de la sérialisation de la tâche {task.id}: {str(e)}")
                continue
        
        return jsonify(task_list)
        
    except SQLAlchemyError as e:
        logger.error(f"Erreur de base de données lors de la récupération des tâches: {str(e)}")
        db.session.rollback()
        return jsonify({'error': 'Database Error', 'message': 'Unable to retrieve tasks'}), 500
        
    except Exception as e:
        logger.error(f"Erreur inattendue lors de la récupération des tâches: {str(e)}")
        return jsonify({'error': 'Server Error', 'message': 'An unexpected error occurred'}), 500


@task_bp.route("/tasks/<int:task_id>", methods=["GET"])
def get_task(task_id):
    """Récupère une tâche spécifique avec gestion d'erreur robuste"""
    try:
        task = Task.query.get(task_id)
        
        if not task:
            return jsonify({'error': 'Not Found', 'message': f'Task with ID {task_id} not found'}), 404
        
        return jsonify(task.to_dict())
        
    except SQLAlchemyError as e:
        logger.error(f"Erreur de base de données lors de la récupération de la tâche {task_id}: {str(e)}")
        db.session.rollback()
        return jsonify({'error': 'Database Error', 'message': 'Unable to retrieve task'}), 500
        
    except Exception as e:
        logger.error(f"Erreur inattendue lors de la récupération de la tâche {task_id}: {str(e)}")
        return jsonify({'error': 'Server Error', 'message': 'An unexpected error occurred'}), 500


@task_bp.route("/tasks", methods=["POST"])
def create_task():
    """Crée une nouvelle tâche avec gestion d'erreur robuste"""
    try:
        # Validation des données d'entrée
        if not request.is_json:
            return jsonify({'error': 'Bad Request', 'message': 'Content must be in JSON format'}), 400
        
        data = request.get_json()
        
        # Validation des champs obligatoires
        required_fields = ['name', 'description']
        for field in required_fields:
            if not data.get(field) or not str(data.get(field)).strip():
                return jsonify({'error': 'Bad Request', 'message': f'Field {field} is required'}), 400
        
        # Création de la tâche
        task = Task(
            name=data['name'].strip(),
            description=data['description'].strip(),
            status=data.get('status', 'pending'),
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        
        # Association avec les capteurs si fournis
        if 'sensor_ids' in data and isinstance(data['sensor_ids'], list):
            sensors = Sensor.query.filter(Sensor.id.in_(data['sensor_ids'])).all()
            task.sensors = sensors
        
        db.session.add(task)
        db.session.commit()
        
        logger.info(f"Tâche créée avec succès: {task.name} (ID: {task.id})")
        return jsonify({'message': 'Task created successfully', 'id': task.id, 'task': task.to_dict()}), 201
        
    except IntegrityError as e:
        logger.error(f"Erreur d'intégrité lors de la création de la tâche: {str(e)}")
        db.session.rollback()
        return jsonify({'error': 'Validation Error', 'message': 'Invalid data for task creation'}), 400
        
    except SQLAlchemyError as e:
        logger.error(f"Erreur de base de données lors de la création de la tâche: {str(e)}")
        db.session.rollback()
        return jsonify({'error': 'Database Error', 'message': 'Unable to create task'}), 500
        
    except Exception as e:
        logger.error(f"Erreur inattendue lors de la création de la tâche: {str(e)}")
        db.session.rollback()
        return jsonify({'error': 'Server Error', 'message': 'An unexpected error occurred'}), 500


@task_bp.route("/tasks/<int:task_id>", methods=["PUT"])
def update_task(task_id):
    """Met à jour une tâche avec gestion d'erreur robuste"""
    try:
        # Validation des données d'entrée
        if not request.is_json:
            return jsonify({'error': 'Bad Request', 'message': 'Content must be in JSON format'}), 400
        
        task = Task.query.get(task_id)
        if not task:
            return jsonify({'error': 'Not Found', 'message': f'Task with ID {task_id} not found'}), 404
        
        data = request.get_json()
        
        # Mise à jour des champs avec validation
        if 'name' in data and data['name']:
            task.name = str(data['name']).strip()
        if 'description' in data and data['description']:
            task.description = str(data['description']).strip()
        if 'status' in data:
            task.status = str(data['status'])
        
        task.updated_at = datetime.utcnow()
        
        # Mise à jour des associations avec les capteurs
        if 'sensor_ids' in data and isinstance(data['sensor_ids'], list):
            sensors = Sensor.query.filter(Sensor.id.in_(data['sensor_ids'])).all()
            task.sensors = sensors
        
        db.session.commit()
        
        logger.info(f"Tâche {task_id} mise à jour avec succès")
        return jsonify({'message': 'Task updated successfully', 'task': task.to_dict()})
        
    except IntegrityError as e:
        logger.error(f"Erreur d'intégrité lors de la mise à jour de la tâche {task_id}: {str(e)}")
        db.session.rollback()
        return jsonify({'error': 'Validation Error', 'message': 'Invalid data for task update'}), 400
        
    except SQLAlchemyError as e:
        logger.error(f"Erreur de base de données lors de la mise à jour de la tâche {task_id}: {str(e)}")
        db.session.rollback()
        return jsonify({'error': 'Database Error', 'message': 'Unable to update task'}), 500
        
    except Exception as e:
        logger.error(f"Erreur inattendue lors de la mise à jour de la tâche {task_id}: {str(e)}")
        db.session.rollback()
        return jsonify({'error': 'Server Error', 'message': 'An unexpected error occurred'}), 500


@task_bp.route("/tasks/<int:task_id>", methods=["DELETE"])
def delete_task(task_id):
    """Supprime une tâche avec gestion d'erreur robuste"""
    try:
        task = Task.query.get(task_id)
        if not task:
            return jsonify({'error': 'Not Found', 'message': f'Task with ID {task_id} not found'}), 404
        
        task_name = task.name  # Sauvegarde pour le log
        
        db.session.delete(task)
        db.session.commit()
        
        logger.info(f"Tâche '{task_name}' (ID: {task_id}) supprimée avec succès")
        return jsonify({'message': 'Task deleted successfully'})
        
    except SQLAlchemyError as e:
        logger.error(f"Erreur de base de données lors de la suppression de la tâche {task_id}: {str(e)}")
        db.session.rollback()
        return jsonify({'error': 'Database Error', 'message': 'Unable to delete task'}), 500
        
    except Exception as e:
        logger.error(f"Erreur inattendue lors de la suppression de la tâche {task_id}: {str(e)}")
        db.session.rollback()
        return jsonify({'error': 'Server Error', 'message': 'An unexpected error occurred'}), 500


@task_bp.route("/user/<int:user_id>/sensors", methods=["GET"])
def get_user_sensors(user_id):
    """Récupère tous les capteurs de l'utilisateur connecté"""
    try:
        # Vérifier que l'utilisateur existe
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'Not Found', 'message': f'User with ID {user_id} not found'}), 404
        
        # Récupérer tous les workspaces de l'utilisateur
        workspaces = Workspace.query.filter_by(user_id=user_id).all()
        
        # Récupérer tous les capteurs de ces workspaces
        sensors = []
        for workspace in workspaces:
            workspace_sensors = Sensor.query.filter_by(workspace_id=workspace.id).all()
            for sensor in workspace_sensors:
                sensor_data = {
                    'id': sensor.id,
                    'name': sensor.name,
                    'status': sensor.status,
                    'workspace_id': sensor.workspace_id,
                    'workspace_name': workspace.name
                }
                sensors.append(sensor_data)
        
        return jsonify({
            'user_id': user_id,
            'username': user.username,
            'sensors': sensors,
            'total_sensors': len(sensors)
        })
        
    except SQLAlchemyError as e:
        logger.error(f"Erreur de base de données lors de la récupération des capteurs de l'utilisateur {user_id}: {str(e)}")
        db.session.rollback()
        return jsonify({'error': 'Database Error', 'message': 'Unable to retrieve sensors'}), 500
        
    except Exception as e:
        logger.error(f"Erreur inattendue lors de la récupération des capteurs de l'utilisateur {user_id}: {str(e)}")
        return jsonify({'error': 'Server Error', 'message': 'An unexpected error occurred'}), 500


@task_bp.route("/sensor/<int:sensor_id>/tasks", methods=["GET"])
def get_sensor_tasks(sensor_id):
    """Récupère toutes les tâches d'un capteur spécifique"""
    try:
        sensor = Sensor.query.get(sensor_id)
        if not sensor:
            return jsonify({'error': 'Not Found', 'message': f'Sensor with ID {sensor_id} not found'}), 404
        
        tasks = []
        for task in sensor.tasks:
            try:
                task_data = task.to_dict()
                tasks.append(task_data)
            except Exception as e:
                logger.error(f"Erreur lors de la sérialisation de la tâche {task.id}: {str(e)}")
                continue
        
        return jsonify({
            'sensor_id': sensor_id,
            'sensor_name': sensor.name,
            'tasks': tasks,
            'total_tasks': len(tasks)
        })
        
    except SQLAlchemyError as e:
        logger.error(f"Erreur de base de données lors de la récupération des tâches du capteur {sensor_id}: {str(e)}")
        db.session.rollback()
        return jsonify({'error': 'Database Error', 'message': 'Unable to retrieve tasks'}), 500
        
    except Exception as e:
        logger.error(f"Erreur inattendue lors de la récupération des tâches du capteur {sensor_id}: {str(e)}")
        return jsonify({'error': 'Server Error', 'message': 'An unexpected error occurred'}), 500