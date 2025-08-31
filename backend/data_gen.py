import json
import numpy as np

def generate_daily_temps(num_days=1000, base_temp=12, amplitude=10, noise=2):
    """
    Génère une longue série de températures journalières réalistes.
    - base_temp : température moyenne annuelle
    - amplitude : variation saisonnière
    - noise : bruit aléatoire
    """
    days = np.arange(num_days)
    # Variation saisonnière sinusoïdale sur 365 jours
    seasonal = base_temp + amplitude * np.sin(2 * np.pi * days / 365 - np.pi/2)
    temps = seasonal + np.random.normal(0, noise, num_days)
    return temps.reshape(-1,1).tolist()  # forme (num_days, 1)

def generate_dataset(num_days=1000):
    """
    Crée le dictionnaire JSON prêt à envoyer au serveur.
    """
    data = generate_daily_temps(num_days=num_days)
    return {"input": data}

if __name__ == "__main__":
    dataset = generate_dataset(num_days=1000)
    with open("daily_temps_week.json", "w") as f:
        json.dump(dataset, f, indent=2)
    print("✅ Fichier 'daily_temps_week.json' généré avec succès !")
    print("Format prêt pour LSTM : (n_timesteps=1000, n_features=1)")

