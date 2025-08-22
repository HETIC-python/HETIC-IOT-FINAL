from datetime import datetime
from src.extensions import db


class Sensor(db.Model):
    __tablename__ = 'sensors'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    status = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)
    # temperature = db.Column(db.Float, nullable=True)
    # humidity = db.Column(db.Float, nullable=True)
    # pressure = db.Column(db.Float, nullable=True)
    # mouvement = db.Column(db.Float, nullable=True)
    workspace_id = db.Column(db.Integer, db.ForeignKey('workspaces.id'), nullable=False)

    def __repr__(self):
        return f"<Sensor {self.name} (id={self.id})>"

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'status': self.status,
            'temperature': self.temperature,
            'humidity': self.humidity,
            'pressure': self.pressure,
            'mouvement': self.mouvement,
            'workspace_id': self.workspace_id,
            'tasks': [{'id': task.id, 'name': task.name} for task in self.tasks]
        }