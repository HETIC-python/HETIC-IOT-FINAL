from src.extensions import db


class Workspace(db.Model):
    __tablename__ = "workspaces"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True) 
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.String(255), nullable=False)
    created_at = db.Column(
        db.DateTime, nullable=False, default=db.func.current_timestamp()
    )
    updated_at = db.Column(
        db.DateTime,
        nullable=False,
        default=db.func.current_timestamp(),
        onupdate=db.func.current_timestamp(),
    )
    is_active = db.Column(db.Boolean, nullable=False)

    # Define relationship after both classes exist
    sensors = db.relationship("Sensor", backref="workspace", lazy=True)

    def __repr__(self):
        return f"<Workspace {self.name}>"