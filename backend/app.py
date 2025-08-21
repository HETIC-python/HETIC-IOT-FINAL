from flask import jsonify
from flask_cors import CORS
from src import create_app

app = create_app()
CORS(
    app,
    resources={
        r"/*": {  # Allow all routes
            "origins": "*",  # Allow all origins
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["*"],  # Allow all headers
            "expose_headers": ["*"],
        }
    },
)


@app.route("/")
def home():
    print("Home route accessed")
    return jsonify({"message": "Welcome to the Flask app! uwu"}), 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
