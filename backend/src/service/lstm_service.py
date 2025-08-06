import numpy as np
from src.models.lstm_model import LSTMModel

class LSTMService:
    def __init__(self):
        self.model = LSTMModel()
        self.model.load_model("saved_model/my_lstm_model") 

    def predict(self, input_data):
        x = np.array(input_data, dtype=np.float32)
        
        if x.ndim == 1:
            x = x.reshape((1, x.shape[0], 1))
        elif x.ndim == 2:
            x = x.reshape((1, x.shape[0], x.shape[1]))
        else:
            raise ValueError("Input data format incorrect")

        pred = self.model.predict(x)
        return pred
