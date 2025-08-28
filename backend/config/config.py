import os

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv('POSTGRES_URI', 'postgresql://user:pass@localhost/db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    INFLUXDB_URL = os.getenv('INFLUXDB_URL', 'http://localhost:8086')
    INFLUXDB_TOKEN = os.getenv('INFLUXDB_TOKEN', 'your-token')
    INFLUXDB_ORG = os.getenv('INFLUXDB_ORG', 'your-org')
    INFLUXDB_BUCKET = os.getenv('INFLUXDB_BUCKET', 'your-bucket') 