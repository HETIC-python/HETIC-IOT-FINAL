import pytest
from src.models.task.task import Task


def test_get_tasks(client, test_task):
    """Test getting all tasks"""
    response = client.get("/api/tasks")
    assert response.status_code == 200
    data = response.json
    assert isinstance(data, list)
    assert len(data) > 0
    assert data[0]["name"] == test_task.name


def test_get_single_task(client, test_task):
    """Test getting a single task"""
    response = client.get(f"/api/tasks/{test_task.id}")
    assert response.status_code == 200
    data = response.json
    assert data["name"] == test_task.name
    assert data["description"] == test_task.description
    assert data["status"] == test_task.status


def test_create_task(client):
    """Test creating a new task"""
    task_data = {
        "name": "New Task",
        "description": "A new test task",
        "status": "pending",
    }
    response = client.post("/api/tasks", json=task_data)
    assert response.status_code == 201
    data = response.json
    assert "id" in data

    
    created_task = Task.query.get(data["id"])
    assert created_task is not None
    assert created_task.name == task_data["name"]


def test_create_task_missing_fields(client):
    """Test creating a task with missing required fields"""
    response = client.post("/api/tasks", json={})
    assert response.status_code == 400
    assert "error" in response.json


def test_update_task(client, test_task):
    """Test updating a task"""
    update_data = {"name": "Updated Task", "status": "completed"}
    response = client.put(f"/api/tasks/{test_task.id}", json=update_data)
    assert response.status_code == 200


    updated_task = Task.query.get(test_task.id)
    assert updated_task.name == update_data["name"]
    assert updated_task.status == update_data["status"]
   
    assert updated_task.description == test_task.description


def test_delete_task(client, test_task):
    """Test deleting a task"""
    response = client.delete(f"/api/tasks/{test_task.id}")
    assert response.status_code == 200

   
    deleted_task = Task.query.get(test_task.id)
    assert deleted_task is None


def test_add_sensor_to_task(client, test_task, test_sensor):
    """Test adding a single sensor to a task"""
    response = client.post(f"/api/tasks/{test_task.id}/sensors/{test_sensor.id}")
    assert response.status_code == 200

    data = response.json
   
    assert any(s["id"] == test_sensor.id for s in data["sensors"])

    
    response = client.post(f"/api/tasks/{test_task.id}/sensors/{test_sensor.id}")
    assert response.status_code == 400
    assert "error" in response.json


def test_add_sensor_to_task_invalid_ids(client, test_task):
    """Test adding a sensor with invalid IDs"""
    
    response = client.post(f"/api/tasks/999/sensors/1")
    assert response.status_code == 404


    response = client.post(f"/api/tasks/{test_task.id}/sensors/999")
    assert response.status_code == 404


def test_add_sensor_to_task2(client, test_task, test_sensor):
    """Test adding a sensor to a task"""
    response = client.post(f"/api/tasks/{test_task.id}/sensors/{test_sensor.id}")
    assert response.status_code == 200
    data = response.json
    assert any(s["id"] == test_sensor.id for s in data["sensors"])


def test_remove_sensor_from_task(client, test_task):
    """Test removing a sensor from a task"""
    sensor_id = 1  
    client.post(f"/api/tasks/{test_task.id}/sensors", json={"sensor_ids": [sensor_id]})

    response = client.delete(f"/api/tasks/{test_task.id}/sensors/{sensor_id}")
    assert response.status_code == 200
    data = response.json
    assert not any(s["id"] == sensor_id for s in data["sensors"])


@pytest.mark.parametrize("invalid_id", [0, 999999, "abc"])
def test_get_nonexistent_task(client, invalid_id):
    """Test getting a task that doesn't exist"""
    response = client.get(f"/api/tasks/{invalid_id}")
    assert response.status_code == 404


def test_task_representation(test_task):
    """Test the string representation of a Task"""
    assert str(test_task) == f"<Task {test_task.name}>"


def test_task_to_dict(test_task):
    """Test the to_dict method of Task"""
    task_dict = test_task.to_dict()
    assert isinstance(task_dict, dict)
    assert task_dict["name"] == test_task.name
    assert task_dict["description"] == test_task.description
    assert task_dict["status"] == test_task.status
    assert "created_at" in task_dict
    assert "updated_at" in task_dict
    assert "sensors" in task_dict
    assert "sensors" in task_dict
