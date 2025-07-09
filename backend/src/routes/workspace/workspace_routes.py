from flask import Blueprint, request, jsonify
from src.models.workspace.workspace import Workspace
from src.extensions import db

workspace_bp = Blueprint('workspace', __name__)

@workspace_bp.route('/workspaces', methods=['GET'])
def get_workspaces():
    workspaces = Workspace.query.all()
    return jsonify([
        {
            'id': w.id,
            'user_id': w.user_id,
            'sensor_id': w.sensor_id,
            'name': w.name,
            'description': w.description,
            'created_at': w.created_at.isoformat() if w.created_at else None,
            'updated_at': w.updated_at.isoformat() if w.updated_at else None,
            'is_active': w.is_active
        } for w in workspaces
    ])

@workspace_bp.route('/workspaces/<int:workspace_id>', methods=['GET'])
def get_workspace(workspace_id):
    workspace = Workspace.query.get_or_404(workspace_id)
    return jsonify({
        'id': workspace.id,
        'user_id': workspace.user_id,
        'sensor_id': workspace.sensor_id,
        'name': workspace.name,
        'description': workspace.description,
        'created_at': workspace.created_at.isoformat() if workspace.created_at else None,
        'updated_at': workspace.updated_at.isoformat() if workspace.updated_at else None,
        'is_active': workspace.is_active
    })

@workspace_bp.route('/workspaces', methods=['POST'])
def create_workspace():
    data = request.get_json()
    workspace = Workspace(
        user_id=data['user_id'],
        sensor_id=data['sensor_id'],
        name=data['name'],
        description=data['description'],
        created_at=data['created_at'],
        updated_at=data['updated_at'],
        is_active=data['is_active']
    )
    db.session.add(workspace)
    db.session.commit()
    return jsonify({'message': 'Workspace created', 'id': workspace.id}), 201

@workspace_bp.route('/workspaces/<int:workspace_id>', methods=['PUT'])
def update_workspace(workspace_id):
    workspace = Workspace.query.get_or_404(workspace_id)
    data = request.get_json()
    workspace.user_id = data.get('user_id', workspace.user_id)
    workspace.sensor_id = data.get('sensor_id', workspace.sensor_id)
    workspace.name = data.get('name', workspace.name)
    workspace.description = data.get('description', workspace.description)
    workspace.created_at = data.get('created_at', workspace.created_at)
    workspace.updated_at = data.get('updated_at', workspace.updated_at)
    workspace.is_active = data.get('is_active', workspace.is_active)
    db.session.commit()
    return jsonify({'message': 'Workspace updated'})

@workspace_bp.route('/workspaces/<int:workspace_id>', methods=['DELETE'])
def delete_workspace(workspace_id):
    workspace = Workspace.query.get_or_404(workspace_id)
    db.session.delete(workspace)
    db.session.commit()
    return jsonify({'message': 'Workspace deleted'})
