import numpy as np
import tensorflow as tf
import os

class TrainService:
    def generate_data(self, seq_length=20, num_samples=1000):
        X, y = [], []
        for _ in range(num_samples):
            base = np.random.uniform(20, 25)
            noise = np.random.normal(0, 0.2, seq_length)
            sequence = base + noise
            X.append(sequence[:-1])
            y.append(sequence[-1])
        X = np.array(X)
        y = np.array(y)
        X = X.reshape((X.shape[0], X.shape[1], 1))
        return X, y

    def create_model(self, input_shape):
        model = tf.keras.Sequential([
            tf.keras.layers.LSTM(64, input_shape=input_shape),
            tf.keras.layers.Dense(1)
        ])
        model.compile(optimizer='adam', loss='mse')
        return model

    def train_and_save_model(self):
        X, y = self.generate_data()
        X = X.reshape((X.shape[0], X.shape[1], 1))
        model = self.create_model((X.shape[1], 1))
        
        print("Entraînement du modèle...")
        model.fit(X, y, epochs=10, batch_size=32, validation_split=0.2)
        
        output_path = "/tmp/my_lstm_model.keras"
        print(f"Sauvegarde du modèle dans : {output_path}")
        model.save(output_path)
        
        print("Modèle entraîné et sauvegardé avec succès.")
        return True

