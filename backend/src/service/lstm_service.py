import numpy as np
from src.models.LSTM.lstm_model import LSTM as LSTMModel

class LSTMService:
    def __init__(self, model_path="/tmp/my_lstm_model.keras", window_size=30, forecast_horizon=7):
        self.model = LSTMModel(model_path)
        self.model.load_model()
        self.window_size = window_size
        self.forecast_horizon = forecast_horizon
        self.min_temp = 0
        self.max_temp = 40

    def set_normalization(self, min_temp, max_temp):
        self.min_temp = min_temp
        self.max_temp = max_temp

    def normalize(self, x):
        return (x - self.min_temp) / (self.max_temp - self.min_temp)

    def denormalize(self, x_norm):
        return x_norm * (self.max_temp - self.min_temp) + self.min_temp

    def predict_week(self, input_data):
        """
        input_data : liste de listes [[temp1],[temp2],...]
        Retourne 7 valeurs pour la semaine suivante
        """
        x = np.array(input_data[-self.window_size:], dtype=np.float32)
        x_norm = self.normalize(x).reshape(1, self.window_size,1)
        pred_norm = self.model.predict(x_norm)
        pred_real = self.denormalize(pred_norm[0])
        return pred_real.tolist()
