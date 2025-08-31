from flask import Blueprint, jsonify
from src.extensions import db
from src.models import Settings
from src.service.auth_service import AuthService
from src.decorators.auth_decorator import require_auth

settings_bp = Blueprint("settings", __name__)

# UPDATE Email_notif
@settings_bp.route('/settings/email_notif', methods=["PUT"])
@require_auth
def update_mail_notif(user, request):
    try:
        settings = Settings.query.get(user.id)
        if not settings:
            return jsonify({
                "error": "Not Found", "message": 
                f"User_id with ID {user.id} not found"
            }), 404
        
        else:
            settings.email_notif = not settings.email_notif

            db.session.commit()
            
            return jsonify({
                "message": "email_notif toggled successfully", 
                "user_id": user.id,"email_notif": settings.email_notif
            }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Validation Error", "message": str(e)}), 400

#UPDATE mobile_notif
@settings_bp.route('/settings/mobile_notif', methods=["PUT"])
@require_auth
def update_mobile_notif(user, request):
    try:
        settings = Settings.query.get(user.id)
        if not settings:
            return jsonify({
                "error": "Not Found", "message": 
                f"User_id with ID {user.id} not found"
            }), 404
        
        else:
            settings.mobile_notif = not settings.mobile_notif

            db.session.commit()
            
            return jsonify({
                "message": "mobile_notif toggled successfully", 
                "user_id": user.id,"mobile_notif": settings.mobile_notif
            }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Validation Error", "message": str(e)}), 400