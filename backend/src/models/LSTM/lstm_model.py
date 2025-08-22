import os
import tensorflow as tf

class LSTM:
    def __init__(self, model_path="/tmp/my_lstm_model.keras"):
        self.model = None
        self.model_path = model_path
        self.load_model(self.model_path)

    def load_model(self, path=None):
        path = path or self.model_path
        if os.path.exists(path):
            print(f"✅ Loading model from {path}...")
            self.model = tf.keras.models.load_model(path)
        else:
            print(f"⚠️ Model file not found at {path}, skipping load.")
            self.model = None

    def train_model(self, x_train, y_train, save_path=None, epochs=10):
        save_path = save_path or self.model_path
        x_train = x_train.reshape((x_train.shape[0], x_train.shape[1], 1)) 

        self.model = tf.keras.Sequential([
            tf.keras.layers.LSTM(64, input_shape=(x_train.shape[1], x_train.shape[2])),
            tf.keras.layers.Dense(1)
        ])
        self.model.compile(optimizer='adam', loss='mse')

        print("📈 Training model...")
        self.model.fit(x_train, y_train, epochs=epochs)
        self.model.save(save_path)
        print(f"✅ Model trained and saved at {save_path}")

    def predict(self, input_data):
        if self.model is None:
            raise ValueError("Model not loaded. Train or load a model first.")

        import numpy as np
        x = np.array(input_data, dtype=np.float32)

        if x.ndim == 1:
            x = x.reshape((1, x.shape[0], 1))
        elif x.ndim == 2:
            x = x.reshape((1, x.shape[0], x.shape[1]))
        else:
            raise ValueError
