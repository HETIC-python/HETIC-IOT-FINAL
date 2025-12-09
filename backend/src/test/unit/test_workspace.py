import pytest
from src.extensions import db
from src.models import Workspace


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

