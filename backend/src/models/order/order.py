from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, Float, Integer, String
from src.extensions import db


class Order(db.Model):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True)
    # user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), nullable=True)  # Made nullable for now
    stripe_session_id = Column(String, unique=True)
    stripe_payment_intent_id = Column(String, unique=True)
    customer_order_id = Column(String(50), unique=True, nullable=False)
    amount = Column(Float, nullable=False)
    currency = Column(String, default="usd")
    status = Column(String, default="pending")  # pending, completed, failed
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    # Customer Information - make nullable initially
    first_name = Column(String(255), nullable=True)
    last_name = Column(String(255), nullable=True)
    email = Column(String(255), nullable=True)
    mobile = Column(String(20), nullable=True)
    shipping_address = Column(String(500), nullable=True)

    # TODO: Update relationship with back_populates
    # user = relationship("User", back_populates="orders", lazy='joined')

    def __repr__(self):
        return f"<Order {self.id} - {self.status}>"
