import tensorflow as tf

class LSTMModel:
    def __init__(self):
        self.model = None

    def load_model(self, path):
        self.model = tf.keras.models.load_model(path)

    def predict(self, input_data):
        if self.model is None:
            raise ValueError("Model not loaded")
        preds = self.model.predict(input_data)
        return preds.flatten()
