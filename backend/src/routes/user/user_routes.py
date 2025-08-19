from flask import Blueprint, jsonify
from src.models import User
from src.influxdb_client import get_influxdb_client

user_bp = Blueprint('user', __name__)

@user_bp.route('/users')
def get_users():
    users = User.query.all()
    return jsonify([{
        'id': u.id,
        'username': u.username,
        'email': u.email
    } for u in users])

@user_bp.route('/influxdb/ping')
def influxdb_ping():
    client = get_influxdb_client()
    try:
        health = client.ping()
        return jsonify({'influxdb': 'reachable', 'health': str(health)})
    except Exception as e:
        return jsonify({'influxdb': 'unreachable', 'error': str(e)}), 500