import os

from flask import current_app, render_template
from flask_mail import Mail, Message


class MailService:
    @staticmethod
    def _render_template(template_name, **kwargs):
        template_path = os.path.join("emails", template_name)
        return render_template(template_path, **kwargs)

    @staticmethod
    def get_mail_config():
        username = os.getenv("SEND_EMAIL_USERNAME")
        password = os.getenv("SEND_EMAIL_PASSWORD")

        return {
            "MAIL_SERVER": "sandbox.smtp.mailtrap.io",
            "MAIL_PORT": 2525,
            "MAIL_USERNAME": username,
            "MAIL_PASSWORD": password,
            "MAIL_USE_TLS": True,
            "MAIL_USE_SSL": False,
            "MAIL_DEFAULT_SENDER": "noreply@sentio.io",
        }

    @staticmethod
    def send_email(to, subject, template_name, **kwargs):
        # Configure mail with Mailtrap settings
        mail_config = MailService.get_mail_config()
        current_app.config.update(mail_config)
        mail = Mail(current_app)
        html = MailService._render_template(template_name, **kwargs)

        msg = Message(
            subject,
            recipients=[to],
            html=html,
            sender=("Sentio IoT", mail_config["MAIL_DEFAULT_SENDER"]),
        )
        #mail.send(msg)

    @staticmethod
    def send_validation_email(email, token):
        FRONT_END_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")
        validation_link = f"{FRONT_END_URL}/validate?token={token}"
        MailService.send_email(
            to=email,
            subject="Welcome to Sentio - Verify Your Account",
            template_name="account_validation.html",
            validation_link=validation_link,
        )

    @staticmethod
    def send_reset_password_email(email, token):
        FRONT_END_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")
        reset_link = f"{FRONT_END_URL}/reset-password?token={token}"
        MailService.send_email(
            to=email,
            subject="Sentio - Password Reset Request",
            template_name="password_reset.html",
            reset_link=reset_link,
        )