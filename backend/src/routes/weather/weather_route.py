from flask import Blueprint, request, jsonify
import requests
import os
from dotenv import load_dotenv

load_dotenv()
API_KEY = os.getenv('OPENWEATHER_API_KEY')

weather_bp = Blueprint('weather', __name__)

@weather_bp.route('/weather/<city>', methods=['GET'])
def get_weather(city):
    try:
        
        geo_url = f"http://api.openweathermap.org/geo/1.0/direct"
        geo_params = {
            "q": city,
            "limit": 1,
            "appid": API_KEY
        }
        
        geo_response = requests.get(geo_url, params=geo_params)
        geo_data = geo_response.json()
        
        if not geo_data:
            return jsonify({"error": "City not found"}), 404
            
        
        lat = geo_data[0]['lat']
        lon = geo_data[0]['lon']
        
        weather_url = "https://api.openweathermap.org/data/3.0/onecall"
        weather_params = {
            "lat": lat,
            "lon": lon,
            "exclude": "minutely,hourly",  
            "units": "metric",  
            "appid": API_KEY
        }
        
        weather_response = requests.get(weather_url, params=weather_params)
        weather_data = weather_response.json()
        
        return jsonify(weather_data)
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500