from app.extensions import db

class Place(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.string(10))
    created_at = db.Column(db.DateTime, nullable = False)
    update_at = db.Column(db.DateTime, nullable = False)

    def __repr__(self):
        return