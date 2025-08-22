import pytest
from src.extensions import db
from src.models import Sensor, Workspace

# @pytest.fixture
# def test_workspace(app):
#     """Fixture pour créer un workspace de test"""
#     with app.app_context():
#         ws = Workspace(name="Test Workspace")
#         db.session.add(ws)
#         db.session.commit()
#         yield ws
#         db.session.delete(ws)
#         db.session.commit()


class TestSensorRoutes:

    def test_create_sensor_success(self, client, app, test_workspace):
        with app.app_context():
            response = client.post(
                "/api/sensors",
                json={
                    "name": "Temp Sensor",
                    "status": "active",
                    # "type": "temperature",
                    "workspace_id": test_workspace.id,
                },
            )
            print(response.data)
            assert response.status_code == 201
            data = response.get_json()
            assert data["sensor"]["name"] == "Temp Sensor"
            assert data["sensor"]["workspace_id"] == test_workspace.id

    def test_create_sensor_invalid_workspace(self, client):
        response = client.post(
            "/api/sensors",
            json={"name": "Sensor X", "workspace_id": 9999},  # inexistant
        )
        assert response.status_code == 404
        assert b"Workspace not found" in response.data

    def test_get_all_sensors(self, client, app, test_workspace):
        with app.app_context():
            s = Sensor(name="Light Sensor", workspace_id=test_workspace.id)
            db.session.add(s)
            db.session.commit()

            response = client.get("/api/sensors")
            assert response.status_code == 200
            data = response.get_json()
            assert any(sensor["name"] == "Light Sensor" for sensor in data)

    def test_get_sensor_by_id(self, client, app, test_workspace):
        with app.app_context():
            s = Sensor(name="Pressure Sensor", workspace_id=test_workspace.id)
            db.session.add(s)
            db.session.commit()

            response = client.get(f"/api/sensors/{s.id}")
            assert response.status_code == 200
            data = response.get_json()
            assert data["name"] == "Pressure Sensor"

    def test_get_sensor_not_found(self, client):
        response = client.get("/api/sensors/9999")
        assert response.status_code == 404
        assert b"Sensor not found" in response.data

    def test_update_sensor_success(self, client, app, test_workspace):
        with app.app_context():
            s = Sensor(name="Old Sensor", workspace_id=test_workspace.id)
            db.session.add(s)
            db.session.commit()

            response = client.put(
                f"/api/sensors/{s.id}", json={"name": "Updated Sensor"}
            )
            assert response.status_code == 200
            data = response.get_json()
            assert data["sensor"]["name"] == "Updated Sensor"

    def test_update_sensor_invalid_workspace(self, client, app, test_workspace):
        with app.app_context():
            s = Sensor(name="Humidity Sensor", workspace_id=test_workspace.id)
            db.session.add(s)
            db.session.commit()

            response = client.put(f"/api/sensors/{s.id}", json={"workspace_id": 9999})
            assert response.status_code == 404
            assert b"Workspace not found" in response.data

    def test_delete_sensor_success(self, client, app, test_workspace):
        with app.app_context():
            s = Sensor(name="To Delete", workspace_id=test_workspace.id)
            db.session.add(s)
            db.session.commit()

            response = client.delete(f"/api/sensors/{s.id}")
            assert response.status_code == 200
            assert b"Sensor deleted" in response.data

            s_deleted = Sensor.query.get(s.id)
            assert s_deleted is None

    def test_delete_sensor_not_found(self, client):
        response = client.delete("/api/sensors/9999")
        assert response.status_code == 404
        assert b"Sensor not found" in response.data
