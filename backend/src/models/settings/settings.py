from src.extensions import db

class Settings(db.Model):
    __tablename__= "settings"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    email_notif = db.Column(db.Boolean, nullable=True)
    mobile_notif = db.Column(db.Boolean, nullable=True)
    theme_mode = db.Column(db.String(10), nullable=False, default="light")

    def __repr__(self):
        return f"<Settings user_id={self.user_id}>"
    
    def to__dict(self):
        return {
            "userId": self.user_id,
            "email_notif": self.email_notif,
            "mobile_notif": self.mobile_notif,
            "theme_mod": self.theme_mode
        }