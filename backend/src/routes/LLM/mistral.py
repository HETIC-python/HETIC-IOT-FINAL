import logging
import os
import requests
from flask import Blueprint, request, jsonify

# Configuration du logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

chat_bp = Blueprint("chat_bp", __name__)

MISTRAL_API_KEY = os.getenv("MISTRAL_API_KEY")
MISTRAL_API_URL = "https://api.mistral.ai/v1/chat/completions"

@chat_bp.route("/chat-ai", methods=["POST"])
def chat_ai():
    """Endpoint pour communiquer avec le LLM Mistral"""
    try:
        if not request.is_json:
            return jsonify({"error": "Bad Request", "message": "Content must be JSON"}), 400

        data = request.get_json()
        user_message = data.get("message")
        if not user_message:
            return jsonify({"error": "Bad Request", "message": "message is required"}), 400

        response = requests.post(
        MISTRAL_API_URL,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {MISTRAL_API_KEY}",
        },
        json={
            "model": "open-mistral-7b",
            "messages": [
            {"role": "system", "content": "Vous ne devez répondre qu’au sujet du bien etre des teletravailleurs et de notre application qui leurs fourni les temperatures de leurs capteurs et des conseilles pour ameliorer leurs bien etre. Tout autre sujet est interdit."},
            {"role": "user", "content": "Question de l'utilisateur"}
        ] + [{"role": "user", "content": user_message}],    
            "max_tokens": 500  
        },
        timeout=30
        )
        response.raise_for_status()
        data = response.json()
        ai_text = data["choices"][0]["message"]["content"]

        logger.info(f"Réponse Mistral générée avec succès pour le message: {user_message[:50]}...")
        return jsonify({"response": ai_text}), 200

    except requests.exceptions.RequestException as e:
        logger.error(f"Erreur Mistral: {str(e)}")
        return jsonify({"response": "Erreur lors de la génération de la réponse."}), 500
    except Exception as e:
        logger.error(f"Erreur inattendue lors de l'appel Mistral: {str(e)}")
        return jsonify({"response": "Une erreur inattendue est survenue."}), 500
