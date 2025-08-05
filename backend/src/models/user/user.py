from datetime import datetime

from sqlalchemy.orm import relationship
from src.extensions import db


class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # TODO: Relationship with Order
    # orders = relationship("Order", back_populates="user", lazy='dynamic')

    def __repr__(self):
        return f'<User {self.email}>'