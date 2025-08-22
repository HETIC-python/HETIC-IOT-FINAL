from flask import Blueprint, request, jsonify
from src.service.lstm_service import LSTMService
from src.service.train_service import TrainService

lstm_bp = Blueprint('lstm', __name__)
predict_service = LSTMService()
train_service = TrainService()

@lstm_bp.route("/predict", methods=["POST"])
def predict():
    data = request.json
    if not data or "input" not in data:
        return jsonify({"error": "Missing 'input' data"}), 400
    try:
        prediction = predict_service.predict(data["input"])
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    return jsonify({"prediction": prediction.tolist()})

@lstm_bp.route("/train", methods=["POST"])
def train():
    try:
        train_service.train_and_save_model()
        return jsonify({"message": "Model trained and saved successfully."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
