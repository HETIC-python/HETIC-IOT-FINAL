import json
import os
import traceback
from datetime import timedelta
from influxdb_client import InfluxDBClient
from flask import Blueprint, current_app, jsonify, request
from src.extensions import db
from src.models import Order


analytics_bp = Blueprint('analytics', __name__)

TOKEN = os.getenv('INFLUXDB_TOKEN')
ORG = os.getenv('INFLUXDB_ORG')
URL = os.getenv('INFLUXDB_URL')
BUCKET = os.getenv('INFLUXDB_BUCKET')

@analytics_bp.route('/analytics/sensor/<int:sensor_id>', methods=['GET'])
def get_sensor_data(sensor_id):
    try:
        token = TOKEN
        org = ORG
        url = URL
        bucket = BUCKET

        client = InfluxDBClient(url=url, token=token, org=org)
        query_api = client.query_api()
        
        query = f'''
            from(bucket: "{bucket}")
            |> range(start: -1h)
            |> filter(fn: (r) => r["_measurement"] == "mqtt_consumer")
            |> filter(fn: (r) => r["source_address"] == "{sensor_id}")
            |> limit(n:1)
        '''
        result = query_api.query(query)
        if result and len(result) > 0:
            records = []
            for table in result:
                for record in table.records:
                    records.append({
                        'time': record.get_time().isoformat(),
                        'temperature': record.get_value(),
                        'sensor_id': sensor_id
                    })
            return jsonify(records)
        else:
            return jsonify({'message': 'No data found for this sensor'}), 404
            
    except Exception as e:
        return jsonify({'error': str(e), 'trace': traceback.format_exc()}), 500
    finally:
        client.close()
