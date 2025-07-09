from src.extensions import db

class Workspace(db.Model):
    __tablename__ = 'workspaces'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    sensor_id = db.Column(db.Integer, db.ForeignKey('sensors.id'), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False)
    updated_at = db.Column(db.DateTime, nullable=False)
    is_active = db.Column(db.Boolean, nullable=False)

    def __repr__(self):
        return f'<Workspace {self.name}>'
