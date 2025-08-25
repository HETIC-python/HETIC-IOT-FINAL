from flask import jsonify
from src.service.analytics_service import AnalyticsService


class AnalyticsController:
    def __init__(self):
        self.analytics_service = AnalyticsService()

    def get_sensor_data(self, sensor_id: int):
        records, error = self.analytics_service.get_sensor_data(sensor_id)
        
        if error:
            return jsonify({"error": "Query failed", "details": error}), 500
            
        if not records:
            return jsonify({"message": "No data found for this sensor"}), 404
            
        return jsonify(records)