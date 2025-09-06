from datetime import datetime

from sqlalchemy.orm import relationship
from src.extensions import db


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)  # Added username
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    is_validated = db.Column(db.Boolean, default=False)  # Added for account validation
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Address fields
    address_line = db.Column(db.String(255), nullable=True)
    city = db.Column(db.String(100), nullable=True)
    postal_code = db.Column(db.String(20), nullable=True)
    country = db.Column(db.String(100), nullable=True)

    role = db.Column(
        db.Enum("admin", "user", name="user_roles"), default="user", nullable=False
    )

    workspaces = db.relationship(
        "Workspace", back_populates="user", cascade="all, delete-orphan"
    )

    @property
    def is_admin(self):
        return self.role == "admin"

    # TODO: Relationship with Order
    # orders = relationship("Order", back_populates="user", lazy='dynamic')

    def __repr__(self):
        return f"<User {self.email}>"
