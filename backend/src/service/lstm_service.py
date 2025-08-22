import numpy as np
from src.models.LSTM.lstm_model import LSTM

class LSTMService:
    def __init__(self):
        self.model = LSTM()

    def load_trained_model(self, path="/tmp/my_lstm_model.keras"):
        self.model.load_model(path)

    def predict(self, input_data):
        x = np.array(input_data, dtype=np.float32)

        if x.ndim == 1:
            x = x.reshape((1, x.shape[0], 1))
        elif x.ndim == 2:
            x = x.reshape((1, x.shape[0], x.shape[1]))
        else:
            raise ValueError("Input data format incorrect")

        return self.model.predict(x)
