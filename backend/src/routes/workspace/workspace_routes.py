import json
import logging
from datetime import datetime

from flask import Blueprint, current_app, jsonify, request
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from src.extensions import db
from src.models.workspace.workspace import Workspace
from src.service.auth_service import AuthService
from src.service.redis_client import redis_client

# Configuration du logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

workspace_bp = Blueprint("workspace", __name__)


@workspace_bp.route("/workspaces", methods=["GET"])
@AuthService.require_authentication
def get_workspaces(user):
    """Récupère tous les workspaces avec gestion d'erreur robuste"""
    try:
        workspaces = Workspace.query.filter_by(user_id=user.id).all()

        workspace_list = []
        for w in workspaces:
            try:
                workspace_data = {
                    "id": w.id,
                    "user_id": w.user_id,
                    "sensors": [{"id": s.id, "name": s.name} for s in w.sensors],
                    "name": w.name,
                    "description": w.description,
                    "created_at": w.created_at.isoformat() if w.created_at else None,
                    "updated_at": w.updated_at.isoformat() if w.updated_at else None,
                    "is_active": w.is_active,
                }
                workspace_list.append(workspace_data)
            except Exception as e:
                logger.error(
                    f"Erreur lors de la sérialisation du workspace {w.id}: {str(e)}"
                )
                continue

        return jsonify(workspace_list)

    except SQLAlchemyError as e:
        logger.error(
            f"Erreur de base de données lors de la récupération des workspaces: {str(e)}"
        )
        db.session.rollback()
        return (
            jsonify(
                {"error": "Database Error", "message": "Unable to retrieve workspaces"}
            ),
            500,
        )

    except Exception as e:
        logger.error(
            f"Erreur inattendue lors de la récupération des workspaces: {str(e)}"
        )
        return (
            jsonify(
                {"error": "Server Error", "message": "An unexpected error occurred"}
            ),
            500,
        )


@workspace_bp.route("/workspaces/<int:workspace_id>", methods=["GET"])
def get_workspace(workspace_id):
    """Récupère un workspace spécifique avec gestion d'erreur robuste et cache Redis"""
    try:
        redis_key = f"workspace:{workspace_id}"
        cached_workspace = redis_client.hgetall(redis_key)
        if cached_workspace:
            workspace_json = cached_workspace.get("data")
            if workspace_json:
                return jsonify(json.loads(workspace_json))

        workspace = Workspace.query.get(workspace_id)
        if not workspace:
            return (
                jsonify(
                    {
                        "error": "Not Found",
                        "message": f"Workspace with ID {workspace_id} not found",
                    }
                ),
                404,
            )

        workspace_data = {
            "id": workspace.id,
            "user_id": workspace.user_id,
            "sensors": [
                {"id": s.id, "name": s.name, "source_id": s.source_id}
                for s in workspace.sensors
            ],
            "name": workspace.name,
            "description": workspace.description,
            "created_at": (
                workspace.created_at.isoformat() if workspace.created_at else None
            ),
            "updated_at": (
                workspace.updated_at.isoformat() if workspace.updated_at else None
            ),
            "is_active": workspace.is_active,
        }

        redis_client.hset(redis_key, mapping={"data": json.dumps(workspace_data)})
        redis_client.expire(redis_key, 60 * 10)

        return jsonify(workspace_data)

    except SQLAlchemyError as e:
        logger.error(
            f"Erreur de base de données lors de la récupération du workspace {workspace_id}: {str(e)}"
        )
        db.session.rollback()
        return (
            jsonify(
                {"error": "Database Error", "message": "Unable to retrieve workspace"}
            ),
            500,
        )

    except Exception as e:
        logger.error(
            f"Erreur inattendue lors de la récupération du workspace {workspace_id}: {str(e)}"
        )
        return (
            jsonify(
                {"error": "Server Error", "message": "An unexpected error occurred"}
            ),
            500,
        )


