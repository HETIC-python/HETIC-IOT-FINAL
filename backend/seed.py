from src import create_app
from src.seeds import run_seeds

if __name__ == '__main__':
    app = create_app()
    with app.app_context():
        run_seeds()
