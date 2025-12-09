import pytest
from src.extensions import db
from src.models import Settings, User
from src.service.auth_service import AuthService


@pytest.fixture(scope="function")
def test_user_with_settings(app):
    """User with settings fixture for testing"""
    with app.app_context():
        # Clean up
        db.session.query(Settings).delete()
        db.session.query(User).delete()
        db.session.commit()

        # Create user
        user = User(
            username="settingsuser",
            email="settings@example.com",
            password=AuthService.hash_password("password123"),
            is_validated=True,
        )
        db.session.add(user)
        db.session.commit()
        db.session.refresh(user)

        # Create settings for user
        settings = Settings(
            id=user.id,
            user_id=user.id,
            email_notif=True,
            mobile_notif=True,
            theme_mode="light"
        )
        db.session.add(settings)
        db.session.commit()

        yield user

        # Cleanup
        db.session.query(Settings).delete()
        db.session.query(User).delete()
        db.session.commit()


@pytest.fixture(scope="function")
def auth_headers(app, test_user_with_settings):
    """Generate auth headers with valid token"""
    with app.app_context():
        token = AuthService.create_token(test_user_with_settings.id)
        return {"Authorization": f"Bearer {token}"}


class TestSettingsRoutes:
    """Tests for settings API routes"""

    def test_toggle_email_notification(self, client, app, test_user_with_settings, auth_headers):
        """Test toggling email notification setting"""
        with app.app_context():
            # Get initial state
            settings = Settings.query.get(test_user_with_settings.id)
            initial_state = settings.email_notif

            response = client.put(
                "/api/settings/email_notif",
                headers=auth_headers
            )
            assert response.status_code == 200
            data = response.get_json()
            assert data["message"] == "email_notif toggled successfully"
            assert data["email_notif"] != initial_state

    def test_toggle_mobile_notification(self, client, app, test_user_with_settings, auth_headers):
        """Test toggling mobile notification setting"""
        with app.app_context():
            # Get initial state
            settings = Settings.query.get(test_user_with_settings.id)
            initial_state = settings.mobile_notif

            response = client.put(
                "/api/settings/mobile_notif",
                headers=auth_headers
            )
            assert response.status_code == 200
            data = response.get_json()
            assert data["message"] == "mobile_notif toggled successfully"
            assert data["mobile_notif"] != initial_state

    def test_toggle_theme_mode(self, client, app, test_user_with_settings, auth_headers):
        """Test toggling theme mode between light and dark"""
        with app.app_context():
            response = client.put(
                "/api/settings/theme_mode",
                headers=auth_headers
            )
            assert response.status_code == 200
            data = response.get_json()
            assert data["message"] == "theme_mode toggled successfully"
            assert data["theme_mode"] in ["light", "dark"]

    def test_settings_unauthorized(self, client):
        """Test settings endpoints require authentication"""
        response = client.put("/api/settings/email_notif")
        assert response.status_code == 401
        data = response.get_json()
        assert data["error"] == "Unauthorized"

