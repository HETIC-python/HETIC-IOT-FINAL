from app import create_app

app = create_app()


@app.route("/")
def home():
    print("Home route accessed")
    return jsonify({"message": "Welcome to the Flask app!"}), 200


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
