from flask import Blueprint, jsonify, request
from src.extensions import db
from src.models.sensor.sensor import Sensor
from src.models.task.task import Task

task_bp = Blueprint('task', __name__)


@task_bp.route('/tasks', methods=['GET'])
def get_tasks():
    tasks = Task.query.all()
    return jsonify([task.to_dict() for task in tasks])


@task_bp.route('/tasks/<int:task_id>', methods=['GET'])
def get_task(task_id):
    task = Task.query.get_or_404(task_id)
    return jsonify(task.to_dict())


@task_bp.route('/tasks', methods=['POST'])
def create_task():
    data = request.get_json()
    
    if not data.get('name') or not data.get('description'):
        return jsonify({'error': 'Name and description are required'}), 400
    
   
    task = Task(
        name=data['name'],
        description=data['description'],
        status=data.get('status', 'pending')
    )
    

    if 'sensor_ids' in data:
        sensors = Sensor.query.filter(Sensor.id.in_(data['sensor_ids'])).all()
        task.sensors.extend(sensors)
    
    db.session.add(task)
    db.session.commit()
    
    return jsonify(task.to_dict()), 201


@task_bp.route('/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    task = Task.query.get_or_404(task_id)
    data = request.get_json()
    
    if 'name' in data:
        task.name = data['name']
    if 'description' in data:
        task.description = data['description']
    if 'status' in data:
        task.status = data['status']
        
    db.session.commit()
    return jsonify(task.to_dict())


@task_bp.route('/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    task = Task.query.get_or_404(task_id)
    db.session.delete(task)
    db.session.commit()
    return jsonify({'message': 'Task deleted successfully'})


@task_bp.route('/tasks/<int:task_id>/sensors/<int:sensor_id>', methods=['POST'])
def add_sensor_to_task(task_id, sensor_id):
    task = Task.query.get_or_404(task_id)
    sensor = Sensor.query.get_or_404(sensor_id)
    
    if sensor in task.sensors:
        return jsonify({'error': 'Sensor already associated with this task'}), 400
    
    task.sensors.append(sensor)
    db.session.commit()
    
    return jsonify(task.to_dict())

@task_bp.route('/tasks/<int:task_id>/sensors/<int:sensor_id>', methods=['DELETE'])
def remove_sensor_from_task(task_id, sensor_id):
    task = Task.query.get_or_404(task_id)
    sensor = Sensor.query.get_or_404(sensor_id)
    print(task.sensors, "this is task")
    
    if sensor not in task.sensors:
        return jsonify({'error': 'Sensor not associated with this task'}), 404
    
    task.sensors.remove(sensor)
    db.session.commit()
    
    return jsonify(task.to_dict())