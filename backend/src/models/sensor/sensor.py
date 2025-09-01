from datetime import datetime

from src.extensions import db


class Sensor(db.Model):
    __tablename__ = "sensors"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    source_id = db.Column(db.String(100), unique=True, nullable=True)
    status = db.Column(db.String(20), default="inactive")
    workspace_id = db.Column(db.Integer, db.ForeignKey("workspaces.id"), nullable=False)

    def __repr__(self):
        return f"<Sensor {self.name} (id={self.id})>"

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "status": self.status,
            "workspace_id": self.workspace_id,
            "source_id": self.source_id,
        }