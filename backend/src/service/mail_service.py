from flask import current_app
from flask_mail import Message, Mail

class MailService:
    @staticmethod
    def send_email(to, subject, body):
        mail = Mail(current_app)
        msg = Message(
            subject,
            recipients=[to],
            body=body,
            sender=current_app.config['MAIL_DEFAULT_SENDER']
        )
        mail.send(msg)

    @staticmethod
    def send_validation_email(email, token):
        #subject = "Validate your account"
        #validation_link = f"{current_app.config['FRONTEND_URL']}/validate?token={token}"
        #body = f"Please click on this link to validate your account: {validation_link}"
        #MailService.send_email(email, subject, body)
        return  # Placeholder for actual implementation

    @staticmethod
    def send_reset_password_email(email, token):
        #subject = "Reset your password"
        #reset_link = f"{current_app.config['FRONTEND_URL']}/reset-password?token={token}"
        #body = f"Please click on this link to reset your password: {reset_link}"
        #MailService.send_email(email, subject, body)
        return  # Placeholder for actual implementation
