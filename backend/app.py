from flask import jsonify
from flask_cors import CORS
from src import create_app
from src.routes.order.order import order_bp
from src.routes.workspace.workspace_routes import workspace_bp

app = create_app()
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:3000", "http://localhost:5173"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})


@app.route("/")
def home():
    print("Home route accessed")
    return jsonify({"message": "Welcome to the Flask app! uwu"}), 200

# app.register_blueprint(workspace_bp, url_prefix="/api")
# app.register_blueprint(order_bp, url_prefix='/api')

@app.route("/")
def home():
    return jsonify({"message": "Welcome to the Flask app! uwu"}), 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
