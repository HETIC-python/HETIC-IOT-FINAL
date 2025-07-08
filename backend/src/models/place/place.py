from ...extensions import db

class Place(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    lieu = db.Column(db.String(80), unique=True, nullable=False)

    def __repr__(self):
        return f'<User {self.lieu}>' 