@workspace_bp.route("/workspaces", methods=["POST"])
def create_workspace():
    """Crée un nouveau workspace avec gestion d'erreur robuste"""
    try:
        # Validation des données d'entrée
        if not request.is_json:
            return (
                jsonify(
                    {
                        "error": "Bad Request",
                        "message": "Content must be in JSON format",
                    }
                ),
                400,
            )

        data = request.get_json()

        # Validation des champs obligatoires
        required_fields = ["name", "description"]
        for field in required_fields:
            if not data.get(field) or not str(data.get(field)).strip():
                return (
                    jsonify(
                        {
                            "error": "Bad Request",
                            "message": f"Field {field} is required",
                        }
                    ),
                    400,
                )

        # Création du workspace
        workspace = Workspace(
            name=data["name"].strip(),
            description=data["description"].strip(),
            created_at=data.get("created_at"),
            updated_at=data.get("updated_at"),
            is_active=data.get("is_active", True),
        )

        db.session.add(workspace)
        db.session.commit()

        logger.info(
            f"Workspace créé avec succès: {workspace.name} (ID: {workspace.id})"
        )
        return (
            jsonify({"message": "Workspace created successfully", "id": workspace.id}),
            201,
        )

    except IntegrityError as e:
        logger.error(f"Erreur d'intégrité lors de la création du workspace: {str(e)}")
        db.session.rollback()
        return (
            jsonify(
                {
                    "error": "Validation Error",
                    "message": "Invalid data for workspace creation",
                }
            ),
            400,
        )

    except SQLAlchemyError as e:
        logger.error(
            f"Erreur de base de données lors de la création du workspace: {str(e)}"
        )
        db.session.rollback()
        return (
            jsonify(
                {"error": "Database Error", "message": "Unable to create workspace"}
            ),
            500,
        )

    except Exception as e:
        logger.error(f"Erreur inattendue lors de la création du workspace: {str(e)}")
        db.session.rollback()
        return (
            jsonify(
                {"error": "Server Error", "message": "An unexpected error occurred"}
            ),
            500,
        )


# @workspace_bp.route("/workspaces", methods=["POST"])
# def create_workspace():
#     try:
#         data = request.get_json()
#         workspace = Workspace(
#             user_id=data.get("user_id", 1),
#             name=data.get("name"),
#             description=data.get("description"),
#             created_at=datetime.utcnow(),
#             updated_at=datetime.utcnow(),
#             is_active=data.get("is_active", True),
#         )
#         db.session.add(workspace)
#         db.session.commit()
#         return jsonify({"message": "Workspace created", "id": workspace.id}), 201
#     except Exception as e:
#         db.session.rollback()
#         return jsonify({"error": str(e)}), 400


@workspace_bp.route("/workspaces/<int:workspace_id>", methods=["PUT"])
def update_workspace(workspace_id):
    """Met à jour un workspace avec gestion d'erreur robuste"""
    try:
        # Validation des données d'entrée
        if not request.is_json:
            return (
                jsonify(
                    {
                        "error": "Bad Request",
                        "message": "Content must be in JSON format",
                    }
                ),
                400,
            )

        workspace = Workspace.query.get(workspace_id)
        if not workspace:
            return (
                jsonify(
                    {
                        "error": "Not Found",
                        "message": f"Workspace with ID {workspace_id} not found",
                    }
                ),
                404,
            )

        data = request.get_json()

        # Mise à jour des champs avec validation
        if "name" in data and data["name"]:
            workspace.name = str(data["name"]).strip()
        if "description" in data and data["description"]:
            workspace.description = str(data["description"]).strip()
        if "user_id" in data:
            workspace.user_id = data["user_id"]
        if "created_at" in data:
            workspace.created_at = data["created_at"]
        if "updated_at" in data:
            workspace.updated_at = data["updated_at"]
        if "is_active" in data:
            workspace.is_active = bool(data["is_active"])

        db.session.commit()

        logger.info(f"Workspace {workspace_id} mis à jour avec succès")
        return jsonify({"message": "Workspace updated successfully"})

    except IntegrityError as e:
        logger.error(
            f"Erreur d'intégrité lors de la mise à jour du workspace {workspace_id}: {str(e)}"
        )
        db.session.rollback()
        return (
            jsonify(
                {
                    "error": "Validation Error",
                    "message": "Invalid data for workspace update",
                }
            ),
            400,
        )

    except SQLAlchemyError as e:
        logger.error(
            f"Erreur de base de données lors de la mise à jour du workspace {workspace_id}: {str(e)}"
        )
        db.session.rollback()
        return (
            jsonify(
                {"error": "Database Error", "message": "Unable to update workspace"}
            ),
            500,
        )

    except Exception as e:
        logger.error(
            f"Erreur inattendue lors de la mise à jour du workspace {workspace_id}: {str(e)}"
        )
        db.session.rollback()
        return (
            jsonify(
                {"error": "Server Error", "message": "An unexpected error occurred"}
            ),
            500,
        )


