from src import create_app
from flask import jsonify
from src.routes.workspace.workspace_routes import workspace_bp
app = create_app()


@app.route("/")
def home():
    a=18
    print("Home route accessed")
    return jsonify({"message": "Welcome to the Flask app! uwu"}), 200

app.register_blueprint(workspace_bp, url_prefix="/api")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
