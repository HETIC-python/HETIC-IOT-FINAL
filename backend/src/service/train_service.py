import numpy as np
import tensorflow as tf
import os

class TrainService:
    def __init__(self, model_path="/tmp/my_lstm_model.keras", window_size=30, forecast_horizon=7):
        self.model_path = model_path
        self.min_temp = None
        self.max_temp = None
        self.model = None
        self.window_size = window_size
        self.forecast_horizon = forecast_horizon

    def normalize(self, x):
        self.min_temp = np.min(x)
        self.max_temp = np.max(x)
        return (x - self.min_temp) / (self.max_temp - self.min_temp)

    def denormalize(self, x_norm):
        return x_norm * (self.max_temp - self.min_temp) + self.min_temp

    def create_model(self):
        model = tf.keras.Sequential([
            tf.keras.layers.LSTM(64, input_shape=(self.window_size,1)),
            tf.keras.layers.Dense(self.forecast_horizon)
        ])
        model.compile(optimizer='adam', loss='mse')
        return model

    def train_and_save_model(self, input_data, stop_loss=0.05, epochs=100):
        """
        input_data : liste de listes [[temp1],[temp2],...]
        stop_loss : arrêt automatique si loss < stop_loss
        """
        data = np.array(input_data, dtype=np.float32)
        data_norm = self.normalize(data)

        x_train, y_train = [], []
        for i in range(len(data_norm) - self.window_size - self.forecast_horizon + 1):
            x_train.append(data_norm[i:i+self.window_size])
            y_train.append(data_norm[i+self.window_size:i+self.window_size+self.forecast_horizon])

        x_train = np.array(x_train).reshape(-1, self.window_size, 1)
        y_train = np.array(y_train).reshape(-1, self.forecast_horizon)

        self.model = self.create_model()

        # Callback stop_loss
        early_stop_callback = tf.keras.callbacks.LambdaCallback(
            on_epoch_end=lambda epoch, logs: setattr(
                self.model, 'stop_training', True
            ) if logs['loss'] < stop_loss else None
        )

        print("📈 Entraînement du modèle...")
        self.model.fit(
            x_train,
            y_train,
            epochs=epochs,
            batch_size=16,
            validation_split=0.2,
            callbacks=[early_stop_callback]
        )

        print(f"✅ Modèle sauvegardé dans {self.model_path}")
        self.model.save(self.model_path)
        return True
