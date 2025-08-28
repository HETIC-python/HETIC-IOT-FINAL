from datetime import datetime

from src.extensions import db

sensor_task = db.Table('sensor_task',
    db.Column('sensor_id', db.Integer, db.ForeignKey('sensors.id', ondelete='CASCADE'), primary_key=True),
    db.Column('task_id', db.Integer, db.ForeignKey('tasks.id', ondelete='CASCADE'), primary_key=True),
    db.Column('created_at', db.DateTime, nullable=False, default=datetime.utcnow)
)

class Task(db.Model):
    __tablename__ = 'tasks'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.String(255), nullable=False)
    status = db.Column(db.String(255), nullable=False, default='pending')
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    # relations entre sensor avec task
    sensors = db.relationship('Sensor', secondary=sensor_task, backref=db.backref('tasks', lazy='dynamic'))

    def __repr__(self):
        return f'<Task {self.name}>'

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'status': self.status,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'sensors': [{'id': sensor.id, 'name': sensor.name} for sensor in self.sensors]
        }



