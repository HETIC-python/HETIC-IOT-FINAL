import pytest
from src.extensions import db
from src.models import Workspace, Sensor


class TestWorkspaceRoutes:
    """Tests for workspace API routes"""

    def test_get_workspace_by_id_success(self, client, app, test_workspace):
        """Test getting a specific workspace by ID"""
        with app.app_context():
            response = client.get(f"/api/workspaces/{test_workspace.id}")
            assert response.status_code == 200
            data = response.get_json()
            assert data["id"] == test_workspace.id
            assert data["name"] == test_workspace.name
            assert data["description"] == test_workspace.description

    def test_get_workspace_not_found(self, client):
        """Test getting a workspace that doesn't exist"""
        response = client.get("/api/workspaces/9999")
        assert response.status_code == 404
        data = response.get_json()
        assert data["error"] == "Not Found"

    def test_update_workspace_success(self, client, app, test_workspace):
        """Test updating a workspace"""
        with app.app_context():
            response = client.put(
                f"/api/workspaces/{test_workspace.id}",
                json={"name": "Updated Workspace", "description": "Updated description"}
            )
            assert response.status_code == 200
            data = response.get_json()
            assert data["message"] == "Workspace updated successfully"

    def test_update_workspace_not_found(self, client):
        """Test updating a workspace that doesn't exist"""
        response = client.put(
            "/api/workspaces/9999",
            json={"name": "Updated Name"}
        )
        assert response.status_code == 404
        data = response.get_json()
        assert data["error"] == "Not Found"

    def test_delete_workspace_success(self, client, app, test_workspace):
        """Test deleting a workspace"""
        with app.app_context():
            workspace_id = test_workspace.id
            response = client.delete(f"/api/workspaces/{workspace_id}")
            assert response.status_code == 200
            data = response.get_json()
            assert data["message"] == "Workspace deleted successfully"
            
            # Verify workspace is deleted
            deleted_workspace = Workspace.query.get(workspace_id)
            assert deleted_workspace is None

    def test_delete_workspace_not_found(self, client):
        """Test deleting a workspace that doesn't exist"""
        response = client.delete("/api/workspaces/9999")
        assert response.status_code == 404
        data = response.get_json()
        assert data["error"] == "Not Found"

    def test_get_workspace_sensors_success(self, client, app, test_workspace):
        """Test getting sensors of a workspace"""
        with app.app_context():
            # Add a sensor to the workspace
            sensor = Sensor(name="Test Sensor", workspace_id=test_workspace.id)
            db.session.add(sensor)
            db.session.commit()

            response = client.get(f"/api/workspaces/{test_workspace.id}/sensors")
            assert response.status_code == 200
            data = response.get_json()
            assert isinstance(data, list)
            assert any(s["name"] == "Test Sensor" for s in data)

    def test_get_workspace_sensors_not_found(self, client):
        """Test getting sensors of a workspace that doesn't exist"""
        response = client.get("/api/workspaces/9999/sensors")
        assert response.status_code == 404
        data = response.get_json()
        assert data["error"] == "Not Found"

    def test_get_workspace_sensors_empty(self, client, app, test_workspace):
        """Test getting sensors when workspace has no sensors"""
        with app.app_context():
            # Clear any existing sensors
            Sensor.query.filter_by(workspace_id=test_workspace.id).delete()
            db.session.commit()

            response = client.get(f"/api/workspaces/{test_workspace.id}/sensors")
            assert response.status_code == 200
            data = response.get_json()
            assert isinstance(data, list)
            assert len(data) == 0

