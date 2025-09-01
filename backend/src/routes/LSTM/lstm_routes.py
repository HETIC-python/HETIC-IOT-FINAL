from flask import Blueprint, request, jsonify
from src.service.lstm_service import LSTMService
from src.service.train_service import TrainService
from src.service.analytics_service import AnalyticsService
import json

lstm_bp = Blueprint('lstm', __name__)
window_size = 16
forecast_horizon = 7

predict_service = LSTMService(window_size=window_size, forecast_horizon=forecast_horizon)
train_service = TrainService(window_size=window_size, forecast_horizon=forecast_horizon)

@lstm_bp.route("/train", methods=["POST"])
def train():
    data = request.json
    if not data or "input" not in data:
        return jsonify({"error": "Missing 'input' data"}), 400
    try:
        train_service.train_and_save_model(data["input"])
        # Recharge le modèle dans le service de prédiction
        predict_service.model.load_model()
        predict_service.min_temp = train_service.min_temp
        predict_service.max_temp = train_service.max_temp
        return jsonify({"message": "Model trained and loaded successfully."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@lstm_bp.route("/predict", methods=["POST"])
def predict():
    data = request.json
    if not data or "input" not in data:
        return jsonify({"error": "Missing 'input' data"}), 400
    try:
        prediction = predict_service.predict_week(data["input"])
        return jsonify({"prediction": prediction})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@lstm_bp.route("/predict/<sensor_id>", methods=["GET"])
def predict_sensor(sensor_id):

    try:
        analytics = AnalyticsService()
        d, er = analytics.get_sensor_data_last_8_hours(sensor_id)
        print("this is d", d)
        if d and len(d) >= 1:
            # print("-----------------")
            data = [[x["temperature"]] for x in d]
            if not data:
                return jsonify({"error": "Missing 'input' data"}), 400

            # return jsonify({"d":data, "cond": d})
            prediction = predict_service.predict_week(data)
            return jsonify({"prediction": data})
        return jsonify({"success": False, "error": "Error obtaining data"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500