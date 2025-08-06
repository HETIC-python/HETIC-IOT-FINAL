import numpy as np
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense
import os

def generate_synthetic_data(seq_length=20, num_samples=1000):
    X, y = [], []
    for _ in range(num_samples):
        base = np.random.uniform(20, 25)
        noise = np.random.normal(0, 0.2, seq_length)
        sequence = base + noise
        X.append(sequence[:-1])
        y.append(sequence[-1])
    X = np.array(X)
    y = np.array(y)
    return X, y

def create_model(input_shape):
    model = Sequential([
        LSTM(64, input_shape=input_shape),
        Dense(1)
    ])
    model.compile(optimizer='adam', loss='mse')
    return model

def train_and_save():
    print("Génération des données...")
    X, y = generate_synthetic_data()
    X = X.reshape((X.shape[0], X.shape[1], 1))

    print("Création du modèle...")
    model = create_model((X.shape[1], 1))

    print("Entraînement...")
    model.fit(X, y, epochs=10, batch_size=32, validation_split=0.2)

    output_path = "saved_model/my_lstm_model"
    os.makedirs(output_path, exist_ok=True)

    print(f"Sauvegarde dans : {output_path}")
    model.save(output_path)
    print("Modèle entraîné et sauvegardé avec succès.")

if __name__ == "__main__":
    train_and_save()
