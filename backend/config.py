import os


class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv('POSTGRES_URI', 'postgresql://postgres:postgres@db:5432/iot_db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    INFLUXDB_URL = os.getenv('INFLUXDB_URL', 'http://localhost:8086')
    INFLUXDB_TOKEN = os.getenv('INFLUXDB_TOKEN', 'your-token')
    INFLUXDB_ORG = os.getenv('INFLUXDB_ORG', 'your-org')
    INFLUXDB_BUCKET = os.getenv('INFLUXDB_BUCKET', 'your-bucket')

    # Stripe Configuration
    STRIPE_SECRET_KEY = os.getenv('STRIPE_SECRET_KEY')
    STRIPE_PUBLISHABLE_KEY = os.getenv('STRIPE_PUBLISHABLE_KEY')

    SECRET_KEY = 'test-secret-key'
    MAIL_DEFAULT_SENDER = 'example@gmail.com'
    WEATHER_API_KEY = os.getenv('OPENWEATHER_API_KEY')


class TestConfig:
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'  # Use in-memory SQLite for testing
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = 'test-secret-key'
    MAIL_DEFAULT_SENDER = 'test@example.com'
    FRONTEND_URL = 'http://localhost:3000'