from src.models import User
from src.extensions import db

class UserService:
    @staticmethod
    def get_user_by_id(user_id):
        return User.query.get(user_id)

    @staticmethod
    def get_user_by_email(email):
        return User.query.filter_by(email=email).first()

    @staticmethod
    def create_user(user_data):
        user = User(**user_data)
        db.session.add(user)
        db.session.commit()
        return user

    @staticmethod
    def update_user(user_id, update_data):
        user = UserService.get_user_by_id(user_id)
        if user:
            for key, value in update_data.items():
                setattr(user, key, value)
            db.session.commit()
        return user
