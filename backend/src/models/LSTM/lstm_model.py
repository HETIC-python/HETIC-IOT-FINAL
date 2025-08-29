import os
import tensorflow as tf

class LSTM:
    def __init__(self, model_path="/tmp/my_lstm_model.keras"):
        self.model = None
        self.model_path = model_path

    def load_model(self):
        if os.path.exists(self.model_path):
            print(f"✅ Loading model from {self.model_path}...")
            self.model = tf.keras.models.load_model(self.model_path)
        else:
            print(f"⚠️ Model file not found at {self.model_path}")
            self.model = None

    def predict(self, x_input):
        if self.model is None:
            raise ValueError("Model not loaded.")
        return self.model.predict(x_input)
