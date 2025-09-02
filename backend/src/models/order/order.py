from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, Float, Integer, String
from src.extensions import db


class Order(db.Model):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True)
    stripe_session_id = Column(String, unique=True)
    stripe_payment_intent_id = Column(String, unique=True)
    # customer_order_id = Column(String(50), unique=True, nullable=False)
    amount = Column(Float, nullable=False)
    currency = Column(String, default="usd")
    status = Column(String, default="pending")  # pending, completed, failed
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )
    first_name = Column(String(255), nullable=True)
    last_name = Column(String(255), nullable=True)
    email = Column(String(255), nullable=True)
    mobile = Column(String(20), nullable=True)
    shipping_address = Column(String(500), nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "stripe_session_id": self.stripe_session_id,
            "stripe_payment_intent_id": self.stripe_payment_intent_id,
            "amount": self.amount,
            "currency": self.currency,
            "status": self.status,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "email": self.email,
            "mobile": self.mobile,
            "shipping_address": self.shipping_address,
        }

    def __repr__(self):
        return f"<Order {self.id} - {self.status}>"
    shipping_address = Column(String(500), nullable=True)

    # TODO: Update relationship with back_populates
    # user = relationship("User", back_populates="orders", lazy='joined')

    def __repr__(self):
        return f"<Order {self.id} - {self.status}>"
