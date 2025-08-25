import json
import os
import traceback
from datetime import timedelta

import pandas as pd
from flask import Blueprint, current_app, jsonify, request
from influxdb_client_3 import InfluxDBClient3, Point
from src.controller.analytics_controller import AnalyticsController
from src.extensions import db
from src.models import Order

analytics_bp = Blueprint("analytics", __name__)
analytics_controller = AnalyticsController()

@analytics_bp.route("/analytics/sensor/<int:sensor_id>", methods=["GET"])
def get_sensor_data(sensor_id):
    return analytics_controller.get_sensor_data(sensor_id)