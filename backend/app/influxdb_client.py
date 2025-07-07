from influxdb_client import InfluxDBClient
from flask import current_app

def get_influxdb_client():
    return InfluxDBClient(
        url=current_app.config['INFLUXDB_URL'],
        token=current_app.config['INFLUXDB_TOKEN'],
        org=current_app.config['INFLUXDB_ORG']
    ) 