import os

import requests
from flask import jsonify

MISTRAL_API_KEY = os.getenv("MISTRAL_API_KEY")
MISTRAL_API_URL = "https://api.mistral.ai/v1/chat/completions"


class AIService:
    def __init__(self):
        pass

    @staticmethod
    def call_ai_service(msg, system_prompt):
        try:
            response = requests.post(
                MISTRAL_API_URL,
                headers={
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer {MISTRAL_API_KEY}",
                },
                json={
                    "model": "open-mistral-7b",
                    "messages": [
                        {
                            "role": "system",
                            "content": system_prompt,
                        },
                        {"role": "user", "content": "Question de l'utilisateur"},
                    ]
                    + [{"role": "user", "content": msg}],
                    "max_tokens": 500,
                },
                timeout=30,
            )
            response.raise_for_status()
            data = response.json()
            ai_text = data["choices"][0]["message"]["content"]

            return jsonify({"success": True, "response": ai_text}), 200

        except requests.exceptions.RequestException as e:
            return (
                jsonify(
                    {
                        "success": False,
                        "response": "Erreur lors de la génération de la réponse.",
                    }
                ),
                500,
            )
        except Exception as e:
            return (
                jsonify(
                    {
                        "success": False,
                        "response": "Une erreur inattendue est survenue.",
                    }
                ),
                500,
            )

    @staticmethod
    def analyze_sleep_data(msg):
        sys_prompt = (
            "You are an assistant that analyzes sleep temperature data. "
            "You will receive timestamps and temperature readings. "
            "Your job is to determine if the sleep temperature is too high, "
            "too low, or within a healthy range. "
            "If risky, explain why. "
            "focus on brain activity during sleep."
            "Respond ONLY in valid HTML, it will be wrapped in <!DOCTYPE html><html><body>"
            "Allowed tags: <p>, <b>. "
            "Keep the analysis short and clear."
        )
        res, status_code = AIService.call_ai_service(
            "8 - 12 degree | 12 -> 28degree", sys_prompt
        )
        res_json = res.get_json()
        return res_json

    @staticmethod
    def analyze_work_data(sensor):
        sys_prompt = (
            "You are an assistant that analyzes work hours temperature data. "
            "You will receive timestamps and temperature readings. "
            "Your job is to determine if the work hours temperature is too high, "
            "too low, or within a healthy range. "
            "If risky, explain why. "
            "focus on brain activity during work."
            "Respond ONLY in valid HTML, it will be wrapped in <!DOCTYPE html><html><body>"
            "Allowed tags: <p>, <b>. "
            "Keep the analysis short and clear."
            "give only the analysis part and do not anything else"
        )
        res, status_code = AIService.call_ai_service(
            "8 - 12 degree | 12 -> 28degree", sys_prompt
        )
        res_json = res.get_json()
        return res_json
        # Implement work data analysis logic here
        pass