@workspace_bp.route("/workspaces/<int:workspace_id>", methods=["DELETE"])
def delete_workspace(workspace_id):
    """Supprime un workspace avec gestion d'erreur robuste"""
    try:
        workspace = Workspace.query.get(workspace_id)
        if not workspace:
            return (
                jsonify(
                    {
                        "error": "Not Found",
                        "message": f"Workspace with ID {workspace_id} not found",
                    }
                ),
                404,
            )

        workspace_name = workspace.name

        db.session.delete(workspace)
        db.session.commit()

        logger.info(
            f"Workspace '{workspace_name}' (ID: {workspace_id}) supprimé avec succès"
        )
        return jsonify({"message": "Workspace deleted successfully"})

    except SQLAlchemyError as e:
        logger.error(
            f"Erreur de base de données lors de la suppression du workspace {workspace_id}: {str(e)}"
        )
        db.session.rollback()
        return (
            jsonify(
                {"error": "Database Error", "message": "Unable to delete workspace"}
            ),
            500,
        )

    except Exception as e:
        logger.error(
            f"Erreur inattendue lors de la suppression du workspace {workspace_id}: {str(e)}"
        )
        db.session.rollback()
        return (
            jsonify(
                {"error": "Server Error", "message": "An unexpected error occurred"}
            ),
            500,
        )


@workspace_bp.route("/workspaces/<int:workspace_id>/sensors", methods=["GET"])
def get_workspace_sensors(workspace_id):
    """Récupère les capteurs d'un workspace avec gestion d'erreur robuste"""
    try:
        workspace = Workspace.query.get(workspace_id)
        if not workspace:
            return (
                jsonify(
                    {
                        "error": "Not Found",
                        "message": f"Workspace with ID {workspace_id} not found",
                    }
                ),
                404,
            )

        sensors = []
        for s in workspace.sensors:
            try:
                sensor_data = {"id": s.id, "name": s.name}
                sensors.append(sensor_data)
            except Exception as e:
                logger.error(
                    f"Erreur lors de la sérialisation du capteur {s.id}: {str(e)}"
                )
                continue

        return jsonify(sensors)

    except SQLAlchemyError as e:
        logger.error(
            f"Erreur de base de données lors de la récupération des capteurs du workspace {workspace_id}: {str(e)}"
        )
        db.session.rollback()
        return (
            jsonify(
                {"error": "Database Error", "message": "Unable to retrieve sensors"}
            ),
            500,
        )

    except Exception as e:
        logger.error(
            f"Erreur inattendue lors de la récupération des capteurs du workspace {workspace_id}: {str(e)}"
        )
        return (
            jsonify(
                {"error": "Server Error", "message": "An unexpected error occurred"}
            ),
            500,
        )
