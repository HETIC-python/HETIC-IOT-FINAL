import pytest
from src.extensions import db
from src.models import Order


@pytest.fixture(scope="function")
def test_order(app):
    """Order fixture for testing"""
    with app.app_context():
        # Clean up existing orders
        db.session.query(Order).delete()
        db.session.commit()

        order = Order(
            stripe_session_id="test_session_123",
            amount=199.00,
            currency="usd",
            status="pending",
            first_name="John",
            last_name="Doe",
            email="john.doe@example.com",
            mobile="0612345678",
            shipping_address="123 Test Street, Paris"
        )

        db.session.add(order)
        db.session.commit()
        db.session.refresh(order)

        yield order

        # Cleanup
        db.session.query(Order).delete()
        db.session.commit()


class TestOrderRoutes:
    """Tests for order API routes"""

    def test_get_orders_success(self, client, app, test_order):
        """Test getting all orders"""
        with app.app_context():
            response = client.get("/api/orders")
            assert response.status_code == 200
            data = response.get_json()
            assert data["success"] is True
            assert isinstance(data["data"], list)
            assert len(data["data"]) > 0

    def test_get_orders_empty(self, client, app):
        """Test getting orders when no orders exist"""
        with app.app_context():
            # Clear all orders
            db.session.query(Order).delete()
            db.session.commit()

            response = client.get("/api/orders")
            assert response.status_code == 200
            data = response.get_json()
            assert data["success"] is True
            assert isinstance(data["data"], list)
            assert len(data["data"]) == 0

    def test_order_data_structure(self, client, app, test_order):
        """Test that order data has correct structure"""
        with app.app_context():
            response = client.get("/api/orders")
            assert response.status_code == 200
            data = response.get_json()
            
            order_data = data["data"][0]
            assert "id" in order_data
            assert "amount" in order_data
            assert "currency" in order_data
            assert "status" in order_data

